import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrganizationsBarComponent } from '../organizations-bar/organizations-bar.component';
import { AddOrganizationDialogComponent } from '../add-organization-dialog/add-organization-dialog.component';
import { AddSpaceDialogComponent } from '../add-space-dialog/add-space-dialog.component';
import { DeleteOrganizationDialogComponent } from '../delete-organization-dialog/delete-organization-dialog.component';
import { EditNameDialogComponent } from '../edit-name-dialog/edit-name-dialog.component';
import { DeviceCommandServiceImpl } from '../../../application/internal/commandservices/device-command-service.impl';
import { DeviceQueryServiceImpl } from '../../../application/internal/queryservices/device-query-service.impl';
import { Organization, Space } from '../../../domain/services/device-query-service';
import { OrganizationId } from '../../../domain/model/valueobjects/organization-id.value-object';
import { SpaceId } from '../../../domain/model/valueobjects/space-id.value-object';
import { createGetOrganizationsByOwnerQuery } from '../../../domain/model/queries/get-organizations-by-owner.query';
import { createGetSpacesByOrganizationQuery } from '../../../domain/model/queries/get-spaces-by-organization.query';
import { createGetDevicesBySpaceQuery } from '../../../domain/model/queries/get-devices-by-space.query';
import { createCreateOrganizationCommand } from '../../../domain/model/commands/create-organization.command';
import { createUpdateOrganizationNameCommand } from '../../../domain/model/commands/update-organization-name.command';
import { createDeleteOrganizationCommand } from '../../../domain/model/commands/delete-organization.command';
import { createCreateSpaceCommand } from '../../../domain/model/commands/create-space.command';
import { createUpdateSpaceNameCommand } from '../../../domain/model/commands/update-space-name.command';
import { createUserId } from '../../../domain/model/valueobjects/user-id.value-object';
import { TOKEN_STORAGE_GATEWAY, TokenStorageGateway } from '../../../../iam/infrastructure/storage/token-storage.gateway';
import { jwtDecode } from 'jwt-decode';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-organizations-panel',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatSnackBarModule, OrganizationsBarComponent],
  templateUrl: './organizations-panel.component.html',
  styleUrl: './organizations-panel.component.css',
})
export class OrganizationsPanelComponent implements OnInit {
  private readonly deviceCommandService = inject(DeviceCommandServiceImpl);
  private readonly deviceQueryService = inject(DeviceQueryServiceImpl);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly tokenStorage = inject<TokenStorageGateway>(TOKEN_STORAGE_GATEWAY);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() selectedSpaceId: string | null = null;
  @Output() spaceSelected = new EventEmitter<Space>();
  @Output() selectedSpaceCleared = new EventEmitter<void>();

  organizations: Organization[] = [];
  expandedOrganizationIds: Record<string, boolean> = {};
  spacesByOrganizationId: Record<string, Space[]> = {};
  loadingSpacesByOrganizationId: Record<string, boolean> = {};
  errorSpacesByOrganizationId: Record<string, string> = {};
  deviceCountsBySpaceId: Record<string, number> = {};

  ngOnInit(): void {
    this.loadOrganizations();
  }

  toggleOrganization(orgId: OrganizationId): void {
    const key = orgId.value;
    this.expandedOrganizationIds = {
      ...this.expandedOrganizationIds,
      [key]: !this.expandedOrganizationIds[key],
    };

    if (this.expandedOrganizationIds[key] && !this.spacesByOrganizationId[key] && !this.loadingSpacesByOrganizationId[key]) {
      this.loadSpaces(orgId);
    }
  }

  selectSpace(spaceId: SpaceId): void {
    const space = this.allSpaces.find((currentSpace) => currentSpace.id.value === spaceId.value);
    if (space) this.spaceSelected.emit(space);
  }

  openAddOrganizationDialog(): void {
    const dialogRef = this.dialog.open(AddOrganizationDialogComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((name: string | undefined) => {
      if (!name) return;
      const userId = this.getCurrentUserId();
      if (!userId) return;
      const command = createCreateOrganizationCommand(name, createUserId(userId));
      this.deviceCommandService.handleCreateOrganization(command).subscribe({
        next: () => {
          this.snackBar.open('Organization created', 'Close', { duration: 3000 });
          this.loadOrganizations();
        },
        error: () => this.snackBar.open('Failed to create organization', 'Close', { duration: 3000 }),
      });
    });
  }

  openEditOrganizationDialog(orgId: OrganizationId): void {
    const organization = this.organizations.find((org) => org.id.value === orgId.value);
    if (!organization) return;
    const dialogRef = this.dialog.open(EditNameDialogComponent, {
      width: '400px',
      data: {
        currentValue: organization.name,
        title: 'Edit Organization',
        fieldLabel: 'Organization Name',
        placeholder: 'Enter organization name',
      },
    });
    dialogRef.afterClosed().subscribe((name: string | undefined) => {
      if (!name) return;
      const command = createUpdateOrganizationNameCommand(orgId, name);
      this.deviceCommandService.handleUpdateOrganizationName(command).subscribe({
        next: () => {
          this.snackBar.open('Organization updated', 'Close', { duration: 3000 });
          this.loadOrganizations();
        },
        error: (error) => this.snackBar.open(this.getErrorMessage(error, 'Failed to update organization'), 'Close', { duration: 3000 }),
      });
    });
  }

  openDeleteOrganizationDialog(orgId: OrganizationId): void {
    const dialogRef = this.dialog.open(DeleteOrganizationDialogComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      const command = createDeleteOrganizationCommand(orgId);
      this.deviceCommandService.handleDeleteOrganization(command).subscribe({
        next: () => {
          this.snackBar.open('Organization deleted', 'Close', { duration: 3000 });
          if (this.spacesByOrganizationId[orgId.value]?.some((space) => space.id.value === this.selectedSpaceId)) {
            this.selectedSpaceCleared.emit();
          }
          this.loadOrganizations();
        },
        error: (error) => this.snackBar.open(this.getErrorMessage(error, 'Failed to delete organization'), 'Close', { duration: 3000 }),
      });
    });
  }

  openAddSpaceDialog(orgId: OrganizationId): void {
    const dialogRef = this.dialog.open(AddSpaceDialogComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((name: string | undefined) => {
      if (!name) return;
      const userId = this.getCurrentUserId();
      if (!userId) return;
      const command = createCreateSpaceCommand(name, orgId, createUserId(userId));
      this.deviceCommandService.handleCreateSpace(command).subscribe({
        next: () => {
          this.snackBar.open('Space created', 'Close', { duration: 3000 });
          this.loadSpaces(orgId);
        },
        error: () => this.snackBar.open('Failed to create space', 'Close', { duration: 3000 }),
      });
    });
  }

  openEditSpaceDialog(spaceId: SpaceId): void {
    const space = this.allSpaces.find((currentSpace) => currentSpace.id.value === spaceId.value);
    if (!space) return;
    const dialogRef = this.dialog.open(EditNameDialogComponent, {
      width: '400px',
      data: {
        currentValue: space.name,
        title: 'Edit Space',
        fieldLabel: 'Space Name',
        placeholder: 'Enter space name',
      },
    });
    dialogRef.afterClosed().subscribe((name: string | undefined) => {
      if (!name) return;
      const command = createUpdateSpaceNameCommand(spaceId, name);
      this.deviceCommandService.handleUpdateSpaceName(command).subscribe({
        next: () => {
          this.snackBar.open('Space updated', 'Close', { duration: 3000 });
          this.loadSpaces(space.organizationId);
        },
        error: (error) => this.snackBar.open(this.getErrorMessage(error, 'Failed to update space'), 'Close', { duration: 3000 }),
      });
    });
  }

  private loadOrganizations(): void {
    const userId = this.getCurrentUserId();
    const query = createGetOrganizationsByOwnerQuery(createUserId(userId ?? 'unknown'));
    this.deviceQueryService.handleGetOrganizationsByOwner(query).subscribe({
      next: (orgs) => {
        this.organizations = orgs;
        this.cdr.markForCheck();
      },
      error: () => this.snackBar.open('Failed to load organizations', 'Close', { duration: 3000 }),
    });
  }

  loadSpaces(orgId: OrganizationId): void {
    const key = orgId.value;
    this.loadingSpacesByOrganizationId = { ...this.loadingSpacesByOrganizationId, [key]: true };
    this.errorSpacesByOrganizationId = { ...this.errorSpacesByOrganizationId, [key]: '' };
    const query = createGetSpacesByOrganizationQuery(orgId);
    this.deviceQueryService.handleGetSpacesByOrganization(query).subscribe({
      next: (spaces) => {
        this.spacesByOrganizationId = { ...this.spacesByOrganizationId, [key]: spaces };
        this.loadingSpacesByOrganizationId = { ...this.loadingSpacesByOrganizationId, [key]: false };
        this.loadDeviceCountsForSpaces(spaces);
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorSpacesByOrganizationId = { ...this.errorSpacesByOrganizationId, [key]: 'Failed to load spaces' };
        this.loadingSpacesByOrganizationId = { ...this.loadingSpacesByOrganizationId, [key]: false };
        this.cdr.markForCheck();
      },
    });
  }

  private loadDeviceCountsForSpaces(spaces: Space[]): void {
    if (spaces.length === 0) return;
    const requests = spaces.map((space) =>
      this.deviceQueryService.handleGetDevicesBySpace(createGetDevicesBySpaceQuery(space.id, 0, 1)).pipe(
        map((page) => ({ spaceId: space.id.value, totalElements: page.totalElements })),
        catchError(() => of({ spaceId: space.id.value, totalElements: 0 }))
      )
    );
    forkJoin(requests).subscribe((results) => {
      this.deviceCountsBySpaceId = {
        ...this.deviceCountsBySpaceId,
        ...results.reduce<Record<string, number>>((acc, item) => {
          acc[item.spaceId] = item.totalElements;
          return acc;
        }, {}),
      };
      this.cdr.markForCheck();
    });
  }

  private get allSpaces(): Space[] {
    return Object.values(this.spacesByOrganizationId).flat();
  }

  private getCurrentUserId(): string | null {
    const token = this.tokenStorage.getAccessToken();
    if (!token) return null;
    try {
      const payload = jwtDecode<{ sub: string }>(token);
      return payload.sub ?? null;
    } catch {
      return null;
    }
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === 'object' && 'error' in error) {
      const responseBody = (error as { error?: unknown }).error;
      if (responseBody && typeof responseBody === 'object' && 'message' in responseBody) {
        const message = (responseBody as { message?: unknown }).message;
        if (typeof message === 'string' && message.trim().length > 0) return message;
      }
    }
    return fallback;
  }
}

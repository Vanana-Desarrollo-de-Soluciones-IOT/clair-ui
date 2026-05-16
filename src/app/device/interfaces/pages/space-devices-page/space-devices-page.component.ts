import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SidebarComponent } from '../../../../shared/interfaces/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/interfaces/components/header/header.component';
import { DeviceCardComponent } from '../../components/device-card/device-card.component';
import { AddOrganizationDialogComponent } from '../../components/add-organization-dialog/add-organization-dialog.component';
import { EditOrganizationDialogComponent } from '../../components/edit-organization-dialog/edit-organization-dialog.component';
import { DeleteOrganizationDialogComponent } from '../../components/delete-organization-dialog/delete-organization-dialog.component';
import { AddSpaceDialogComponent } from '../../components/add-space-dialog/add-space-dialog.component';
import { OrganizationsBarComponent } from '../../components/organizations-bar/organizations-bar.component';
import { RegisterDeviceDialogComponent } from '../../components/register-device-dialog/register-device-dialog.component';
import { DeviceCommandServiceImpl } from '../../../application/internal/commandservices/device-command-service.impl';
import { DeviceQueryServiceImpl } from '../../../application/internal/queryservices/device-query-service.impl';
import { Organization, Space, Device, DevicePage } from '../../../domain/services/device-query-service';
import { OrganizationId, createOrganizationId } from '../../../domain/model/valueobjects/organization-id.value-object';
import { SpaceId, createSpaceId } from '../../../domain/model/valueobjects/space-id.value-object';
import { createGetOrganizationsByOwnerQuery } from '../../../domain/model/queries/get-organizations-by-owner.query';
import { createGetSpacesByOrganizationQuery } from '../../../domain/model/queries/get-spaces-by-organization.query';
import { createGetDevicesBySpaceQuery } from '../../../domain/model/queries/get-devices-by-space.query';
import { createCreateOrganizationCommand } from '../../../domain/model/commands/create-organization.command';
import { createUpdateOrganizationNameCommand } from '../../../domain/model/commands/update-organization-name.command';
import { createDeleteOrganizationCommand } from '../../../domain/model/commands/delete-organization.command';
import { createCreateSpaceCommand } from '../../../domain/model/commands/create-space.command';
import { createUpdateSpaceNameCommand } from '../../../domain/model/commands/update-space-name.command';
import { createRegisterDeviceCommand } from '../../../domain/model/commands/register-device.command';
import { createUpdateDeviceNameCommand } from '../../../domain/model/commands/update-device-name.command';
import { createUpdateDeviceSerialNumberCommand } from '../../../domain/model/commands/update-device-serial-number.command';
import { createSerialNumber } from '../../../domain/model/valueobjects/serial-number.value-object';
import { createUserId } from '../../../domain/model/valueobjects/user-id.value-object';
import { jwtDecode } from 'jwt-decode';
import { TOKEN_STORAGE_GATEWAY, TokenStorageGateway } from '../../../../iam/infrastructure/storage/token-storage.gateway';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

type ViewMode = 'grid' | 'list';

@Component({
  selector: 'app-space-devices-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    SidebarComponent,
    HeaderComponent,
    DeviceCardComponent,
    OrganizationsBarComponent,
  ],
  templateUrl: './space-devices-page.component.html',
  styleUrl: './space-devices-page.component.css',
})
export class SpaceDevicesPageComponent implements OnInit {
  private readonly deviceCommandService = inject(DeviceCommandServiceImpl);
  private readonly deviceQueryService = inject(DeviceQueryServiceImpl);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly tokenStorage = inject<TokenStorageGateway>(TOKEN_STORAGE_GATEWAY);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder);

  isSidebarOpen = true;

  organizations: Organization[] = [];
  selectedOrganizationId: OrganizationId | null = null;
  selectedOrganization: Organization | null = null;

  spaces: Space[] = [];
  selectedSpaceId: SpaceId | null = null;
  expandedOrganizationIds: Record<string, boolean> = {};
  spacesByOrganizationId: Record<string, Space[]> = {};
  loadingSpacesByOrganizationId: Record<string, boolean> = {};
  errorSpacesByOrganizationId: Record<string, string> = {};

  devicesPage: DevicePage | null = null;
  viewMode: ViewMode = 'grid';

  loadingOrgs = false;
  loadingSpaces = false;
  loadingDevices = false;

  errorOrgs = '';
  errorSpaces = '';
  errorDevices = '';
  deviceCountsBySpaceId: Record<string, number> = {};

  

  get selectedSpace(): Space | null {
    if (!this.selectedSpaceId) return null;
    return this.allSpaces
      .find((s) => s.id.value === this.selectedSpaceId?.value) ?? null;
  }

  get allSpaces(): Space[] {
    return Object.values(this.spacesByOrganizationId).flat();
  }

  ngOnInit(): void {
    this.loadOrganizations();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
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

  loadOrganizations(): void {
    this.loadingOrgs = true;
    this.errorOrgs = '';
    this.cdr.markForCheck();
    const userId = this.getCurrentUserId();
    const query = createGetOrganizationsByOwnerQuery(
      createUserId(userId ?? 'unknown')
    );
    this.deviceQueryService.handleGetOrganizationsByOwner(query).subscribe({
      next: (orgs) => {
        this.organizations = orgs;
        this.loadingOrgs = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorOrgs = 'Failed to load organizations';
        this.loadingOrgs = false;
        this.cdr.markForCheck();
      },
    });
  }

  selectOrganization(orgId: OrganizationId): void {
    this.selectedOrganizationId = orgId;
    this.selectedOrganization = this.organizations.find((org) => org.id.value === orgId.value) ?? null;
    this.loadSpaces(orgId);
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

  loadSpaces(orgId: OrganizationId): void {
    const key = orgId.value;
    this.loadingSpacesByOrganizationId = {
      ...this.loadingSpacesByOrganizationId,
      [key]: true,
    };
    this.errorSpacesByOrganizationId = {
      ...this.errorSpacesByOrganizationId,
      [key]: '',
    };
    this.cdr.markForCheck();
    const query = createGetSpacesByOrganizationQuery(orgId);
    this.deviceQueryService.handleGetSpacesByOrganization(query).subscribe({
      next: (spaces) => {
        this.spacesByOrganizationId = {
          ...this.spacesByOrganizationId,
          [key]: spaces,
        };
        this.loadingSpacesByOrganizationId = {
          ...this.loadingSpacesByOrganizationId,
          [key]: false,
        };
        this.loadDeviceCountsForSpaces(spaces);
        if (orgId.value === this.selectedOrganizationId?.value) {
          this.spaces = spaces;
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorSpacesByOrganizationId = {
          ...this.errorSpacesByOrganizationId,
          [key]: 'Failed to load spaces',
        };
        this.loadingSpacesByOrganizationId = {
          ...this.loadingSpacesByOrganizationId,
          [key]: false,
        };
        this.cdr.markForCheck();
      },
    });
  }

  private loadDeviceCountsForSpaces(spaces: Space[]): void {
    if (spaces.length === 0) {
      this.deviceCountsBySpaceId = {};
      return;
    }

    const requests = spaces.map((space) =>
      this.deviceQueryService.handleGetDevicesBySpace(createGetDevicesBySpaceQuery(space.id, 0, 1)).pipe(
        map((page) => ({ spaceId: space.id.value, totalElements: page.totalElements })),
        catchError(() => of({ spaceId: space.id.value, totalElements: 0 }))
      )
    );

    forkJoin(requests).subscribe((results) => {
      this.deviceCountsBySpaceId = results.reduce<Record<string, number>>((acc, item) => {
        acc[item.spaceId] = item.totalElements;
        return acc;
      }, {});
      this.cdr.markForCheck();
    });
  }

  selectSpace(spaceId: SpaceId): void {
    this.selectedSpaceId = spaceId;
    this.loadDevices(spaceId);
  }

  loadDevices(spaceId: SpaceId): void {
    this.loadingDevices = true;
    this.errorDevices = '';
    this.devicesPage = null;
    this.cdr.markForCheck();
    const query = createGetDevicesBySpaceQuery(spaceId, 0, 50);
    this.deviceQueryService.handleGetDevicesBySpace(query).subscribe({
      next: (page) => {
        this.devicesPage = page;
        this.loadingDevices = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorDevices = 'Failed to load devices';
        this.loadingDevices = false;
        this.cdr.markForCheck();
      },
    });
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
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
        error: () => {
          this.snackBar.open('Failed to create organization', 'Close', { duration: 3000 });
        },
      });
    });
  }

  openEditOrganizationDialog(orgId: OrganizationId): void {
    const organization = this.organizations.find((org) => org.id.value === orgId.value);
    if (!organization) return;
    const dialogRef = this.dialog.open(EditOrganizationDialogComponent, {
      width: '400px',
      data: {
        currentName: organization.name,
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
        error: (error) => {
          this.snackBar.open(this.getErrorMessage(error, 'Failed to update organization'), 'Close', { duration: 3000 });
        },
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
          if (this.selectedOrganizationId?.value === orgId.value) {
            this.selectedOrganizationId = null;
            this.selectedOrganization = null;
            this.selectedSpaceId = null;
            this.devicesPage = null;
          }
          this.loadOrganizations();
        },
        error: () => {
          this.snackBar.open('Failed to delete organization', 'Close', { duration: 3000 });
        },
      });
    });
  }

  openAddSpaceDialog(orgId?: OrganizationId): void {
    const organizationId = orgId ?? this.selectedOrganizationId;
    if (!organizationId) return;
    const dialogRef = this.dialog.open(AddSpaceDialogComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((name: string | undefined) => {
      if (!name) return;
      const userId = this.getCurrentUserId();
      if (!userId) return;
      const command = createCreateSpaceCommand(name, organizationId, createUserId(userId));
      this.deviceCommandService.handleCreateSpace(command).subscribe({
        next: () => {
          this.snackBar.open('Space created', 'Close', { duration: 3000 });
          this.loadSpaces(organizationId);
        },
        error: () => {
          this.snackBar.open('Failed to create space', 'Close', { duration: 3000 });
        },
      });
    });
  }

  openEditSpaceDialog(spaceId: SpaceId): void {
    const space = this.allSpaces.find((currentSpace) => currentSpace.id.value === spaceId.value);
    if (!space) return;
    const dialogRef = this.dialog.open(EditOrganizationDialogComponent, {
      width: '400px',
      data: {
        currentName: space.name,
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
        error: (error) => {
          this.snackBar.open(this.getErrorMessage(error, 'Failed to update space'), 'Close', { duration: 3000 });
        },
      });
    });
  }

  openRegisterDeviceDialog(): void {
    if (!this.selectedSpaceId) return;
    const dialogRef = this.dialog.open(RegisterDeviceDialogComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((result: { serialNumber: string; name: string } | undefined) => {
      if (!result) return;
      const command = createRegisterDeviceCommand(
        createSerialNumber(result.serialNumber),
        result.name,
        this.selectedSpaceId!
      );
      this.deviceCommandService.handleRegisterDevice(command).subscribe({
        next: () => {
          this.snackBar.open('Device registered', 'Close', { duration: 3000 });
          this.loadDevices(this.selectedSpaceId!);
        },
        error: () => {
          this.snackBar.open('Failed to register device', 'Close', { duration: 3000 });
        },
      });
    });
  }

  openEditDeviceNameDialog(device: Device): void {
    const dialogRef = this.dialog.open(EditOrganizationDialogComponent, {
      width: '400px',
      data: {
        currentName: device.name,
        title: 'Edit Device Name',
        fieldLabel: 'Device Name',
        placeholder: 'Enter device name',
      },
    });
    dialogRef.afterClosed().subscribe((name: string | undefined) => {
      if (!name) return;
      const command = createUpdateDeviceNameCommand(device.id, name);
      this.deviceCommandService.handleUpdateDeviceName(command).subscribe({
        next: () => {
          this.snackBar.open('Device name updated', 'Close', { duration: 3000 });
          this.loadDevices(device.spaceId);
        },
        error: (error) => {
          this.snackBar.open(this.getErrorMessage(error, 'Failed to update device name'), 'Close', { duration: 3000 });
        },
      });
    });
  }

  openEditDeviceSerialNumberDialog(device: Device): void {
    const dialogRef = this.dialog.open(EditOrganizationDialogComponent, {
      width: '400px',
      data: {
        currentName: device.serialNumber,
        title: 'Edit Device Serial',
        fieldLabel: 'Serial Number',
        placeholder: 'Enter serial number',
      },
    });
    dialogRef.afterClosed().subscribe((serialNumber: string | undefined) => {
      if (!serialNumber) return;
      const command = createUpdateDeviceSerialNumberCommand(device.id, createSerialNumber(serialNumber));
      this.deviceCommandService.handleUpdateDeviceSerialNumber(command).subscribe({
        next: () => {
          this.snackBar.open('Device serial updated', 'Close', { duration: 3000 });
          this.loadDevices(device.spaceId);
        },
        error: (error) => {
          this.snackBar.open(this.getErrorMessage(error, 'Failed to update device serial'), 'Close', { duration: 3000 });
        },
      });
    });
  }
}

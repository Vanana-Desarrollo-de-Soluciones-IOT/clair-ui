import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, of, switchMap, map } from 'rxjs';
import { SidebarComponent } from '../../../../shared/interfaces/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/interfaces/components/header/header.component';
import { OrganizationsPanelComponent } from '../../components/organizations-panel/organizations-panel.component';
import { DeviceDetailPanelComponent } from '../../components/device-detail-panel/device-detail-panel.component';
import { ClaimDeviceDialogComponent, ClaimDeviceDialogResult } from '../../components/claim-device-dialog/claim-device-dialog.component';
import { PairDeviceDialogComponent, PairDeviceDialogResult } from '../../components/pair-device-dialog/pair-device-dialog.component';
import { DeviceListComponent, DeviceViewMode } from '../../components/device-list/device-list.component';
import { SpaceDetailHeaderComponent } from '../../components/space-detail-header/space-detail-header.component';
import { EditNameDialogComponent } from '../../components/edit-name-dialog/edit-name-dialog.component';
import { DeleteSpaceDialogComponent } from '../../components/delete-space-dialog/delete-space-dialog.component';
import { DeleteDeviceDialogComponent, DeleteDeviceDialogData } from '../../components/delete-device-dialog/delete-device-dialog.component';
import { createUpdateDeviceNameCommand } from '../../../domain/model/commands/update-device-name.command';
import { createDeleteDeviceCommand } from '../../../domain/model/commands/delete-device.command';
import { DeviceCommandServiceImpl } from '../../../application/internal/commandservices/device-command-service.impl';
import { DeviceQueryServiceImpl } from '../../../application/internal/queryservices/device-query-service.impl';
import { Device, DevicePage, Space } from '../../../domain/services/device-query-service';
import { SpaceId } from '../../../domain/model/valueobjects/space-id.value-object';
import { createGetDevicesBySpaceQuery } from '../../../domain/model/queries/get-devices-by-space.query';
import { createClaimDeviceCommand } from '../../../domain/model/commands/claim-device.command';
import { createPairDeviceCommand } from '../../../domain/model/commands/pair-device.command';
import { createHardwareId } from '../../../domain/model/valueobjects/hardware-id.value-object';
import { createUpdateSpaceNameCommand } from '../../../domain/model/commands/update-space-name.command';
import { createDeleteSpaceCommand } from '../../../domain/model/commands/delete-space.command';
import { createCreateDeviceCommandCommand } from '../../../domain/model/commands/create-device-command.command';
import { createDeviceCommandType } from '../../../domain/model/valueobjects/device-command-type.value-object';
import { ExternalTelemetryEvaluationService, DeviceTelemetrySnapshot } from '../../../application/internal/outboundservices/acl/external-telemetry-evaluation.service';
import { createGetSpaceByIdQuery } from '../../../domain/model/queries/get-space-by-id.query';
import { createSpaceId } from '../../../domain/model/valueobjects/space-id.value-object';
import { createGetDeviceByIdQuery } from '../../../domain/model/queries/get-device-by-id.query';
import { createDeviceId } from '../../../domain/model/valueobjects/device-id.value-object';

@Component({
  selector: 'app-space-devices-page',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatSnackBarModule,
    SidebarComponent,
    HeaderComponent,
    OrganizationsPanelComponent,
    DeviceDetailPanelComponent,
    SpaceDetailHeaderComponent,
    DeviceListComponent,
  ],
  templateUrl: './space-devices-page.component.html',
  styleUrl: './space-devices-page.component.css',
})
export class SpaceDevicesPageComponent implements OnInit, OnDestroy {
  private readonly deviceCommandService = inject(DeviceCommandServiceImpl);
  private readonly deviceQueryService = inject(DeviceQueryServiceImpl);
  private readonly externalTelemetryService = inject(ExternalTelemetryEvaluationService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  @ViewChild(OrganizationsPanelComponent) orgPanel!: OrganizationsPanelComponent;

  private readonly subscriptions = new Subscription();

  isSidebarOpen = true;
  selectedSpace: Space | null = null;
  selectedDevice: Device | null = null;
  devicesPage: DevicePage | null = null;
  viewMode: DeviceViewMode = 'grid';
  loadingDevices = false;
  errorDevices = '';
  latestTelemetry: DeviceTelemetrySnapshot | null = null;

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.queryParamMap.subscribe((params) => {
        const deviceId = params.get('deviceId');
        const spaceId = params.get('spaceId');

        const currentDeviceId = this.selectedDevice?.id.value ?? null;
        const currentSpaceId = this.selectedSpace?.id.value ?? null;
        if (deviceId === currentDeviceId && spaceId === currentSpaceId) return;

        if (deviceId) {
          this.hydrateFromDeviceId(deviceId);
          return;
        }

        if (spaceId) {
          this.hydrateFromSpaceId(spaceId);
          return;
        }

        this.hydrateFromLastSelection();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  selectSpace(space: Space): void {
    this.selectedSpace = space;
    this.selectedDevice = null;
    this.latestTelemetry = null;
    this.loadDevices(space.id);
    this.syncQueryParams({ spaceId: space.id.value, deviceId: null });
    this.persistLastSelection({ spaceId: space.id.value, deviceId: null });
  }

  clearSelectedSpace(): void {
    this.selectedSpace = null;
    this.selectedDevice = null;
    this.latestTelemetry = null;
    this.devicesPage = null;
    this.errorDevices = '';
    this.syncQueryParams({ spaceId: null, deviceId: null });
    this.clearLastSelection();
  }

  setViewMode(mode: DeviceViewMode): void {
    this.viewMode = mode;
  }

  selectDevice(device: Device): void {
    this.selectedDevice = device;
    this.loadLatestTelemetry(device.id.value);
    this.syncQueryParams({ deviceId: device.id.value });
    this.persistLastSelection({ spaceId: this.selectedSpace?.id.value ?? null, deviceId: device.id.value });
  }

  clearSelectedDevice(): void {
    this.selectedDevice = null;
    this.latestTelemetry = null;
    this.syncQueryParams({ deviceId: null });
    this.persistLastSelection({ spaceId: this.selectedSpace?.id.value ?? null, deviceId: null });
  }

  private hydrateFromDeviceId(deviceId: string): void {
    let parsedDeviceId;
    try {
      parsedDeviceId = createDeviceId(deviceId);
    } catch {
      return;
    }

    this.subscriptions.add(
      this.deviceQueryService
        .handleGetDeviceById(createGetDeviceByIdQuery(parsedDeviceId))
        .pipe(
          switchMap((device) => {
            if (!device) return of(null);

            this.selectedDevice = device;
            this.latestTelemetry = null;

            const spaceId = device.spaceId;
            if (!spaceId) {
              this.selectedSpace = null;
              this.devicesPage = null;
              this.errorDevices = '';
              this.cdr.markForCheck();
              return of({ device, space: null as Space | null });
            }

            return this.deviceQueryService.handleGetSpaceById(createGetSpaceByIdQuery(spaceId)).pipe(
              map((space) => ({ device, space }))
            );
          })
        )
        .subscribe((result) => {
          if (!result) return;
          const { device, space } = result;

          if (space) this.applyHydratedSpace(space);
          if (device.spaceId) this.loadDevices(device.spaceId);
          this.loadLatestTelemetry(device.id.value);

          this.persistLastSelection({
            spaceId: device.spaceId ? device.spaceId.value : null,
            deviceId: device.id.value,
          });
        })
    );
  }

  private hydrateFromSpaceId(spaceId: string): void {
    let parsedSpaceId: SpaceId;
    try {
      parsedSpaceId = createSpaceId(spaceId);
    } catch {
      return;
    }

    this.subscriptions.add(
      this.deviceQueryService.handleGetSpaceById(createGetSpaceByIdQuery(parsedSpaceId)).subscribe((space) => {
        if (!space) return;
        this.selectedDevice = null;
        this.latestTelemetry = null;
        this.applyHydratedSpace(space);
        this.loadDevices(space.id);
        this.persistLastSelection({ spaceId: space.id.value, deviceId: null });
      })
    );
  }

  private applyHydratedSpace(space: Space): void {
    this.selectedSpace = space;
    this.devicesPage = null;
    this.errorDevices = '';
    this.cdr.markForCheck();

    if (this.orgPanel) {
      this.orgPanel.ensureOrganizationExpanded(space.organizationId);
    }
  }

  private hydrateFromLastSelection(): void {
    const raw = localStorage.getItem('clair.spaceDevices.lastSelection');
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as { spaceId?: string | null; deviceId?: string | null };
      if (parsed.deviceId) {
        this.syncQueryParams({ spaceId: parsed.spaceId ?? null, deviceId: parsed.deviceId }, true);
        return;
      }
      if (parsed.spaceId) {
        this.syncQueryParams({ spaceId: parsed.spaceId, deviceId: null }, true);
      }
    } catch {
      // ignore
    }
  }

  private persistLastSelection(selection: { spaceId: string | null; deviceId: string | null }): void {
    localStorage.setItem('clair.spaceDevices.lastSelection', JSON.stringify(selection));
  }

  private clearLastSelection(): void {
    localStorage.removeItem('clair.spaceDevices.lastSelection');
  }

  private syncQueryParams(
    params: { spaceId?: string | null; deviceId?: string | null },
    replaceUrl: boolean = false
  ): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { spaceId: params.spaceId, deviceId: params.deviceId },
      queryParamsHandling: 'merge',
      replaceUrl,
    });
  }

  private loadLatestTelemetry(deviceId: string): void {
    this.latestTelemetry = null;
    this.externalTelemetryService.fetchLatestTelemetryByDevice(deviceId).subscribe({
      next: (snapshot) => {
        this.latestTelemetry = snapshot;
        this.cdr.markForCheck();
      },
      error: () => {
        this.latestTelemetry = null;
        this.cdr.markForCheck();
      },
    });
  }

  openClaimDeviceDialog(): void {
    if (!this.selectedSpace) return;
    const dialogRef = this.dialog.open(ClaimDeviceDialogComponent, { width: '420px' });
    dialogRef.afterClosed().subscribe((result: ClaimDeviceDialogResult | undefined) => {
      if (!result || !this.selectedSpace) return;
      const command = createClaimDeviceCommand(result.claimToken, this.selectedSpace.id);
      this.deviceCommandService.handleClaimDevice(command).subscribe({
        next: () => {
          this.snackBar.open('Sensor claimed', 'Close', { duration: 3000 });
          this.loadDevices(this.selectedSpace!.id);
        },
        error: (error) => this.snackBar.open(this.getErrorMessage(error, 'Failed to claim sensor'), 'Close', { duration: 3000 }),
      });
    });
  }

  openPairDeviceDialog(): void {
    const dialogRef = this.dialog.open(PairDeviceDialogComponent, { width: '420px' });
    dialogRef.afterClosed().subscribe((result: PairDeviceDialogResult | undefined) => {
      if (!result) return;
      const command = createPairDeviceCommand(createHardwareId(result.hardwareId));
      this.deviceCommandService.handlePairDevice(command).subscribe({
        next: (pairing) => {
          const claimTokenText = pairing.claimToken ? ` Claim token: ${pairing.claimToken}` : '';
          this.snackBar.open(`Sensor paired.${claimTokenText}`, 'Close', { duration: 6000 });
          if (this.selectedSpace) this.loadDevices(this.selectedSpace.id);
        },
        error: (error) => this.snackBar.open(this.getErrorMessage(error, 'Failed to pair sensor'), 'Close', { duration: 3000 }),
      });
    });
  }

  openEditSpaceDialog(): void {
    if (!this.selectedSpace) return;
    const dialogRef = this.dialog.open(EditNameDialogComponent, {
      width: '400px',
      data: {
        currentValue: this.selectedSpace.name,
        title: 'Edit Space',
        fieldLabel: 'Space Name',
        placeholder: 'Enter space name',
      },
    });
    dialogRef.afterClosed().subscribe((name: string | undefined) => {
      if (!name) return;
      const command = createUpdateSpaceNameCommand(this.selectedSpace!.id, name);
      this.deviceCommandService.handleUpdateSpaceName(command).subscribe({
        next: () => {
          this.snackBar.open('Space updated', 'Close', { duration: 3000 });
          if (this.selectedSpace) {
            this.selectedSpace = { ...this.selectedSpace, name };
          }
          if (this.orgPanel) {
            this.orgPanel.loadSpaces(this.selectedSpace!.organizationId);
          }
        },
        error: (error) => this.snackBar.open(this.getErrorMessage(error, 'Failed to update space'), 'Close', { duration: 3000 }),
      });
    });
  }

  openDeleteSpaceDialog(): void {
    if (!this.selectedSpace) return;
    const dialogRef = this.dialog.open(DeleteSpaceDialogComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      const command = createDeleteSpaceCommand(this.selectedSpace!.id);
      const orgId = this.selectedSpace!.organizationId;
      this.deviceCommandService.handleDeleteSpace(command).subscribe({
        next: () => {
          this.snackBar.open('Space deleted', 'Close', { duration: 3000 });
          this.selectedSpace = null;
          this.devicesPage = null;
          if (this.orgPanel) {
            this.orgPanel.loadSpaces(orgId);
          }
        },
        error: (error) => this.snackBar.open(this.getErrorMessage(error, 'Failed to delete space'), 'Close', { duration: 3000 }),
      });
    });
  }

  private loadDevices(spaceId: SpaceId): void {
    this.loadingDevices = true;
    this.errorDevices = '';
    this.devicesPage = null;
    this.cdr.markForCheck();

    this.deviceQueryService.handleGetDevicesBySpace(createGetDevicesBySpaceQuery(spaceId, 0, 50)).subscribe({
      next: (page) => {
        this.devicesPage = page;
        this.loadingDevices = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorDevices = 'Failed to load devices';
        this.loadingDevices = false;
        this.cdr.markForCheck();
      },
    });
  }

  openEditDeviceDialog(): void {
    if (!this.selectedDevice) return;
    const dialogRef = this.dialog.open(EditNameDialogComponent, {
      width: '400px',
      data: {
        currentValue: this.selectedDevice.name,
        title: 'Edit Device',
        fieldLabel: 'Device Name',
        placeholder: 'Enter device name',
      },
    });
    dialogRef.afterClosed().subscribe((name: string | undefined) => {
      if (!name || !this.selectedDevice) return;
      const command = createUpdateDeviceNameCommand(this.selectedDevice.id, name);
      this.deviceCommandService.handleUpdateDeviceName(command).subscribe({
        next: () => {
          this.snackBar.open('Device updated', 'Close', { duration: 3000 });
          if (this.selectedDevice) {
            this.selectedDevice = { ...this.selectedDevice, name };
          }
          // Refresh the device list to show the updated name
          if (this.selectedSpace) {
            this.loadDevices(this.selectedSpace.id);
          }
        },
        error: (error) => this.snackBar.open(this.getErrorMessage(error, 'Failed to update device'), 'Close', { duration: 3000 }),
      });
    });
  }

  openDeleteDeviceDialog(): void {
    if (!this.selectedDevice) return;
    const dialogRef = this.dialog.open(DeleteDeviceDialogComponent, {
      width: '400px',
      data: {
        deviceName: this.selectedDevice.name,
      } as DeleteDeviceDialogData,
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed || !this.selectedDevice) return;
      const command = createDeleteDeviceCommand(this.selectedDevice.id);
      this.deviceCommandService.handleDeleteDevice(command).subscribe({
        next: () => {
          this.snackBar.open('Device deleted', 'Close', { duration: 3000 });
          this.selectedDevice = null;
          // Refresh the device list
          if (this.selectedSpace) {
            this.loadDevices(this.selectedSpace.id);
          }
        },
        error: (error) => this.snackBar.open(this.getErrorMessage(error, 'Failed to delete device'), 'Close', { duration: 3000 }),
      });
    });
  }

  toggleDevicePower(): void {
    if (!this.selectedDevice) return;

    if (this.selectedDevice.status === 'DECOMMISSIONED') {
      this.snackBar.open('Device is decommissioned and cannot receive commands', 'Close', { duration: 3000 });
      return;
    }

    const nextType =
      this.selectedDevice.status === 'ONLINE'
        ? createDeviceCommandType('STANDBY')
        : createDeviceCommandType('WAKE');

    const command = createCreateDeviceCommandCommand(this.selectedDevice.id, nextType);
    this.deviceCommandService.handleCreateDeviceCommand(command).subscribe({
      next: (created) => {
        this.snackBar.open(`Command queued: ${created.type}`, 'Close', { duration: 3000 });
      },
      error: (error) =>
        this.snackBar.open(this.getErrorMessage(error, 'Failed to queue command'), 'Close', { duration: 3000 }),
    });
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

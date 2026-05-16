import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SidebarComponent } from '../../../../shared/interfaces/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/interfaces/components/header/header.component';
import { OrganizationsPanelComponent } from '../../components/organizations-panel/organizations-panel.component';
import { RegisterDeviceDialogComponent } from '../../components/register-device-dialog/register-device-dialog.component';
import { DeviceListComponent, DeviceViewMode } from '../../components/device-list/device-list.component';
import { SpaceDetailHeaderComponent } from '../../components/space-detail-header/space-detail-header.component';
import { EditNameDialogComponent } from '../../components/edit-name-dialog/edit-name-dialog.component';
import { DeleteSpaceDialogComponent } from '../../components/delete-space-dialog/delete-space-dialog.component';
import { DeviceCommandServiceImpl } from '../../../application/internal/commandservices/device-command-service.impl';
import { DeviceQueryServiceImpl } from '../../../application/internal/queryservices/device-query-service.impl';
import { Device, DevicePage, Space } from '../../../domain/services/device-query-service';
import { SpaceId } from '../../../domain/model/valueobjects/space-id.value-object';
import { createGetDevicesBySpaceQuery } from '../../../domain/model/queries/get-devices-by-space.query';
import { createRegisterDeviceCommand } from '../../../domain/model/commands/register-device.command';
import { createUpdateDeviceNameCommand } from '../../../domain/model/commands/update-device-name.command';
import { createUpdateDeviceSerialNumberCommand } from '../../../domain/model/commands/update-device-serial-number.command';
import { createUpdateSpaceNameCommand } from '../../../domain/model/commands/update-space-name.command';
import { createDeleteSpaceCommand } from '../../../domain/model/commands/delete-space.command';
import { createSerialNumber } from '../../../domain/model/valueobjects/serial-number.value-object';

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
    SpaceDetailHeaderComponent,
    DeviceListComponent,
  ],
  templateUrl: './space-devices-page.component.html',
  styleUrl: './space-devices-page.component.css',
})
export class SpaceDevicesPageComponent {
  private readonly deviceCommandService = inject(DeviceCommandServiceImpl);
  private readonly deviceQueryService = inject(DeviceQueryServiceImpl);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(OrganizationsPanelComponent) orgPanel!: OrganizationsPanelComponent;

  isSidebarOpen = true;
  selectedSpace: Space | null = null;
  devicesPage: DevicePage | null = null;
  viewMode: DeviceViewMode = 'grid';
  loadingDevices = false;
  errorDevices = '';

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  selectSpace(space: Space): void {
    this.selectedSpace = space;
    this.loadDevices(space.id);
  }

  clearSelectedSpace(): void {
    this.selectedSpace = null;
    this.devicesPage = null;
    this.errorDevices = '';
  }

  setViewMode(mode: DeviceViewMode): void {
    this.viewMode = mode;
  }

  openRegisterDeviceDialog(): void {
    if (!this.selectedSpace) return;
    const dialogRef = this.dialog.open(RegisterDeviceDialogComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((result: { serialNumber: string; name: string } | undefined) => {
      if (!result || !this.selectedSpace) return;
      const command = createRegisterDeviceCommand(
        createSerialNumber(result.serialNumber),
        result.name,
        this.selectedSpace.id
      );
      this.deviceCommandService.handleRegisterDevice(command).subscribe({
        next: () => {
          this.snackBar.open('Device registered', 'Close', { duration: 3000 });
          this.loadDevices(this.selectedSpace!.id);
        },
        error: (error) => this.snackBar.open(this.getErrorMessage(error, 'Failed to register device'), 'Close', { duration: 3000 }),
      });
    });
  }

  openEditDeviceNameDialog(device: Device): void {
    const dialogRef = this.dialog.open(EditNameDialogComponent, {
      width: '400px',
      data: {
        currentValue: device.name,
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
        error: (error) => this.snackBar.open(this.getErrorMessage(error, 'Failed to update device name'), 'Close', { duration: 3000 }),
      });
    });
  }

  openEditDeviceSerialNumberDialog(device: Device): void {
    const dialogRef = this.dialog.open(EditNameDialogComponent, {
      width: '400px',
      data: {
        currentValue: device.serialNumber,
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
        error: (error) => this.snackBar.open(this.getErrorMessage(error, 'Failed to update device serial'), 'Close', { duration: 3000 }),
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

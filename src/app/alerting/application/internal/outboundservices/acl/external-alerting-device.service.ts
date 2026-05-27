import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DEVICE_CONTEXT_FACADE, DeviceContextFacade, FacadeDevice, FacadeOrganization, FacadeSpace } from '../../../../../device/interfaces/acl/device-context-facade';

@Injectable({ providedIn: 'root' })
export class ExternalAlertingDeviceService {
  constructor(
    @Inject(DEVICE_CONTEXT_FACADE)
    private readonly deviceContextFacade: DeviceContextFacade
  ) {}

  fetchOrganizations(): Observable<FacadeOrganization[]> {
    return this.deviceContextFacade.getOrganizations();
  }

  fetchSpacesByOrganization(organizationId: string): Observable<FacadeSpace[]> {
    return this.deviceContextFacade.getSpacesByOrganization(organizationId);
  }

  fetchDevicesBySpace(spaceId: string): Observable<FacadeDevice[]> {
    return this.deviceContextFacade.getDevicesBySpace(spaceId);
  }
}

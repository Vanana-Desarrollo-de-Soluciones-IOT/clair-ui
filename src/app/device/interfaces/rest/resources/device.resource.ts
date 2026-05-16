export interface DeviceResource {
  id: string;
  serialNumber: string;
  name: string;
  status: string;
  spaceId: string;
  configuration: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface DevicePageResource {
  content: DeviceResource[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

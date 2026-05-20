export interface EvaluateTelemetryResource {
  readonly deviceId: string;
  readonly timestamp: string;
  readonly uptime: string;
  readonly airQuality: AirQualityResource;
  readonly particulateMatter: ParticulateMatterResource;
  readonly connectivity: ConnectivityResource;
  readonly location: LocationResource;
  readonly healthStatus: number;
  readonly status: string;
  readonly created_at?: string;
}

export interface AirQualityResource {
  readonly co2: number;
  readonly temperature: number;
  readonly humidity: number;
}

export interface ParticulateMatterResource {
  readonly pm1_0: number;
  readonly pm2_5: number;
  readonly pm10: number;
}

export interface ConnectivityResource {
  readonly status: string;
  readonly network?: string | null;
  readonly signalStrength?: number | null;
}

export interface LocationResource {
  readonly country?: string | null;
}


export type Connectivity = Readonly<{
  status: string;
  network?: string;
  signalStrength?: number;
}>;

export const createConnectivity = (status: string, network?: string, signalStrength?: number): Connectivity => {
  const normalizedStatus = status.trim();
  if (normalizedStatus.length === 0) throw new Error('Connectivity status must not be empty');
  if (network !== undefined && network.trim().length === 0) throw new Error('Network must be non-empty when provided');
  if (signalStrength !== undefined && !Number.isInteger(signalStrength)) {
    throw new Error('Signal strength must be an integer when provided');
  }

  return Object.freeze({
    status: normalizedStatus,
    network: network?.trim(),
    signalStrength,
  });
};


export type TokenRefreshFailedEvent = Readonly<{
  occurredOn: Date;
  reason: string;
}>;

export const createTokenRefreshFailedEvent = (reason: string): TokenRefreshFailedEvent => {
  return Object.freeze({ occurredOn: new Date(), reason });
};

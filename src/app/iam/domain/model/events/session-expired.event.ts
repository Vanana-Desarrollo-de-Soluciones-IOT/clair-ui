export type SessionExpiredEvent = Readonly<{
  occurredOn: Date;
}>;

export const createSessionExpiredEvent = (): SessionExpiredEvent => {
  return Object.freeze({ occurredOn: new Date() });
};

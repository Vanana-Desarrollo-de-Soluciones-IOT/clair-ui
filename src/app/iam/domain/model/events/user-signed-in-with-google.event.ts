export type UserSignedInWithGoogleEvent = Readonly<{
  email: string;
  occurredOn: Date;
}>;

export const createUserSignedInWithGoogleEvent = (email: string): UserSignedInWithGoogleEvent => {
  return Object.freeze({
    email,
    occurredOn: new Date(),
  });
};

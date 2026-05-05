export type SignInResponseResource = Readonly<{
  id: string;
  email: string;
  token: string;
  refreshToken: string;
}>;

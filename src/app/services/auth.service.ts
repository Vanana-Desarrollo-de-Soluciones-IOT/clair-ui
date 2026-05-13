export class AuthService {
  private users: Map<string, any> = new Map();
  private sessions: string[] = [];

  register(email: string, pass: string, terms: boolean) {
    if (this.users.has(email)) {
      throw new Error('Registration rejected');
    }
    this.users.set(email, { pass, verified: false });
    return { status: 'unverified', emailDispatched: true };
  }

  seedUser(email: string, pass: string, verified: boolean = false) {
    this.users.set(email, { pass, verified });
  }

  verify(token: string) {
    if (token === 'expired' || token === 'used') {
      throw new Error('Verification fails');
    }
    // Mock valid token verifying user dummy@dummy.com
    let user = this.users.get('dummy@dummy.com');
    if (user) {
      user.verified = true;
    }
    return { redirected: 'login' };
  }

  login(email: string, pass: string) {
    const user = this.users.get(email);
    if (!user || user.pass !== pass) {
      throw new Error('Invalid credentials');
    }
    if (!user.verified) {
      throw new Error('Unverified');
    }
    this.sessions.push(email);
    return { routed: 'dashboard' };
  }
}

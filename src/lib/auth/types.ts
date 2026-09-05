export interface AdminSession {
  email: string;
  issuedAt: number;
}

export interface AuthAdapter {
  signIn(email: string, password: string): Promise<AdminSession>;
  signOut(): Promise<void>;
  getSession(): Promise<AdminSession | null>;
}

import { sessionStorageAdapter } from "@/lib/storage/sessionStorageAdapter";
import type { AdminSession, AuthAdapter } from "@/lib/auth/types";

const SESSION_KEY = "kulapaws:admin-session";

// Local development demo credentials only. This is not a real secret and
// must never be treated as production authentication — replace this whole
// adapter (same AuthAdapter interface) with a real provider before any
// deployment.
const DEMO_EMAIL = "admin@example.test";
const DEMO_PASSWORD = "admin123";

export const localAuthAdapter: AuthAdapter = {
  async signIn(email, password) {
    if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      throw new Error("Invalid email or password.");
    }
    const session: AdminSession = { email, issuedAt: Date.now() };
    sessionStorageAdapter.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  async signOut() {
    sessionStorageAdapter.removeItem(SESSION_KEY);
  },

  async getSession() {
    const raw = sessionStorageAdapter.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AdminSession;
    } catch {
      return null;
    }
  },
};

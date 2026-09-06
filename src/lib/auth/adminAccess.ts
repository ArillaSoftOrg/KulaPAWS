// The local demo auth adapter (see localAuthAdapter.ts) is a hardcoded
// email/password with no real backend — it exists only so the admin UI can
// be built and demoed locally. It must never be reachable in a production
// deployment before a real authentication provider replaces it, so the
// entire /admin surface is gated on this check rather than relying on
// anyone remembering not to expose the demo login.
export function isAdminEnabled(): boolean {
  return process.env.NODE_ENV !== "production";
}

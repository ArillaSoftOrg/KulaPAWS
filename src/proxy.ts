import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createProxyClient } from "@/lib/supabase/proxyClient";

// Next.js 16 deprecated middleware.ts in favor of proxy.ts (same mechanism,
// renamed — see node_modules/next/dist/docs/01-app/03-api-reference/
// 03-file-conventions/proxy.md). This is a deliberate choice here, not a
// blind copy of the old middleware tutorial pattern:
//
// - Proxy is the one place guaranteed to run on every request under the
//   matcher below, including the background RSC fetches a client-side
//   Link navigation between two admin pages makes. A check placed only in
//   the (protected) layout would NOT get this guarantee: Next.js reuses an
//   already-rendered shared layout across sibling-route navigations rather
//   than re-running its Server Component logic every time, so it alone
//   cannot reliably gate every navigation — only the first entry into the
//   segment. Proxy closes that gap.
// - Since Next.js 16, proxy defaults to the Node.js runtime (not
//   Edge-only), so the two network calls below (JWT verification via
//   getUser(), and the is_admin() lookup) behave exactly as they would in
//   any other server context — no Edge-runtime workarounds needed here.
// - The (protected) layout still repeats this same check itself. Per
//   Next's own proxy docs: "Always verify authentication and authorization
//   inside each Server Function rather than relying on Proxy alone" — this
//   is defense in depth, not redundancy for its own sake.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const { supabase, response } = createProxyClient(request);

  // getUser() (never getSession()) — it revalidates the token against the
  // Supabase Auth server instead of just trusting whatever is in the
  // cookie, which is the difference between an authorization check and a
  // client-supplied claim.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    await supabase.auth.signOut();
    const denied = NextResponse.redirect(new URL("/admin/login?error=not_authorized", request.url));
    // signOut() above wrote its cookie-clearing instructions onto `response`
    // (via createProxyClient's setAll); carry them onto the redirect we're
    // actually returning, or the session cookie would survive the bounce.
    response.cookies.getAll().forEach((cookie) => denied.cookies.set(cookie));
    return denied;
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

import { clearAllDemoState } from "@/lib/demoState";
import { clearCorporateDemoState } from "@/lib/demoCorporate";
import { clearDemoRegisteredUsers } from "@/lib/demoRegistrations";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AUTH_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "authjs.callback-url",
  "__Secure-authjs.callback-url",
  "next-auth.callback-url",
  "__Secure-next-auth.callback-url",
  "authjs.csrf-token",
  "__Host-authjs.csrf-token",
  "next-auth.csrf-token",
  "__Host-next-auth.csrf-token",
];

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

export async function POST() {
  await clearAllDemoState();
  await clearCorporateDemoState();
  await clearDemoRegisteredUsers();

  const cookieStore = await cookies();
  for (const name of AUTH_COOKIE_NAMES) {
    cookieStore.delete(name);
  }

  return jsonResponse({
    ok: true,
    message: "Demo cookies, session cookies, and stored demo state were cleared.",
  });
}

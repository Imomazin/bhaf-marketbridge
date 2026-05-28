// Simple diagnostic endpoint. Returns 200 OK with build metadata so we can
// confirm a deployment is live without any auth or DB.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    service: "bhaf-marketbridge",
    setup_endpoint_present: true,
    timestamp: new Date().toISOString(),
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? "unknown",
    region: process.env.VERCEL_REGION ?? "unknown",
  });
}

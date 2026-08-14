import { auth } from "@/auth";
import { resubmitArtefactForUser } from "@/lib/server/artefactUploads";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ ok: false, message: "You must be signed in to upload." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const formData = await request.formData();
    const result = await resubmitArtefactForUser(
      { id: session.user.id, email: session.user.email ?? null },
      id,
      formData,
    );

    return Response.json(result, { status: result.ok ? 200 : 400 });
  } catch (error) {
    console.error("[artefacts] route resubmit failed", error);
    return Response.json(
      { ok: false, message: "Resubmit failed before processing. Try again shortly." },
      { status: 500 },
    );
  }
}

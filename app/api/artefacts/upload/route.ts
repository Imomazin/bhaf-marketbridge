import { auth } from "@/auth";
import { uploadArtefactForUser } from "@/lib/server/artefactUploads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ ok: false, message: "You must be signed in to upload." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const result = await uploadArtefactForUser(
      { id: session.user.id, email: session.user.email ?? null },
      formData,
    );

    return Response.json(result, { status: result.ok ? 200 : 400 });
  } catch (error) {
    console.error("[artefacts] route upload failed", error);
    return Response.json(
      { ok: false, message: "Upload failed before processing. Try again shortly." },
      { status: 500 },
    );
  }
}

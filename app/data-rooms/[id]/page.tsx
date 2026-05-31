import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { GrantAccessForm } from "@/components/data-rooms/GrantAccessForm";
import { RevokeAccessButton } from "@/components/data-rooms/RevokeAccessButton";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DataRoomDetail({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) redirect(`/auth/sign-in?next=/data-rooms/${params.id}`);
  if (!DB_ENABLED || !prisma) notFound();

  const room = await prisma.dataRoom.findUnique({
    where: { id: params.id },
    include: {
      access: {
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
        orderBy: { grantedAt: "desc" },
      },
      owner: { select: { id: true, name: true, email: true } },
    },
  });
  if (!room) notFound();

  const isOwner = room.ownerId === session.user.id;
  const myAccess = room.access.find((a) => a.userId === session.user!.id);
  const canSee = isOwner || myAccess || session.user.role === "ADMIN";
  if (!canSee) notFound();

  // Pull the owner's validated artefacts as the room contents
  const artefacts = await prisma.artefact.findMany({
    where: { userId: room.ownerId, status: "VALIDATED" },
    select: { id: true, name: true, category: true, fileName: true, sha256: true, validatedAt: true },
    take: 100,
  });

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-4xl">
        <Link href="/data-rooms" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← All data rooms
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Data room</p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">{room.title}</h1>
        <p className="mt-1 text-xs text-charcoal-500">
          Owned by {room.owner.name ?? room.owner.email} · {room.status.toLowerCase()}
        </p>
        {room.description && <p className="mt-4 text-sm text-charcoal-600">{room.description}</p>}

        <h2 className="mt-10 font-serif text-lg text-forest-900">
          Validated artefacts {artefacts.length > 0 && <span className="text-gold-700">({artefacts.length})</span>}
        </h2>
        {artefacts.length === 0 && (
          <p className="mt-3 text-sm text-charcoal-500">The owner hasn't validated any artefacts yet.</p>
        )}
        <ul className="mt-4 space-y-2">
          {artefacts.map((a) => (
            <li key={a.id} className="card flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-forest-900">{a.name}</p>
                <p className="text-xs text-charcoal-500">
                  {a.category} · {a.fileName ?? "—"}
                  {a.validatedAt && <> · validated {a.validatedAt.toISOString().slice(0, 10)}</>}
                </p>
                {a.sha256 && (
                  <p className="mt-1 font-mono text-[10px] text-charcoal-400">
                    sha256 {a.sha256.slice(0, 12)}…{a.sha256.slice(-6)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        {isOwner && (
          <section className="mt-12">
            <h2 className="font-serif text-lg text-forest-900">Access ({room.access.length})</h2>

            <details className="card mt-3 p-4">
              <summary className="cursor-pointer text-sm font-medium text-forest-900">Grant access</summary>
              <div className="mt-4">
                <GrantAccessForm dataRoomId={room.id} />
              </div>
            </details>

            <ul className="mt-4 space-y-2">
              {room.access.map((a) => (
                <li key={a.id} className="card flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-sm font-medium text-forest-900">
                      {a.user.name ?? a.user.email}{" "}
                      <span className="text-[11px] font-normal text-charcoal-500">· {a.user.role.toLowerCase()}</span>
                    </p>
                    <p className="text-[11px] text-charcoal-400">
                      {a.level.toLowerCase()}
                      {a.expiresAt && <> · expires {a.expiresAt.toISOString().slice(0, 10)}</>}
                    </p>
                  </div>
                  <RevokeAccessButton dataRoomId={room.id} userId={a.userId} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-12 text-[11px] text-charcoal-400">
          Every grant, revoke and access event is written to the tamper-evident audit log.
        </p>
      </div>
    </section>
  );
}

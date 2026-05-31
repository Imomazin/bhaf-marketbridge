import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { NewDataRoomForm } from "@/components/data-rooms/NewDataRoomForm";

export const metadata = { title: "Data rooms · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function DataRoomsIndex() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/data-rooms");

  let owned: Array<{ id: string; title: string; status: string; createdAt: Date }> = [];
  let shared: Array<{ id: string; dataRoom: { id: string; title: string; status: string }; level: string; expiresAt: Date | null }> = [];

  if (DB_ENABLED && prisma) {
    [owned, shared] = await Promise.all([
      prisma.dataRoom.findMany({
        where: { ownerId: session.user.id },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, status: true, createdAt: true },
      }),
      prisma.dataRoomAccess.findMany({
        where: { userId: session.user.id },
        include: { dataRoom: { select: { id: true, title: true, status: true } } },
        orderBy: { grantedAt: "desc" },
      }),
    ]);
  }

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-4xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Data rooms</p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Secure deal rooms</h1>
        <p className="mt-2 max-w-2xl text-sm text-charcoal-500">
          Per-deal secure document sharing with explicit access control. Every grant, view and
          download is written to the tamper-evident audit log.
        </p>

        <details className="card mt-8 p-4">
          <summary className="cursor-pointer text-sm font-medium text-forest-900">Create a new data room</summary>
          <div className="mt-4">
            <NewDataRoomForm />
          </div>
        </details>

        <div className="mt-10">
          <h2 className="font-serif text-lg text-forest-900">Owned by you</h2>
          {owned.length === 0 && <p className="mt-3 text-sm text-charcoal-500">No data rooms yet.</p>}
          <ul className="mt-4 space-y-2">
            {owned.map((r) => (
              <li key={r.id}>
                <Link href={`/data-rooms/${r.id}`} className="card block p-4 hover:border-forest-700">
                  <p className="font-serif text-base text-forest-900">{r.title}</p>
                  <p className="text-[11px] text-charcoal-400">
                    {r.status.toLowerCase()} · created {r.createdAt.toISOString().slice(0, 10)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12">
          <h2 className="font-serif text-lg text-forest-900">Shared with you</h2>
          {shared.length === 0 && <p className="mt-3 text-sm text-charcoal-500">No data rooms shared with you yet.</p>}
          <ul className="mt-4 space-y-2">
            {shared.map((s) => (
              <li key={s.id}>
                <Link href={`/data-rooms/${s.dataRoom.id}`} className="card block p-4 hover:border-forest-700">
                  <p className="font-serif text-base text-forest-900">{s.dataRoom.title}</p>
                  <p className="text-[11px] text-charcoal-400">
                    {s.level.toLowerCase()}
                    {s.expiresAt && <> · expires {s.expiresAt.toISOString().slice(0, 10)}</>}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma, DB_ENABLED } from "@/lib/db";
import { UserStatusActions } from "@/components/admin/UserStatusActions";
import { cn } from "@/lib/utils";

export const metadata = { title: "User Details · BHAF Admin" };
export const dynamic = "force-dynamic";

export default async function AdminUserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/admin/users");
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") redirect("/");

  if (!DB_ENABLED || !prisma) {
    return (
      <div className="container-edge py-12 text-center text-charcoal-500">
        Database not configured.
      </div>
    );
  }

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      artefacts: {
        orderBy: { uploadedAt: 'desc' }
      },
      entrepreneurProfile: true,
      funderProfile: true,
      corporateProfile: true,
    }
  });

  if (!user) {
    notFound();
  }

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-4xl">
        <Link href="/admin/users" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Back to Users
        </Link>
        <div className="mt-6 flex flex-wrap items-start justify-between gap-4 border-b border-cream-200 pb-6">
          <div>
            <h1 className="font-serif text-3xl text-forest-900 md:text-4xl">{user.name ?? "Unnamed User"}</h1>
            <p className="mt-2 text-sm text-charcoal-500">
              {user.email} · Role: <span className="font-semibold text-charcoal-700">{user.role}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                user.status === "ACTIVE" && "bg-forest-50 text-forest-800 border-forest-200",
                user.status === "SUSPENDED" && "bg-red-50 text-red-700 border-red-200",
                user.status === "PENDING_VERIFICATION" && "bg-gold-50 text-gold-800 border-gold-200",
                user.status === "DELETED" && "bg-cream-100 text-charcoal-500 border-cream-300"
              )}
            >
              {user.status.replace(/_/g, " ")}
            </span>
            <UserStatusActions userId={user.id} status={user.status} />
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* User Details */}
          <div className="card p-6">
            <h3 className="font-serif text-lg text-forest-900 border-b border-cream-200 pb-2 mb-4">Account Details</h3>
            <dl className="grid gap-4 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">Joined</dt>
                <dd className="mt-1 text-charcoal-700">{user.createdAt.toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">Email Verified</dt>
                <dd className="mt-1 text-charcoal-700">{user.emailVerified ? "Yes" : "No"}</dd>
              </div>
              {user.kycFullName && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">KYC Info</dt>
                  <dd className="mt-1 text-charcoal-700">
                    {user.kycFullName} ({user.kycIdType}: {user.kycIdNumber}) - {user.kycCountry}
                  </dd>
                </div>
              )}
              {user.entrepreneurProfile && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">Entrepreneur Profile</dt>
                  <dd className="mt-1">
                    <Link href={`/admin/profiles/entrepreneur/${user.entrepreneurProfile.id}`} className="text-[11px] font-semibold text-gold-700 hover:text-forest-700">
                      View Profile →
                    </Link>
                  </dd>
                </div>
              )}
              {user.funderProfile && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">Funder Profile</dt>
                  <dd className="mt-1">
                    <Link href={`/admin/profiles/funder/${user.funderProfile.id}`} className="text-[11px] font-semibold text-gold-700 hover:text-forest-700">
                      View Profile →
                    </Link>
                  </dd>
                </div>
              )}
              {user.corporateProfile && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">Corporate Profile</dt>
                  <dd className="mt-1">
                    <Link href={`/admin/profiles/corporate/${user.corporateProfile.id}`} className="text-[11px] font-semibold text-gold-700 hover:text-forest-700">
                      View Profile →
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Artefacts */}
          <div className="card p-6">
            <h3 className="font-serif text-lg text-forest-900 border-b border-cream-200 pb-2 mb-4">Submitted Documents</h3>
            {user.artefacts.length === 0 ? (
              <p className="text-sm text-charcoal-500">No documents uploaded.</p>
            ) : (
              <ul className="grid gap-3">
                {user.artefacts.map((doc) => (
                  <li key={doc.id} className="border border-cream-200 rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-forest-900">{doc.name}</p>
                        <p className="text-xs text-charcoal-500">{doc.category} · {doc.status}</p>
                      </div>
                      <Link
                        href={`/admin/artefacts/${doc.id}`}
                        className="text-[11px] font-semibold text-gold-700 hover:text-forest-700"
                      >
                        View Details
                      </Link>
                    </div>
                    {doc.rejectionReason && (
                      <div className="mt-2 rounded bg-red-50/50 p-2 text-[11px] text-red-700">
                        <span className="font-semibold uppercase tracking-wider text-red-600">Rejection Reason / AI Note:</span> {doc.rejectionReason}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

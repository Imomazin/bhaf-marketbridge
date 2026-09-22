import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DB_ENABLED } from "@/lib/db";
import { listUsers } from "@/lib/queries/users";
import { cn } from "@/lib/utils";
import type { Role, UserStatus } from "@prisma/client";

export const metadata = { title: "Users · BHAF Admin" };
export const dynamic = "force-dynamic";

const ROLES: Role[] = ["ENTREPRENEUR", "FUNDER", "CORPORATE", "ADMIN", "AUDITOR"];
const STATUSES: UserStatus[] = ["ACTIVE", "SUSPENDED", "PENDING_VERIFICATION", "DELETED"];

const statusTone: Record<string, string> = {
  ACTIVE: "bg-forest-50 text-forest-800 border-forest-200",
  SUSPENDED: "bg-red-50 text-red-700 border-red-200",
  PENDING_VERIFICATION: "bg-gold-50 text-gold-800 border-gold-200",
  DELETED: "bg-cream-100 text-charcoal-500 border-cream-300",
};

function buildHref(params: Record<string, string | undefined>) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) usp.set(k, v);
  }
  const qs = usp.toString();
  return qs ? `/admin/users?${qs}` : "/admin/users";
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; status?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/admin/users");
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") redirect("/");

  const query = await searchParams;
  const page = query.page ? Math.max(1, parseInt(query.page, 10) || 1) : 1;
  const role = query.role && ROLES.includes(query.role as Role) ? (query.role as Role) : undefined;
  const status = query.status && STATUSES.includes(query.status as UserStatus) ? (query.status as UserStatus) : undefined;

  const result = DB_ENABLED
    ? await listUsers({ q: query.q, role, status, page })
    : { rows: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-5xl">
        <Link href="/admin" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Admin dashboard
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Admin</p>
            <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Users</h1>
            <p className="mt-2 text-sm text-charcoal-500">
              {result.total} account{result.total === 1 ? "" : "s"}. Deactivating blocks sign-in immediately.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/profiles/new-funder"
              className="rounded-md bg-forest-800 px-3.5 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-700 transition shadow-sm"
            >
              + Onboard Funder
            </Link>
            <Link
              href="/admin/profiles/new-corporate"
              className="rounded-md border border-forest-800 bg-white px-3.5 py-2 text-xs font-semibold text-forest-800 hover:bg-cream-100 transition shadow-sm"
            >
              + Onboard Corporate
            </Link>
          </div>
        </div>

        <form method="get" className="card mt-8 flex flex-wrap items-center gap-2 p-3">
          <input type="hidden" name="role" value={role ?? ""} />
          <input type="hidden" name="status" value={status ?? ""} />
          <input
            type="text"
            name="q"
            defaultValue={query.q ?? ""}
            placeholder="Search name or email…"
            className="min-w-[200px] flex-1 rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-xs focus:border-forest-700 focus:outline-none"
          />
          <button type="submit" className="rounded-md bg-forest-800 px-3 py-2 text-xs font-medium text-cream-50 hover:bg-forest-700">
            Search
          </button>
        </form>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-400">Role:</span>
          <Link
            href={buildHref({ q: query.q, status })}
            className={cn(
              "rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider",
              !role ? "bg-forest-800 text-cream-50" : "border border-cream-300 text-charcoal-600 hover:border-forest-700",
            )}
          >
            All
          </Link>
          {ROLES.map((r) => (
            <Link
              key={r}
              href={buildHref({ q: query.q, role: r, status })}
              className={cn(
                "rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider",
                role === r ? "bg-forest-800 text-cream-50" : "border border-cream-300 text-charcoal-600 hover:border-forest-700",
              )}
            >
              {r.toLowerCase()}
            </Link>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-400">Status:</span>
          <Link
            href={buildHref({ q: query.q, role })}
            className={cn(
              "rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider",
              !status ? "bg-forest-800 text-cream-50" : "border border-cream-300 text-charcoal-600 hover:border-forest-700",
            )}
          >
            All
          </Link>
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={buildHref({ q: query.q, role, status: s })}
              className={cn(
                "rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider",
                status === s ? "bg-forest-800 text-cream-50" : "border border-cream-300 text-charcoal-600 hover:border-forest-700",
              )}
            >
              {s.toLowerCase().replace(/_/g, " ")}
            </Link>
          ))}
        </div>

        {!DB_ENABLED && (
          <div className="card mt-8 p-6 text-sm text-charcoal-500">
            Database not configured — user management runs against live data only.
          </div>
        )}

        {DB_ENABLED && result.rows.length === 0 && (
          <div className="card mt-8 p-10 text-center text-sm text-charcoal-500">No users match this filter.</div>
        )}

        {result.rows.length > 0 && (
          <div className="card mt-6 overflow-x-auto p-0">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-cream-200 text-[11px] uppercase tracking-wide text-charcoal-400">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {result.rows.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-medium text-forest-900">{u.name ?? "—"}</td>
                    <td className="px-4 py-3 text-charcoal-600">{u.email}</td>
                    <td className="px-4 py-3 text-charcoal-600">{u.role.toLowerCase()}</td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider", statusTone[u.status])}>
                        {u.status.toLowerCase().replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-charcoal-400">{u.createdAt.toISOString().slice(0, 10)}</td>
                    <td className="px-4 py-3">
                      <Link 
                        href={`/admin/users/${u.id}`}
                        className="rounded-md border border-cream-300 px-3 py-1.5 text-xs font-medium text-charcoal-600 hover:border-forest-700 hover:text-forest-900 inline-block"
                      >
                        View User
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {result.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between text-xs text-charcoal-500">
            <span>
              Page {result.page} of {result.totalPages}
            </span>
            <div className="flex gap-2">
              {result.page > 1 && (
                <Link
                  href={buildHref({ q: query.q, role, status, page: String(result.page - 1) })}
                  className="rounded-md border border-cream-300 px-3 py-1.5 font-medium text-charcoal-600 hover:border-forest-700 hover:text-forest-900"
                >
                  Previous
                </Link>
              )}
              {result.page < result.totalPages && (
                <Link
                  href={buildHref({ q: query.q, role, status, page: String(result.page + 1) })}
                  className="rounded-md border border-cream-300 px-3 py-1.5 font-medium text-charcoal-600 hover:border-forest-700 hover:text-forest-900"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

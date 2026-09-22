import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listConsultingRequests } from "@/app/actions/consulting";
import { ConsultingAdminTable } from "@/components/admin/ConsultingAdminTable";
import { cn } from "@/lib/utils";

export const metadata = { title: "Consulting Inquiries · BHAF Admin" };
export const dynamic = "force-dynamic";

export default async function AdminConsultingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/admin/consulting");
  if (session.user.role !== "ADMIN" && session.user.role !== "AUDITOR") redirect("/");

  const query = await searchParams;
  const currentFilter = query.status ?? "ALL";

  const requests = await listConsultingRequests(currentFilter);

  const tabs = [
    { label: "All Inquiries", value: "ALL" },
    { label: "Submitted (New)", value: "SUBMITTED" },
    { label: "Under Review", value: "UNDER_REVIEW" },
    { label: "Proposal Sent", value: "PROPOSAL_SENT" },
    { label: "Accepted", value: "ACCEPTED" },
  ];

  // Pipeline metrics
  const totalRequests = requests.length;

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-5xl">
        <Link href="/admin" className="text-xs font-medium text-forest-700 hover:text-gold-700">
          ← Admin dashboard
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
              Admin Advisory Pipeline
            </p>
            <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">
              Bespoke Consulting Inquiries
            </h1>
            <p className="mt-2 text-sm text-charcoal-500">
              Review custom advisory requests, evaluate variable pricing ranges, and issue formal Terms of Reference (ToR) quotes.
            </p>
          </div>

          <Link
            href="/services/consulting"
            target="_blank"
            className="rounded-md border border-forest-800 bg-white px-3.5 py-2 text-xs font-semibold text-forest-800 hover:bg-forest-50 transition shadow-sm"
          >
            View Public Request Form ↗
          </Link>
        </div>

        {/* Pipeline Summary Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="card p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400">
              Total Inquiries
            </span>
            <p className="mt-1 font-serif text-2xl font-bold text-forest-900">
              {totalRequests}
            </p>
          </div>
          <div className="card p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400">
              Response Rate
            </span>
            <p className="mt-1 font-serif text-2xl font-bold text-forest-900">
              {totalRequests > 0 ? Math.round((requests.filter(r => r.status === 'REPLIED').length / totalRequests) * 100) : 0}%
            </p>
          </div>
          <div className="card p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400">
              Pending Action
            </span>
            <p className="mt-1 font-serif text-2xl font-bold text-forest-900">
              {requests.filter(r => r.status === 'SUBMITTED').length}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-cream-200 pb-3">
          {tabs.map((tab) => {
            const isActive = currentFilter === tab.value;
            return (
              <Link
                key={tab.value}
                href={tab.value === "ALL" ? "/admin/consulting" : `/admin/consulting?status=${tab.value}`}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
                  isActive
                    ? "bg-forest-800 text-cream-50 shadow-sm"
                    : "border border-cream-300 text-charcoal-600 hover:border-forest-700 hover:text-forest-900",
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {requests.length === 0 ? (
          <div className="card mt-8 p-12 text-center text-sm text-charcoal-500">
            No consulting inquiries match this filter.
          </div>
        ) : (
          <ConsultingAdminTable requests={requests} />
        )}
      </div>
    </section>
  );
}

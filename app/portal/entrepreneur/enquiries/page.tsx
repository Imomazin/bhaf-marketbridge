import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { entrepreneurs } from "@/data/entrepreneurs";
import { getDemoEnquiries } from "@/lib/demoState";
import { getEntrepreneurNav } from "@/lib/portalNav";
import { formatIsoDate } from "@/lib/demoPresentation";

export const metadata = { title: "Enquiries · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

const sampleEnquiries = [
  { buyer: "Consumer Goods Alliance", listing: "Upcycled Heritage Apparel Collection", date: "2026-06-28" },
  { buyer: "Mosaic Impact Partners", listing: "Funding Readiness shortlist", date: "2026-06-26" },
];

export default async function EntrepreneurEnquiriesPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/portal/entrepreneur/enquiries");

  const sample = session.user.id === "demo-entrepreneur" ? entrepreneurs[0] : null;
  const enquiries = await getDemoEnquiries(session.user.id);
  const rows =
    enquiries.length > 0
      ? enquiries.map((enquiry) => ({
          id: enquiry.id,
          buyer: enquiry.targetBusiness,
          listing: enquiry.listingTitle,
          note: enquiry.note,
          date: formatIsoDate(enquiry.createdAt),
        }))
      : sample
      ? sampleEnquiries.map((enquiry) => ({
          id: `${enquiry.buyer}-${enquiry.listing}`,
          buyer: enquiry.buyer,
          listing: enquiry.listing,
          note: "Showcase enquiry from the seeded demo account.",
          date: enquiry.date,
        }))
      : [];

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PortalSidebar currentRole="entrepreneur" nav={getEntrepreneurNav("/portal/entrepreneur/enquiries")} />

      <section className="flex-1 bg-cream-50 py-12 md:py-16">
        <div className="container-edge max-w-5xl lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Enquiries</p>
              <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">My enquiries</h1>
              <p className="mt-2 max-w-2xl text-sm text-charcoal-500">
                Marketplace enquiry requests you send during the demo appear here.
              </p>
            </div>
            <Link href="/marketplace" className="btn-secondary !px-3 !py-2 text-xs">
              Open marketplace
            </Link>
          </div>

          {rows.length > 0 ? (
            <ul className="mt-8 space-y-3">
              {rows.map((row) => (
                <li key={row.id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-serif text-lg text-forest-900">{row.listing}</p>
                      <p className="text-xs text-charcoal-500">{row.buyer}</p>
                    </div>
                    <span className="rounded-full border border-forest-200 bg-forest-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-forest-800">
                      Sent
                    </span>
                  </div>
                  {row.note && (
                    <p className="mt-3 rounded-md bg-cream-50 px-3 py-2 text-xs text-charcoal-600">{row.note}</p>
                  )}
                  <p className="mt-3 text-[11px] text-charcoal-400">Sent on {row.date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="card mt-8 p-10 text-center">
              <h2 className="font-serif text-2xl text-forest-900">No enquiries yet</h2>
              <p className="mt-2 text-sm text-charcoal-500">
                Use the Request enquiry button in the marketplace and your sent requests will show up here.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

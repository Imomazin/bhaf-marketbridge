import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { getEntrepreneurNav } from "@/lib/portalNav";
import { formatIsoDate } from "@/lib/demoPresentation";
import { getUserReceivedEnquiries, getUserSentEnquiries } from "@/lib/queries/marketplace";
import { ReplyModal } from "./ReplyModal";

export const metadata = { title: "Enquiries · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function EntrepreneurEnquiriesPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/portal/entrepreneur/enquiries");

  const [sentEnquiries, receivedEnquiries] = await Promise.all([
    getUserSentEnquiries(session.user.id),
    getUserReceivedEnquiries(session.user.id),
  ]);

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
                Manage enquiries you've received on your listings and requests you've sent to others.
              </p>
            </div>
            <Link href="/marketplace" className="btn-secondary !px-3 !py-2 text-xs">
              Open marketplace
            </Link>
          </div>

          <div className="mt-10 space-y-12">
            {/* Received Enquiries Section */}
            <div>
              <h2 className="font-serif text-xl text-forest-900">Received Enquiries</h2>
              <p className="mt-1 text-sm text-charcoal-500">
                Enquiries from buyers or investors interested in your listings.
              </p>
              {receivedEnquiries.length > 0 ? (
                <ul className="mt-6 space-y-3">
                  {receivedEnquiries.map((row) => (
                    <li key={row.id} className="card p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-serif text-lg text-forest-900">{row.listingTitle}</p>
                          <p className="text-xs text-charcoal-500">From: {row.senderName ? `${row.senderName} (${row.senderBusiness})` : row.senderBusiness}</p>
                        </div>
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${row.status === "RESPONDED" ? "border-gold-200 bg-gold-50 text-gold-800" : "border-forest-200 bg-forest-50 text-forest-800"}`}>
                          {row.status}
                        </span>
                      </div>
                      {row.note && (
                        <p className="mt-3 rounded-md bg-cream-50 px-3 py-2 text-xs text-charcoal-600">{row.note}</p>
                      )}
                      <p className="mt-3 text-[11px] text-charcoal-400">Received on {formatIsoDate(row.createdAt)}</p>
                      
                      {row.status !== "RESPONDED" && (
                        <ReplyModal 
                          enquiryId={row.id} 
                          senderBusiness={row.senderBusiness} 
                          senderName={row.senderName} 
                        />
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="card mt-6 p-10 text-center">
                  <p className="text-sm text-charcoal-500">You haven't received any enquiries yet.</p>
                </div>
              )}
            </div>

            {/* Sent Enquiries Section */}
            <div>
              <h2 className="font-serif text-xl text-forest-900">Sent Enquiries</h2>
              <p className="mt-1 text-sm text-charcoal-500">
                Requests you have sent to other businesses.
              </p>
              {sentEnquiries.length > 0 ? (
                <ul className="mt-6 space-y-3">
                  {sentEnquiries.map((row) => (
                    <li key={row.id} className="card p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-serif text-lg text-forest-900">{row.listingTitle}</p>
                          <p className="text-xs text-charcoal-500">To: {row.targetBusiness}</p>
                        </div>
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${row.status === "RESPONDED" ? "border-gold-200 bg-gold-50 text-gold-800" : "border-gray-200 bg-gray-50 text-gray-800"}`}>
                          {row.status}
                        </span>
                      </div>
                      {row.note && (
                        <p className="mt-3 rounded-md bg-cream-50 px-3 py-2 text-xs text-charcoal-600">{row.note}</p>
                      )}
                      <p className="mt-3 text-[11px] text-charcoal-400">Sent on {formatIsoDate(row.createdAt)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="card mt-6 p-10 text-center">
                  <p className="text-sm text-charcoal-500">You haven't sent any enquiries yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

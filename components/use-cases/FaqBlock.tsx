/**
 * Six FAQs written to defuse the pitch objections a DFI, foundation,
 * public-sector buyer or corporate procurement lead typically raises
 * when they see MarketBridge for the first time. Uses native <details>
 * elements — no JS, keyboard-accessible, print-friendly.
 */

interface Faq {
  question: string;
  answer: string;
}

const faqs: Faq[] = [
  {
    question:
      "How do we know an entrepreneur profile is real, not just self-declared?",
    answer:
      "Profiles surface only once at least one artefact — typically a business registration — has been uploaded and validated. Validation runs a MIME/magic-byte check, computes a SHA-256 hash, screens against VirusTotal, and requires a BHAF administrator sign-off. Every step is written to a hash-chained audit log so retroactive edits are detectable.",
  },
  {
    question:
      "What stops a supplier or entrepreneur from misrepresenting their impact?",
    answer:
      "Impact narratives are captured as tagged evidence — ESG artefacts, cohort records, cohort-level outcomes — rather than as free-text claims. Each artefact carries a status label (validated / uploaded / pending) and lives inside the same hash-chained ledger as every other action. A funder or auditor can independently verify the chain via verifyAuditChain().",
  },
  {
    question:
      "Can our team run a real RFP or data room on the platform today?",
    answer:
      "Yes. The RFP flow (create → response → shortlist → award) and the Data Room flow (create → grant → revoke → time-bound access) are fully implemented, DB-backed, and audited. Payments for corporate/funder subscriptions run through a real Paystack integration with webhook verification.",
  },
  {
    question:
      "How do you handle deployments across multiple African markets?",
    answer:
      "The platform is country-aware: preferredProviderForCountry() routes billing to the right rail per market, sign-up captures country/sector, and the directory filters by both. Impact aggregations are computed from the DB directly by /impact/report — no manual roll-up.",
  },
  {
    question:
      "What's the model for BHAF and its partners to co-run programmes?",
    answer:
      "Cohorts (Cohort + CohortMembership models) let BHAF operate programmes like FEMEC or the Abuja Accelerator with tracked membership status (INVITED → CONFIRMED → ACTIVE → COMPLETED). Programme managers get admin control; entrepreneurs get onboarded flows and readiness progression from EMERGING to FUNDING_READY.",
  },
  {
    question:
      "How is this different from a directory or a CRM?",
    answer:
      "A directory doesn't verify, a CRM doesn't publish. MarketBridge combines verification (artefact pipeline + audit log), discovery (directory + marketplace + opportunities), transaction structure (RFPs + applications + data rooms), and impact accountability (donor-grade printable report). The use cases above are the same rails, orchestrated for different stakeholders.",
  },
];

export function FaqBlock() {
  return (
    <section
      id="faq"
      className="border-t border-cream-200 bg-cream-50 py-16 md:py-20"
    >
      <div className="container-edge max-w-4xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-700">
          Anticipated questions
        </p>
        <h2 className="mt-2 font-serif text-2xl text-forest-900 md:text-3xl">
          The six questions we&apos;re asked most often
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-charcoal-600">
          Written to address the concerns a DFI, foundation, public-sector buyer or corporate
          procurement lead typically raises the first time they see the platform.
        </p>

        <div className="mt-8 space-y-3">
          {faqs.map((f, i) => (
            <details
              key={f.question}
              className="group rounded-2xl border border-cream-200 bg-white p-5 shadow-soft transition open:shadow-card"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold-50 text-[10px] font-semibold text-gold-800 ring-1 ring-gold-200">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-base leading-snug text-forest-900">
                    {f.question}
                  </span>
                </div>
                <span
                  aria-hidden
                  className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-cream-300 text-charcoal-500 transition group-open:rotate-45 group-open:border-forest-300 group-open:text-forest-800"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 border-t border-cream-100 pt-3 pl-9 text-[13px] leading-relaxed text-charcoal-700">
                {f.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

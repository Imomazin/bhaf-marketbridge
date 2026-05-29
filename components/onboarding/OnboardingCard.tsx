import Link from "next/link";
import type { OnboardingState } from "@/lib/queries/onboarding";
import { cn } from "@/lib/utils";

interface OnboardingCardProps {
  state: OnboardingState;
  role: "entrepreneur" | "funder" | "corporate";
}

export function OnboardingCard({ state, role }: OnboardingCardProps) {
  if (state.percent === 100) return null;

  const tasks = [
    {
      done: state.emailVerified,
      title: "Verify your email",
      detail: "Check your inbox for the verification link. Resend from Settings if needed.",
      href: "/settings",
      label: "Open settings →",
    },
    {
      done: state.hasProfile,
      title: "Complete your profile",
      detail: "Add a longer description and any certifications so funders/buyers can find you.",
      href: "/settings",
      label: "Edit profile →",
    },
    {
      done: state.hasFirstArtefact,
      title: "Upload your first artefact",
      detail: "Business registration, KYC, or ESG evidence — anything you can verify with.",
      href:
        role === "entrepreneur"
          ? "/portal/entrepreneur#vault"
          : role === "funder"
          ? "/portal/funder#vault"
          : "/portal/corporate#vault",
      label: "Open document vault →",
    },
  ];

  if (role === "entrepreneur") {
    tasks.push({
      done: state.hasFirstListing,
      title: "Publish your first listing",
      detail: "Add a product or service so buyers can discover you in the marketplace.",
      href: "/portal/entrepreneur/listings/new",
      label: "Create listing →",
    });
  }

  return (
    <section className="rounded-2xl border border-gold-200 bg-gold-50 p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
            Get started
          </p>
          <h2 className="mt-1 font-serif text-xl text-forest-900">
            Welcome — let's finish setting up your account
          </h2>
        </div>
        <span className="text-xs font-semibold text-gold-800">{state.percent}% complete</span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-cream-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-forest-700 to-gold-400 transition-all duration-700"
          style={{ width: `${state.percent}%` }}
        />
      </div>

      <ul className="mt-5 space-y-3">
        {tasks.map((t, i) => (
          <li
            key={i}
            className={cn(
              "flex items-start justify-between gap-3 rounded-xl border bg-white p-3",
              t.done ? "border-forest-200" : "border-cream-200",
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                  t.done ? "bg-forest-700 text-cream-50" : "border border-cream-300 bg-white text-charcoal-400",
                )}
              >
                {t.done ? "✓" : i + 1}
              </span>
              <div>
                <p className={cn("text-sm font-medium", t.done ? "text-forest-700" : "text-forest-900")}>
                  {t.title}
                </p>
                <p className="text-xs text-charcoal-500">{t.detail}</p>
              </div>
            </div>
            {!t.done && (
              <Link href={t.href} className="text-xs font-medium text-forest-700 hover:text-gold-700">
                {t.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

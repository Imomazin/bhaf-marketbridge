/**
 * Technical credibility strip. Institutional funders (DFIs, foundations,
 * public-sector buyers) trust platforms with visible security and
 * verification infrastructure. Each marker corresponds to a real
 * capability in the codebase.
 */

interface Marker {
  label: string;
  detail: string;
  icon: React.ReactNode;
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

const markers: Marker[] = [
  {
    label: "Hash-chained audit log",
    detail: "SHA-256 selfHash + prevHash",
    icon: (
      <Icon>
        <path d="M10 13a5 5 0 007 7l3-3a5 5 0 00-7-7" />
        <path d="M14 11a5 5 0 00-7-7l-3 3a5 5 0 007 7" />
      </Icon>
    ),
  },
  {
    label: "Artefact validation",
    detail: "Magic-byte · SHA-256 · AV scan · sign-off",
    icon: (
      <Icon>
        <path d="M9 12l2 2 4-4" />
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </Icon>
    ),
  },
  {
    label: "VirusTotal AV",
    detail: "Hash-lookup, graceful fallback",
    icon: (
      <Icon>
        <path d="M12 2L3 7v6c0 4.4 3.6 8.4 9 9 5.4-.6 9-4.6 9-9V7l-9-5z" />
      </Icon>
    ),
  },
  {
    label: "Timing-safe cron",
    detail: "crypto.timingSafeEqual on secrets",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </Icon>
    ),
  },
  {
    label: "Auth.js v5 + bcrypt",
    detail: "Credentials + optional OAuth · JWT",
    icon: (
      <Icon>
        <path d="M12 15v2m6-11a6 6 0 10-12 0m2 0v3a4 4 0 108 0V6" />
        <rect x="4" y="10" width="16" height="12" rx="2" />
      </Icon>
    ),
  },
  {
    label: "Time-bound data rooms",
    detail: "VIEW / DOWNLOAD / EDIT · revocable",
    icon: (
      <Icon>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 4v6" />
      </Icon>
    ),
  },
];

export function TrustMarkers() {
  return (
    <section
      aria-labelledby="trust-markers-title"
      className="border-y border-cream-200 bg-forest-900 py-10 text-cream-50"
    >
      <div className="container-edge max-w-6xl">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p
              id="trust-markers-title"
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-300"
            >
              Trust infrastructure — real, in the codebase today
            </p>
            <h2 className="mt-1 font-serif text-lg text-cream-50 md:text-xl">
              Institutional-grade rails under every use case
            </h2>
          </div>
          <p className="text-[11px] text-cream-200/80 md:max-w-xs md:text-right">
            Each capability corresponds to a live module in the platform, not a marketing claim.
          </p>
        </div>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {markers.map((m) => (
            <li
              key={m.label}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gold-400/15 text-gold-300">
                {m.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-cream-50">{m.label}</p>
                <p className="mt-0.5 text-[11px] text-cream-200/80">{m.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

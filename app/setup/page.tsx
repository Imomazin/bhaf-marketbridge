export const metadata = {
  title: "Production setup · BHAF MarketBridge",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function SetupHelpPage() {
  return (
    <section className="bg-cream-50 py-16">
      <div className="container-edge max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
          One-shot setup
        </p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">
          Push the schema and seed demo accounts.
        </h1>
        <p className="mt-4 text-sm text-charcoal-600">
          This page documents the temporary <code>/api/setup</code> endpoint.
          Use it once from your browser, then remove the <code>SETUP_TOKEN</code> on Vercel
          and redeploy to permanently disarm it.
        </p>

        <ol className="mt-8 space-y-6 text-sm text-charcoal-700">
          <Step n="1" title="Add SETUP_TOKEN on Vercel">
            <p>Project Settings → Environment Variables → Add new:</p>
            <p className="mt-2">
              <code className="rounded bg-cream-200 px-2 py-1">SETUP_TOKEN</code>
              {" = "}
              <code className="rounded bg-cream-200 px-2 py-1">{"<a long random string>"}</code>
            </p>
            <p className="mt-2 text-xs text-charcoal-500">
              Tip: paste anything 32+ characters long that only you have. Save and redeploy.
            </p>
          </Step>

          <Step n="2" title="Confirm the endpoint is armed">
            <p>Open this URL — should report both flags as true:</p>
            <Url path="/api/setup?action=status" />
          </Step>

          <Step n="3" title="Push the schema">
            <p>Replace <code>YOUR_TOKEN</code> with your SETUP_TOKEN value:</p>
            <Url path="/api/setup?action=push&token=YOUR_TOKEN" />
            <p className="mt-2 text-xs text-charcoal-500">
              Creates all tables. Safe to re-run — already-existing tables are skipped.
            </p>
          </Step>

          <Step n="4" title="Seed the demo accounts">
            <Url path="/api/setup?action=seed&token=YOUR_TOKEN" />
          </Step>

          <Step n="5" title="Verify the demo accounts exist">
            <Url path="/api/setup?action=verify&token=YOUR_TOKEN" />
          </Step>

          <Step n="6" title="Sign in to confirm">
            <p>
              Visit <a className="font-medium text-forest-800 underline" href="/auth/sign-in">/auth/sign-in</a> and
              sign in with one of the seeded accounts. Rotate every password immediately.
            </p>
          </Step>

          <Step n="7" title="Disarm the endpoint">
            <p>
              On Vercel: <strong>delete</strong> the <code>SETUP_TOKEN</code> env var and redeploy.
              The endpoint refuses every request once the token is unset.
            </p>
          </Step>
        </ol>

        <div className="mt-12 rounded-2xl border border-gold-300 bg-gold-50 p-5 text-xs text-gold-900">
          <p className="font-semibold uppercase tracking-wide">Why this is safe</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Endpoint refuses every request unless <code>SETUP_TOKEN</code> is set on Vercel.</li>
            <li>Token comparison is timing-safe (no character-by-character leak).</li>
            <li>Seed is idempotent — re-running cannot create duplicates.</li>
            <li>Schema push tolerates &quot;already exists&quot; errors so partial runs are recoverable.</li>
            <li>No console, no laptop, no Vercel CLI required. Disarm by deleting one env var.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <li className="rounded-2xl border border-cream-200 bg-white p-5">
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-2xl text-gold-500">{n}</span>
        <h3 className="font-serif text-lg text-forest-900">{title}</h3>
      </div>
      <div className="mt-2 text-sm">{children}</div>
    </li>
  );
}

function Url({ path }: { path: string }) {
  return (
    <pre className="mt-2 overflow-x-auto rounded-lg bg-forest-950 p-3 text-[11px] text-cream-100">
      {path}
    </pre>
  );
}

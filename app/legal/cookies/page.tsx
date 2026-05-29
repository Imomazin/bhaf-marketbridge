export const metadata = { title: "Cookie Policy · BHAF MarketBridge" };

export default function CookiesPage() {
  return (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Legal</p>
      <h1 className="font-serif text-3xl text-forest-900 md:text-4xl">Cookie Policy</h1>

      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device by your browser. We use them to keep you signed in, to
        remember preferences, and to understand how MarketBridge is used.
      </p>

      <h2>The cookies we use</h2>
      <ul>
        <li>
          <strong>Strictly necessary</strong>: session cookies issued by Auth.js (NextAuth) so you stay signed in.
          Set when you sign in; cleared when you sign out.
        </li>
        <li>
          <strong>Functional</strong>: a tiny cookie remembering your cookie consent choice (so we don't ask again).
        </li>
        <li>
          <strong>Analytics</strong>: only set if and when you accept analytics. We use a privacy-respecting analytics
          provider with IP anonymisation.
        </li>
      </ul>
      <p>We do not set advertising or third-party tracking cookies.</p>

      <h2>Changing your choice</h2>
      <p>You can change your consent at any time by clearing your browser cookies for this site, or by deleting your account.</p>
    </>
  );
}

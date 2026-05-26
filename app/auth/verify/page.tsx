export const metadata = { title: "Check your email · BHAF MarketBridge" };

export default function VerifyPage() {
  return (
    <div className="card p-8">
      <h1 className="font-serif text-2xl text-forest-900">Check your email</h1>
      <p className="mt-2 text-sm text-charcoal-500">
        We sent you a sign-in link. Open it in this browser to continue.
      </p>
      <p className="mt-6 text-xs text-charcoal-400">
        Didn't get it? Check spam, or wait a minute and try again. Magic links expire after 24 hours.
      </p>
    </div>
  );
}

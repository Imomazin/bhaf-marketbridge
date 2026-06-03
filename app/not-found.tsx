import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="bg-cream-50 py-20 md:py-28">
      <div className="container-edge max-w-2xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
          404 · Page not found
        </p>
        <h1 className="mt-3 font-serif text-4xl text-forest-900 md:text-5xl">
          We couldn&apos;t find that page.
        </h1>
        <p className="mt-4 text-sm text-charcoal-600">
          The link may be out of date, or you may need to sign in to view the
          resource. Try one of the routes below or head back to the home page.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary !px-4 !py-2 text-xs">
            Back home
          </Link>
          <Link href="/directory" className="btn-secondary !px-4 !py-2 text-xs">
            Browse entrepreneurs
          </Link>
          <Link href="/opportunities" className="btn-secondary !px-4 !py-2 text-xs">
            Open opportunities
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-3xl">
        <div className="prose prose-charcoal max-w-none">
          <article>{children}</article>
        </div>
      </div>
    </section>
  );
}

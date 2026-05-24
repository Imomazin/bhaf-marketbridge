interface MarqueePartnersProps {
  partners: string[];
}

export function MarqueePartners({ partners }: MarqueePartnersProps) {
  // Duplicate the list so the CSS marquee loops seamlessly.
  const loop = [...partners, ...partners];
  return (
    <div className="group relative overflow-hidden">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

      <div
        className="flex w-max items-center gap-12 whitespace-nowrap py-4"
        style={{ animation: "marquee 38s linear infinite" }}
      >
        {loop.map((name, idx) => (
          <span key={`${name}-${idx}`} className="flex items-center gap-3 font-serif text-sm text-forest-900">
            <span className="h-1 w-1 rounded-full bg-gold-500" aria-hidden />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

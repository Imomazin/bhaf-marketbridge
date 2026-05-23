import Image from "next/image";
import type { BhafPhoto } from "@/data/photos";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  photo: BhafPhoto;
  caption?: string;
}

export function PageHero({ eyebrow, title, description, photo, caption }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-forest-900 text-cream-50">
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="100vw"
        priority
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-900 via-forest-900/85 to-forest-800/40" />

      <div className="container-edge relative grid gap-10 py-20 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300">{eyebrow}</p>
          <h1 className="mt-3 max-w-2xl font-serif text-3xl leading-tight text-cream-50 md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-xl text-base text-cream-100/80 md:text-lg">{description}</p>
        </div>
        {caption && (
          <p className="hidden max-w-xs border-l border-cream-50/20 pl-5 text-xs text-cream-100/70 md:block">
            <span className="block font-semibold uppercase tracking-[0.16em] text-gold-300">
              {photo.event}
            </span>
            <span className="mt-1 block">{caption}</span>
          </p>
        )}
      </div>
    </section>
  );
}

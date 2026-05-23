import Image from "next/image";
import type { BhafPhoto } from "@/data/photos";
import { cn } from "@/lib/utils";

interface AnnotatedPhotoProps {
  photo: BhafPhoto;
  className?: string;
  aspect?: "square" | "video" | "portrait" | "wide" | "auto";
  priority?: boolean;
  caption?: string | null;
  tag?: string;
  rounded?: "lg" | "xl" | "2xl" | "3xl";
}

const aspectClass: Record<NonNullable<AnnotatedPhotoProps["aspect"]>, string> = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[16/7]",
  auto: "",
};

const roundedClass: Record<NonNullable<AnnotatedPhotoProps["rounded"]>, string> = {
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
};

export function AnnotatedPhoto({
  photo,
  className,
  aspect = "video",
  priority = false,
  caption,
  tag,
  rounded = "2xl",
}: AnnotatedPhotoProps) {
  const shownCaption = caption === null ? null : caption ?? photo.caption;

  return (
    <figure className={cn("group relative overflow-hidden", roundedClass[rounded], className)}>
      <div className={cn("relative", aspectClass[aspect])}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 800px"
          priority={priority}
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
        />
        {(shownCaption || tag) && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-900/15 to-transparent" />
        )}
        {tag && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-cream-50/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-forest-900 shadow-soft backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            {tag}
          </span>
        )}
        {shownCaption && (
          <figcaption className="absolute inset-x-0 bottom-0 px-5 pb-5 text-cream-50">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300">
              {photo.event}
            </p>
            <p className="mt-1 text-sm leading-snug text-cream-100/95">{shownCaption}</p>
          </figcaption>
        )}
      </div>
    </figure>
  );
}

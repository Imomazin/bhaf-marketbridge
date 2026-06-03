import { SkeletonCard } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge max-w-6xl">
        <div className="h-3 w-24 animate-pulse rounded bg-cream-200/80" />
        <div className="mt-3 h-9 w-1/2 animate-pulse rounded bg-cream-200/80" />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

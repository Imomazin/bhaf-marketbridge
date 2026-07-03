import { SkeletonCard } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <>
      <section className="bg-forest-900 py-16 md:py-24">
        <div className="container-edge">
          <div className="h-3 w-32 animate-pulse rounded bg-forest-700" />
          <div className="mt-4 h-10 w-2/3 animate-pulse rounded bg-forest-700" />
          <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-forest-700" />
        </div>
      </section>
      <section className="bg-white py-12">
        <div className="container-edge max-w-6xl">
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

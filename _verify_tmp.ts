import { prisma } from "@/lib/db";

(async () => {
  if (!prisma) throw new Error("no prisma");
  const listings = await prisma.listing.findMany({
    where: { ownerId: "cmsdaq9is000caf0v5b09ozn4" },
    orderBy: { createdAt: "desc" },
  });
  console.log(listings.map((l) => ({ title: l.title, status: l.status })));
})();

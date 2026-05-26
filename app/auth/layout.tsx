import Image from "next/image";
import Link from "next/link";
import { bhafLogo } from "@/data/photos";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream-50">
      <div className="container-edge flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-6 flex items-center justify-center gap-2.5">
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-cream-200">
              <Image src={bhafLogo.src} alt={bhafLogo.alt} fill sizes="40px" className="object-contain p-0.5" />
            </span>
            <span className="font-serif text-lg text-forest-900">BHAF MarketBridge</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}

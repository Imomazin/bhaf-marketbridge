"use client";

import { signOut } from "next-auth/react";

interface SignOutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function SignOutButton({ className, children }: SignOutButtonProps) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className={className ?? "text-sm font-medium text-charcoal-600 hover:text-forest-800"}
    >
      {children ?? "Sign out"}
    </button>
  );
}

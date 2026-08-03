import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { canAccessRouteForRole, getRoleHome } from "@/lib/routeAccess";
import { resolveUserAccess } from "@/lib/userAccess";

export default async function EntrepreneurPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in?next=/portal/entrepreneur");
  }

  const access = await resolveUserAccess(session.user);

  if (access.needsVerification) {
    redirect("/auth/verify-email?next=/portal/entrepreneur");
  }

  if (!canAccessRouteForRole("/portal/entrepreneur", access.role)) {
    redirect(getRoleHome(access.role));
  }

  return children;
}

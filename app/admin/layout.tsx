import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { canAccessRouteForRole, getRoleHome } from "@/lib/routeAccess";
import { resolveUserAccess } from "@/lib/userAccess";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in?next=/admin");
  }

  const access = await resolveUserAccess(session.user);

  if (access.needsVerification) {
    redirect("/auth/verify-email?next=/admin");
  }

  if (!canAccessRouteForRole("/admin", access.role)) {
    redirect(getRoleHome(access.role));
  }

  return children;
}

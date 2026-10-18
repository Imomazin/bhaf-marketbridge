export type AppRole =
  | "ENTREPRENEUR"
  | "FUNDER"
  | "CORPORATE"
  | "ADMIN"
  | "AUDITOR";

export function getRoleHome(role?: AppRole | null): string {
  switch (role) {
    case "ENTREPRENEUR":
      return "/portal/entrepreneur";
    case "FUNDER":
      return "/portal/funder";
    case "CORPORATE":
      return "/portal/corporate";
    case "ADMIN":
    case "AUDITOR":
      return "/admin";
    default:
      return "/auth/sign-in";
  }
}

export function isRoleScopedRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/portal/entrepreneur") ||
    pathname.startsWith("/portal/funder") ||
    pathname.startsWith("/portal/corporate") ||
    pathname.startsWith("/admin")
  );
}

export function canAccessRouteForRole(pathname: string, role?: AppRole | null): boolean {
  if (!role) return false;

  if (role === "ADMIN") {
    return isRoleScopedRoute(pathname);
  }

  if (role === "AUDITOR") {
    return pathname.startsWith("/admin");
  }

  if (role === "ENTREPRENEUR") {
    return pathname.startsWith("/portal/entrepreneur");
  }

  if (role === "FUNDER") {
    return pathname.startsWith("/portal/funder");
  }

  if (role === "CORPORATE") {
    return pathname.startsWith("/portal/corporate");
  }

  return false;
}

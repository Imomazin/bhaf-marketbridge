export function getEntrepreneurNav(currentHref: string) {
  const items = [
    { label: "Dashboard", href: "/portal/entrepreneur" },
    { label: "My profile", href: "/settings" },
    { label: "ESG documentation", href: "/portal/entrepreneur/esg" },
    { label: "My listings", href: "/portal/entrepreneur/listings" },
    { label: "Opportunities", href: "/portal/entrepreneur/opportunities" },
    { label: "Enquiries", href: "/portal/entrepreneur/enquiries" },
  ];

  return items.map((item) => ({ ...item, active: item.href === currentHref }));
}

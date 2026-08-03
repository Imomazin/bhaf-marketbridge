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

export function getFunderNav(currentHref: string) {
  const items = [
    { label: "Dashboard", href: "/portal/funder" },
    { label: "My mandate", href: "/settings" },
    { label: "Pipeline", href: "/portal/funder/pipeline" },
    { label: "Shortlists", href: "/portal/funder/shortlists" },
    { label: "Impact reports", href: "/portal/funder/impact" },
    { label: "Compliance vault", href: "/portal/funder/vault" },
    { label: "Directory", href: "/directory" },
  ];

  return items.map((item) => ({ ...item, active: item.href === currentHref }));
}

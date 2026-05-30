/**
 * Lightweight i18n.
 *
 * Full next-intl per-locale routing is overkill right now. Instead we
 * keep a single dictionary of strings used in user-facing copy, read
 * the preferred locale from cookie or ?lang=fr query, and expose
 * t('key') / serverT('key', locale).
 *
 * Supported: en (default), fr. Other locales fall back to en.
 *
 * Add new strings to the dictionary below; missing keys return the key
 * itself in dev so untranslated copy is obvious.
 */

export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const messages = {
  en: {
    "hero.eyebrow": "BHAF Circular Academy · MarketBridge",
    "hero.headline": "Made by African women. Verified by BHAF. Ready for the world.",
    "hero.subtitle":
      "MarketBridge is the verified marketplace connecting Africa's women-led businesses with the funders, corporate buyers and global market access they belong in.",
    "hero.cta.primary": "Register your business",
    "hero.cta.secondary": "Sign in",
    "hero.cta.tertiary": "See how it works",
    "nav.directory": "Directory",
    "nav.marketplace": "Marketplace",
    "nav.opportunities": "Opportunities",
    "nav.impact": "Impact & ESG",
    "nav.portals": "Portals",
    "nav.signin": "Sign in",
    "nav.register": "Register",
    "nav.workspace": "My workspace",
    "nav.messages": "Messages",
    "nav.inbox": "Inbox",
    "nav.billing": "Billing",
    "nav.settings": "Settings",
    "nav.signout": "Sign out",
    "footer.partnerships": "Sign in",
    "footer.about": "About",
    "footer.terms": "Terms of Service",
    "footer.privacy": "Privacy Policy",
    "footer.cookies": "Cookie Policy",
    "cta.register.entrepreneur": "Register as entrepreneur",
    "cta.register.funder": "Sign in as funder",
    "cta.register.corporate": "Sign in as corporate",
    "cta.register.admin": "BHAF admin",
    "cta.pricing": "See pricing",
  },
  fr: {
    "hero.eyebrow": "BHAF Circular Academy · MarketBridge",
    "hero.headline": "Créé par les femmes africaines. Vérifié par BHAF. Prêt pour le monde.",
    "hero.subtitle":
      "MarketBridge est la place de marché vérifiée qui relie les entreprises africaines dirigées par des femmes aux financeurs, acheteurs corporatifs et marchés mondiaux qui leur reviennent.",
    "hero.cta.primary": "Inscrire votre entreprise",
    "hero.cta.secondary": "Se connecter",
    "hero.cta.tertiary": "Voir le fonctionnement",
    "nav.directory": "Annuaire",
    "nav.marketplace": "Marché",
    "nav.opportunities": "Opportunités",
    "nav.impact": "Impact & ESG",
    "nav.portals": "Portails",
    "nav.signin": "Connexion",
    "nav.register": "S'inscrire",
    "nav.workspace": "Mon espace",
    "nav.messages": "Messages",
    "nav.inbox": "Boîte de réception",
    "nav.billing": "Facturation",
    "nav.settings": "Paramètres",
    "nav.signout": "Déconnexion",
    "footer.partnerships": "Connexion",
    "footer.about": "À propos",
    "footer.terms": "Conditions d'utilisation",
    "footer.privacy": "Politique de confidentialité",
    "footer.cookies": "Politique des cookies",
    "cta.register.entrepreneur": "S'inscrire comme entrepreneure",
    "cta.register.funder": "Se connecter comme financeur",
    "cta.register.corporate": "Se connecter comme entreprise",
    "cta.register.admin": "Administrateur BHAF",
    "cta.pricing": "Voir les tarifs",
  },
} as const;

export type MessageKey = keyof (typeof messages)["en"];

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "fr";
}

export function pickLocale(input: string | null | undefined): Locale {
  if (isLocale(input)) return input;
  if (!input) return DEFAULT_LOCALE;
  if (input.toLowerCase().startsWith("fr")) return "fr";
  return DEFAULT_LOCALE;
}

export function tFor(locale: Locale): (key: MessageKey) => string {
  const dict = messages[locale] ?? messages[DEFAULT_LOCALE];
  return (key) => dict[key] ?? messages[DEFAULT_LOCALE][key] ?? key;
}

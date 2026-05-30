"use client";

import { useEffect, useState } from "react";

const LOCALE_COOKIE = "bhaf-locale";

/**
 * Reads/writes the user's preferred locale via cookie and the `lang`
 * URL param. Deliberately doesn't use `useSearchParams` so it doesn't
 * force its parent into client-only rendering (which would break
 * static pre-rendering of the landing page).
 */
export function LanguageToggle() {
  const [current, setCurrent] = useState<"en" | "fr">("en");

  useEffect(() => {
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get("lang");
    if (fromUrl === "fr" || fromUrl === "en") {
      setCurrent(fromUrl);
      document.cookie = `${LOCALE_COOKIE}=${fromUrl};path=/;max-age=31536000;samesite=lax`;
      return;
    }
    const cookieMatch = document.cookie.match(new RegExp(`${LOCALE_COOKIE}=(en|fr)`));
    if (cookieMatch) setCurrent(cookieMatch[1] as "en" | "fr");
  }, []);

  function set(lang: "en" | "fr") {
    setCurrent(lang);
    document.cookie = `${LOCALE_COOKIE}=${lang};path=/;max-age=31536000;samesite=lax`;
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.location.href = url.toString();
  }

  return (
    <div className="hidden items-center gap-1 rounded-full border border-cream-200 bg-white p-0.5 text-[10px] font-semibold uppercase tracking-wider md:flex">
      <button
        onClick={() => set("en")}
        className={
          current === "en"
            ? "rounded-full bg-forest-800 px-2.5 py-1 text-cream-50"
            : "rounded-full px-2.5 py-1 text-charcoal-500 hover:text-forest-900"
        }
        aria-pressed={current === "en"}
      >
        EN
      </button>
      <button
        onClick={() => set("fr")}
        className={
          current === "fr"
            ? "rounded-full bg-forest-800 px-2.5 py-1 text-cream-50"
            : "rounded-full px-2.5 py-1 text-charcoal-500 hover:text-forest-900"
        }
        aria-pressed={current === "fr"}
      >
        FR
      </button>
    </div>
  );
}

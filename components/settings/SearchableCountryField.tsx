"use client";

import { useId } from "react";
import { COUNTRIES } from "@/lib/countries";

interface SearchableCountryFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function SearchableCountryField({
  label,
  value,
  onChange,
  placeholder = "Search or select a country",
  required = false,
}: SearchableCountryFieldProps) {
  const id = useId();
  const listId = `${id}-countries`;

  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">{label}</span>
      <input
        list={listId}
        value={value}
        required={required}
        autoComplete="country-name"
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-300 focus:border-forest-700 focus:outline-none"
      />
      <datalist id={listId}>
        {COUNTRIES.map((country) => (
          <option key={country} value={country} />
        ))}
      </datalist>
    </label>
  );
}

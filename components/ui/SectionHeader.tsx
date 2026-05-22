import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow && (
        <p className={cn("eyebrow", tone === "dark" && "text-gold-300")}>{eyebrow}</p>
      )}
      <h2
        className={cn(
          "mt-3 font-serif text-3xl leading-tight md:text-4xl",
          tone === "dark" ? "text-cream-50" : "text-forest-900",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base",
            tone === "dark" ? "text-cream-100/75" : "text-charcoal-500",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

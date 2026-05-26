"use client";

import { forwardRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

import { registerAction } from "@/app/actions/auth";
import { registerSchema, type RegisterInput } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";

const SECTORS = [
  "Circular Economy",
  "Clean Energy",
  "Agri-Processing",
  "Health & Beauty",
  "Technology",
  "Education",
  "Fashion & Textiles",
  "Other",
];

const COUNTRIES = [
  "Nigeria",
  "South Africa",
  "Kenya",
  "Ghana",
  "Senegal",
  "Zimbabwe",
  "DRC",
  "Other",
];

type Step = 1 | 2 | 3;

export function SignUpWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
    trigger,
    setValue,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "ENTREPRENEUR",
      businessName: "",
      country: "",
      sector: "",
      description: "",
      orgName: "",
      acceptedTerms: undefined as unknown as true,
    },
    mode: "onTouched",
  });

  const role = watch("role");

  async function next() {
    let ok = true;
    if (step === 1) ok = await trigger(["role"]);
    if (step === 2) {
      const fields: (keyof RegisterInput)[] =
        role === "ENTREPRENEUR"
          ? ["name", "businessName", "country", "sector"]
          : ["name", "orgName"];
      ok = await trigger(fields);
    }
    if (ok) setStep((s) => (Math.min(3, (s + 1) as Step)) as Step);
  }

  const submit: SubmitHandler<RegisterInput> = async (values) => {
    setServerError(null);
    const result = await registerAction(values);
    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [key, msg] of Object.entries(result.fieldErrors)) {
          setError(key as keyof RegisterInput, { message: msg });
        }
      }
      setServerError(result.message);
      return;
    }
    // Sign in immediately after successful registration
    const signed = await signIn("credentials", {
      email: values.email.toLowerCase(),
      password: values.password,
      redirect: false,
    });
    if (signed?.error) {
      setServerError("Account created, but sign-in failed. Try signing in manually.");
      router.push("/auth/sign-in");
      return;
    }
    const destination =
      values.role === "ENTREPRENEUR"
        ? "/portal/entrepreneur"
        : values.role === "FUNDER"
        ? "/portal/funder"
        : "/portal/corporate";
    router.push(destination);
    router.refresh();
  };

  return (
    <div>
      {/* Stepper */}
      <ol className="mb-6 flex items-center gap-2">
        {[1, 2, 3].map((n) => (
          <li key={n} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition",
                step === n
                  ? "bg-gold-500 text-forest-900 shadow-soft"
                  : step > n
                  ? "bg-forest-700 text-cream-50"
                  : "border border-cream-300 bg-white text-charcoal-400",
              )}
            >
              {step > n ? "✓" : n}
            </span>
            <span className="hidden text-[10px] uppercase tracking-wide text-charcoal-500 md:inline">
              {n === 1 ? "Role" : n === 2 ? "Details" : "Credentials"}
            </span>
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
        {step === 1 && (
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-forest-900">
              I'm joining MarketBridge as a…
            </legend>
            {[
              { value: "ENTREPRENEUR", label: "Woman entrepreneur", caption: "Build a verified profile and reach funders & buyers." },
              { value: "FUNDER", label: "Funder or donor", caption: "Discover and back women-led ventures across Africa." },
              { value: "CORPORATE", label: "Corporate partner", caption: "Source verified women-led suppliers and run RFPs." },
            ].map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                  role === opt.value
                    ? "border-gold-300 bg-gold-50 shadow-soft"
                    : "border-cream-200 hover:border-forest-600",
                )}
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...register("role")}
                  className="mt-1 accent-forest-700"
                />
                <span>
                  <span className="block text-sm font-semibold text-forest-900">{opt.label}</span>
                  <span className="block text-xs text-charcoal-500">{opt.caption}</span>
                </span>
              </label>
            ))}
            {errors.role && <FieldError message={errors.role.message} />}
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="space-y-4">
            <legend className="text-sm font-medium text-forest-900">Tell us about you</legend>
            <Input label="Your full name" {...register("name")} error={errors.name?.message} autoComplete="name" />

            {role === "ENTREPRENEUR" && (
              <>
                <Input
                  label="Business name"
                  {...register("businessName")}
                  error={errors.businessName?.message}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select
                    label="Country"
                    options={COUNTRIES}
                    {...register("country")}
                    error={errors.country?.message}
                  />
                  <Select
                    label="Sector"
                    options={SECTORS}
                    {...register("sector")}
                    error={errors.sector?.message}
                  />
                </div>
                <Textarea
                  label="Short business description"
                  {...register("description")}
                  error={errors.description?.message}
                  placeholder="What does your business do? Who does it serve?"
                />
              </>
            )}

            {(role === "FUNDER" || role === "CORPORATE") && (
              <Input
                label={role === "FUNDER" ? "Fund / organisation name" : "Company name"}
                {...register("orgName")}
                error={errors.orgName?.message}
              />
            )}
          </fieldset>
        )}

        {step === 3 && (
          <fieldset className="space-y-4">
            <legend className="text-sm font-medium text-forest-900">Set up sign-in</legend>
            <Input label="Email" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
              error={errors.password?.message}
              hint="At least 10 characters with a capital letter and a number."
            />
            <label className="flex items-start gap-3 rounded-md border border-cream-200 bg-cream-50 p-3 text-xs text-charcoal-600">
              <input
                type="checkbox"
                onChange={(e) => setValue("acceptedTerms", e.target.checked as true, { shouldValidate: true })}
                className="mt-0.5 accent-forest-700"
              />
              <span>
                I accept the{" "}
                <a href="/legal/terms" className="font-medium text-forest-800 underline">
                  Terms of Service
                </a>{" "}
                and the{" "}
                <a href="/legal/privacy" className="font-medium text-forest-800 underline">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
            {errors.acceptedTerms && <FieldError message={errors.acceptedTerms.message as string} />}
          </fieldset>
        )}

        {serverError && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{serverError}</p>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, (s - 1) as Step) as Step)}
              className="btn-secondary !py-2 !px-4 text-xs"
            >
              Back
            </button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <button type="button" onClick={next} className="btn-primary !py-2 !px-4 text-xs">
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary !py-2 !px-4 text-xs disabled:opacity-60"
            >
              {isSubmitting ? "Creating account…" : "Create account"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// ─── Field primitives ───────────────────────────────────────

const inputClass =
  "mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-300 focus:border-forest-700 focus:outline-none";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, ...rest },
  ref,
) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">{label}</span>
      <input ref={ref} {...rest} className={inputClass} />
      {hint && !error && <span className="mt-1 block text-[10px] text-charcoal-400">{hint}</span>}
      {error && <FieldError message={error} />}
    </label>
  );
});

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, ...rest },
  ref,
) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">{label}</span>
      <textarea ref={ref} {...rest} rows={3} className={inputClass} />
      {error && <FieldError message={error} />}
    </label>
  );
});

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  error?: string;
}
const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, error, ...rest },
  ref,
) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">{label}</span>
      <select ref={ref} {...rest} className={inputClass}>
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <FieldError message={error} />}
    </label>
  );
});

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="mt-1 block text-[10px] text-red-700">{message}</span>;
}

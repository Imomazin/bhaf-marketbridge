"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.error("[global-error]", error.message, error.digest);
    }
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: 0 }}>
        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f7f3eb",
            padding: "2rem",
          }}
        >
          <div style={{ maxWidth: 540, textAlign: "center" }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#a07a23",
              }}
            >
              500 · Something went wrong
            </p>
            <h1
              style={{
                marginTop: 12,
                fontSize: 32,
                color: "#1f3b2d",
                fontFamily: "Georgia, serif",
              }}
            >
              We hit an unexpected error.
            </h1>
            <p style={{ marginTop: 16, fontSize: 14, color: "#574c3f" }}>
              The team has been notified. You can retry, or head back home.
            </p>
            {error.digest && (
              <p style={{ marginTop: 8, fontSize: 11, color: "#8a7e6f" }}>
                Reference: <code>{error.digest}</code>
              </p>
            )}
            <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => reset()}
                style={{
                  background: "#1f3b2d",
                  color: "#fff8ea",
                  border: 0,
                  borderRadius: 6,
                  padding: "8px 16px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
              <Link
                href="/"
                style={{
                  border: "1px solid #d9cdb7",
                  borderRadius: 6,
                  padding: "8px 16px",
                  fontSize: 12,
                  color: "#574c3f",
                  textDecoration: "none",
                }}
              >
                Back home
              </Link>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}

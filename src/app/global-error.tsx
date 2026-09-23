"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        className="min-h-full bg-bg-primary font-sans text-text-primary"
        style={{ fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif" }}
      >
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="font-data text-xs font-bold uppercase tracking-widest text-risk-high">
            Critical error
          </div>
          <p className="max-w-lg text-sm text-text-secondary">
            {error.message || "A critical error occurred. Please reload the page."}
            {error.digest ? ` (${error.digest})` : ""}
          </p>
          <button
            onClick={reset}
            className="btn-primary rounded-xl px-6 py-2.5 text-sm font-semibold"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
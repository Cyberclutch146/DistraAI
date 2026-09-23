"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg-primary text-text-primary px-6 text-center">
      <div className="font-data text-xs font-bold uppercase tracking-widest text-risk-high">
        Something went wrong
      </div>
      <p className="max-w-lg text-sm text-text-secondary">
        {error.message || "An unexpected error occurred while rendering this page."}
      </p>
      <button
        onClick={reset}
        className="btn-primary rounded-xl px-6 py-2.5 text-sm font-semibold"
      >
        Try again
      </button>
    </div>
  );
}
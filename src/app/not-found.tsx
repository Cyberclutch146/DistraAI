import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg-primary text-text-primary px-6 text-center">
      <p className="eyebrow">Page not found</p>
      <div className="serif-display text-7xl font-semibold text-accent tracking-tight">404</div>
      <h1 className="serif-display text-2xl font-semibold tracking-tight">Lost in the field</h1>
      <p className="max-w-md text-sm text-text-secondary">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="btn-primary mt-3">
        Back to home
      </Link>
    </div>
  );
}
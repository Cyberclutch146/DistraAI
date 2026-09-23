import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg-primary text-text-primary px-6 text-center">
      <div className="font-data text-6xl font-bold text-gradient">404</div>
      <h1 className="text-xl font-bold tracking-tight">Page not found</h1>
      <p className="max-w-md text-sm text-text-secondary">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="btn-primary mt-2 rounded-xl px-6 py-2.5 text-sm font-semibold">
        Back to home
      </Link>
    </div>
  );
}
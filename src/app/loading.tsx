export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-primary text-text-primary">
      <div className="sticky top-0 z-50 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-bg-surface-hover" />
          <div className="hidden gap-5 md:flex">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="h-6 w-20 animate-pulse rounded-lg bg-bg-surface-hover" />
            ))}
          </div>
          <div className="h-8 w-24 animate-pulse rounded-lg bg-bg-surface-hover" />
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-[55vh] w-full animate-pulse rounded-2xl bg-bg-surface border border-border-subtle" />
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
              <div className="md:col-span-2 h-72 animate-pulse rounded-2xl bg-bg-surface border border-border-subtle" />
              <div className="md:col-span-3 grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <div key={index} className="h-24 animate-pulse rounded-2xl bg-bg-surface border border-border-subtle" />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="h-40 animate-pulse rounded-2xl bg-bg-surface border border-border-subtle" />
              ))}
            </div>
          </div>
          <aside className="lg:col-span-5 xl:col-span-4 space-y-5">
            <div className="h-80 animate-pulse rounded-2xl bg-bg-surface border border-border-subtle" />
            <div className="h-64 animate-pulse rounded-2xl bg-bg-surface border border-border-subtle" />
          </aside>
        </div>
      </main>
    </div>
  );
}
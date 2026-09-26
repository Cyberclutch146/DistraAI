"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { groupRegions } from "@/data/regions";
import { useRegion } from "@/state/region-context";
import { cn } from "@/lib/utils";

export default function LocationSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { region: selected, setRegion } = useRegion();
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const groups = groupRegions();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectLocation(id: string) {
    const next = groups.flatMap((g) => g.regions).find((r) => r.id === id);
    if (!next) return;
    setRegion(next);
    setIsOpen(false);
    router.replace(`${pathname}?region=${next.id}`, { scroll: false });
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-surface px-3 py-1.5 text-sm text-text-primary hover:bg-bg-surface-hover transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select location, current: ${selected.name}`}
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4 text-accent shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
        <span className="max-w-[120px] truncate">{selected.name}</span>
        <svg
          aria-hidden="true"
          className={`h-3.5 w-3.5 text-text-tertiary transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-72 max-h-[70vh] overflow-y-auto rounded-xl border border-border-subtle bg-bg-elevated shadow-pop animate-fade-in z-50"
          role="listbox"
          aria-label="Location options"
        >
          <div className="p-2">
            {groups.map((group) => (
              <div key={group.label}>
                <div className="eyebrow px-3 pt-2.5 pb-1.5">{group.label}</div>
                {group.regions.map((loc) => (
                  <button
                    key={loc.id}
                    role="option"
                    aria-selected={selected.id === loc.id}
                    onClick={() => selectLocation(loc.id)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                      selected.id === loc.id
                        ? "bg-accent-subtle text-accent"
                        : "text-text-primary hover:bg-bg-surface-hover"
                    )}
                  >
                    <svg
                      aria-hidden="true"
                      className={cn("h-4 w-4 shrink-0", selected.id === loc.id ? "text-accent" : "text-text-tertiary")}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                    <div>
                      <div className="text-sm font-medium">{loc.name}</div>
                      <div className="text-xs text-text-tertiary">{loc.subLabel}</div>
                    </div>
                    {selected.id === loc.id && (
                      <svg
                        aria-hidden="true"
                        className="ml-auto h-4 w-4 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
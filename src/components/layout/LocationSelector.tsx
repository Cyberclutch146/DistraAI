"use client";

import { useState, useRef, useEffect } from "react";

const locations = [
  { id: "kerala", label: "Kerala", subLabel: "South India" },
  { id: "wayanad", label: "Wayanad District", subLabel: "Kerala" },
  { id: "kochi", label: "Kochi Metro", subLabel: "Kerala" },
  { id: "idukki", label: "Idukki Highlands", subLabel: "Kerala" },
  { id: "mumbai", label: "Mumbai Metro", subLabel: "Maharashtra" },
  { id: "uttarakhand", label: "Uttarakhand", subLabel: "North India" },
  { id: "assam", label: "Assam", subLabel: "Northeast India" },
];

export default function LocationSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(locations[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-surface px-3 py-1.5 text-sm text-text-primary hover:bg-bg-surface-hover transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select location"
      >
        <svg
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
        <span className="max-w-[120px] truncate">{selected.label}</span>
        <svg
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
          className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border-subtle bg-bg-elevated shadow-xl animate-slide-down z-50"
          role="listbox"
          aria-label="Location options"
        >
          <div className="p-1.5">
            {locations.map((loc) => (
              <button
                key={loc.id}
                role="option"
                aria-selected={selected.id === loc.id}
                onClick={() => {
                  setSelected(loc);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  selected.id === loc.id
                    ? "bg-accent/10 text-accent"
                    : "text-text-primary hover:bg-bg-surface-hover"
                }`}
              >
                <svg
                  className={`h-4 w-4 shrink-0 ${selected.id === loc.id ? "text-accent" : "text-text-tertiary"}`}
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
                  <div className="text-sm font-medium">{loc.label}</div>
                  <div className="text-xs text-text-tertiary">{loc.subLabel}</div>
                </div>
                {selected.id === loc.id && (
                  <svg
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
        </div>
      )}
    </div>
  );
}

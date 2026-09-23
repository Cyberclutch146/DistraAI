"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import LocationSelector from "./LocationSelector";

interface TopNavProps {
  variant?: "default" | "transparent";
  activePage?: string;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Map", href: "/map" },
  { label: "Alerts", href: "/alerts" },
  { label: "Community", href: "/community" },
  { label: "Reports", href: "/reports" },
];

export default function TopNav({ variant = "default", activePage = "Dashboard" }: TopNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isTransparent = variant === "transparent";

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        isTransparent
          ? "bg-transparent border-b border-transparent"
          : "border-b border-border-subtle bg-bg-primary/95"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-9 w-9">
              <div className="absolute inset-0 rounded-full bg-accent-subtle group-hover:bg-accent-muted transition-colors" />
              <svg
                viewBox="0 0 32 32"
                className="relative h-9 w-9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 20c4-2.5 6-7 8-11 1.5 3.4 4 5.6 8 7.6"
                  stroke="var(--text-primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M24 24c-3-1.6-5.4-3.6-7-6.4"
                  stroke="var(--text-primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="13" cy="11" r="2.5" fill="var(--accent)" />
              </svg>
            </div>
            <span className="serif-display text-lg font-semibold tracking-tight text-text-primary">
              Distra<span className="text-accent italic">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = item.label === activePage;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "text-accent"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover/60"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-accent" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {!isTransparent && <LocationSelector />}

            <button
              className="relative p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover/60 transition-all duration-200"
              aria-label="Notifications"
            >
              <svg
                className="h-[18px] w-[18px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-risk-high ring-2 ring-bg-primary" />
            </button>

            <button
              className="flex items-center gap-2 rounded-full p-1 hover:bg-bg-surface-hover/60 transition-all duration-200"
              aria-label="User profile"
            >
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-[#f6efe3] ring-1 ring-accent/20">
                U
              </div>
            </button>

            <button
              className="md:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover/60 transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-subtle bg-bg-primary/95 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = item.label === activePage;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent-subtle text-accent"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function getRiskColor(level: string): string {
  switch (level.toLowerCase()) {
    case "low":
      return "var(--risk-low)";
    case "moderate":
      return "var(--risk-moderate)";
    case "high":
      return "var(--risk-high)";
    case "critical":
      return "var(--risk-critical)";
    default:
      return "var(--text-secondary)";
  }
}

export function getRiskColorClass(level: string): string {
  switch (level.toLowerCase()) {
    case "low":
      return "text-risk-low";
    case "moderate":
      return "text-risk-moderate";
    case "high":
      return "text-risk-high";
    case "critical":
      return "text-risk-critical";
    default:
      return "text-text-secondary";
  }
}

export function getRiskBgClass(level: string): string {
  switch (level.toLowerCase()) {
    case "low":
      return "bg-risk-low/15 text-risk-low border-risk-low/30";
    case "moderate":
      return "bg-risk-moderate/15 text-risk-moderate border-risk-moderate/30";
    case "high":
      return "bg-risk-high/15 text-risk-high border-risk-high/30";
    case "critical":
      return "bg-risk-critical/15 text-risk-critical border-risk-critical/30";
    default:
      return "bg-bg-surface text-text-secondary";
  }
}

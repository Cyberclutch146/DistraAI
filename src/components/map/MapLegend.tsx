export default function MapLegend() {
  const levels = [
    { label: "Low", color: "var(--risk-low)" },
    { label: "Moderate", color: "var(--risk-moderate)" },
    { label: "High", color: "var(--risk-high)" },
    { label: "Critical", color: "var(--risk-critical)" },
  ];

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-elevated/95 backdrop-blur-sm px-3.5 py-3 shadow-card">
      <div className="eyebrow eyebrow-xs mb-2.5">Risk level</div>
      <div className="space-y-1.5">
        {levels.map((level) => (
          <div key={level.label} className="flex items-center gap-2.5">
            <div
              className="h-2.5 w-2.5 shrink-0"
              style={{ backgroundColor: level.color, opacity: 0.75, borderRadius: 2 }}
              aria-hidden="true"
            />
            <span className="text-xs text-text-secondary">{level.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
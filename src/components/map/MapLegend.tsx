export default function MapLegend() {
  const levels = [
    { label: "Low", color: "var(--risk-low)", icon: "○" },
    { label: "Moderate", color: "var(--risk-moderate)", icon: "◐" },
    { label: "High", color: "var(--risk-high)", icon: "●" },
    { label: "Critical", color: "var(--risk-critical)", icon: "◉" },
  ];

  return (
    <div
      className="rounded-xl border border-border-subtle bg-bg-primary/90 backdrop-blur-md p-3 shadow-lg"
      aria-label="Risk level legend"
    >
      <div className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary mb-2">
        Risk Level
      </div>
      <div className="space-y-1.5">
        {levels.map((level) => (
          <div key={level.label} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-sm shrink-0"
              style={{ backgroundColor: level.color, opacity: 0.7 }}
              aria-hidden="true"
            />
            <span className="text-xs text-text-secondary">{level.label}</span>
            <span className="text-[10px] text-text-tertiary ml-auto" aria-hidden="true">
              {level.icon}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

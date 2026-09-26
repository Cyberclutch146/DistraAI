"use client";

import { cn } from "@/lib/utils";

export type RiskLayer = "flood" | "landslide" | "combined";

interface LayerToggleProps {
  activeLayer: RiskLayer;
  onLayerChange: (layer: RiskLayer) => void;
}

const layers: { id: RiskLayer; label: string }[] = [
  { id: "flood", label: "Flood" },
  { id: "landslide", label: "Landslide" },
  { id: "combined", label: "Combined" },
];

export default function LayerToggle({ activeLayer, onLayerChange }: LayerToggleProps) {
  return (
    <div
      className="flex rounded-xl border border-border-subtle bg-bg-elevated/95 backdrop-blur-sm p-1 shadow-card"
      role="tablist"
      aria-label="Risk layer selection"
    >
      {layers.map((layer) => (
        <button
          key={layer.id}
          role="tab"
          aria-selected={activeLayer === layer.id}
          onClick={() => onLayerChange(layer.id)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
            activeLayer === layer.id
              ? "bg-accent-subtle text-accent"
              : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover"
          )}
        >
          <span>{layer.label}</span>
        </button>
      ))}
    </div>
  );
}
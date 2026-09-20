"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import LayerToggle, { type RiskLayer } from "./LayerToggle";
import MapLegend from "./MapLegend";
import { mockRiskZones, type RiskZoneFeature } from "@/data/mockRiskZones";

const RISK_COLORS: Record<string, string> = {
  low: "#3dba6c",       // --risk-low
  moderate: "#e8b930",  // --risk-moderate
  high: "#d94444",      // --risk-high
  critical: "#a62020",  // --risk-critical
};

function getFeatureStyle(feature: RiskZoneFeature | undefined) {
  const level = feature?.properties.riskLevel || "low";
  return {
    fillColor: RISK_COLORS[level],
    fillOpacity: 0.3,
    color: RISK_COLORS[level],
    weight: 2,
    opacity: 0.8,
  };
}

function onEachFeature(feature: RiskZoneFeature, layer: L.Layer) {
  if (feature.properties) {
    const p = feature.properties;
    const popupContent = `
      <div style="min-width: 200px; padding: 4px 0;">
        <div style="font-weight: 600; font-size: 14px; margin-bottom: 6px;">${p.name}</div>
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 2px; background: ${RISK_COLORS[p.riskLevel]};" aria-hidden="true"></span>
          <span style="font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; color: ${RISK_COLORS[p.riskLevel]};">${p.riskLevel}</span>
          <span style="font-size: 11px; color: hsl(0 0% 50%); margin-left: auto;">Score: ${p.riskScore}</span>
        </div>
        <div style="font-size: 12px; color: hsl(0 0% 70%); line-height: 1.4;">${p.description}</div>
      </div>
    `;
    (layer as L.Path).bindPopup(popupContent, {
      maxWidth: 300,
      className: "risk-popup",
    });
  }
}

// Sub-component to handle layer changes — re-filters GeoJSON
function RiskOverlay({ activeLayer }: { activeLayer: RiskLayer }) {
  const filteredFeatures = useMemo(() => {
    if (activeLayer === "combined") {
      return mockRiskZones.features;
    }
    return mockRiskZones.features.filter(
      (f) => f.properties.riskType === activeLayer || f.properties.riskType === "combined"
    );
  }, [activeLayer]);

  const geojsonData = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: filteredFeatures,
    }),
    [filteredFeatures]
  );

  return (
    <GeoJSON
      key={activeLayer} // Force remount on layer change for clean transition
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data={geojsonData as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={getFeatureStyle as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onEachFeature={onEachFeature as any}
    />
  );
}

export default function RiskMap() {
  const [activeLayer, setActiveLayer] = useState<RiskLayer>("combined");

  return (
    <div className="relative w-full h-[55vh] lg:h-[60vh] rounded-2xl overflow-hidden border border-border-subtle">
      <MapContainer
        center={[10.2, 76.5]}
        zoom={8}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <RiskOverlay activeLayer={activeLayer} />
        {/* Re-add zoom control in a better position */}
        <ZoomControl />
      </MapContainer>

      {/* Map overlays */}
      <div className="absolute top-4 right-4 z-[1000]">
        <LayerToggle activeLayer={activeLayer} onLayerChange={setActiveLayer} />
      </div>

      <div className="absolute bottom-8 left-4 z-[1000]">
        <MapLegend />
      </div>

      {/* Live indicator */}
      <div className="absolute top-4 left-4 z-[1000]">
        <div className="flex items-center gap-2 rounded-lg bg-bg-primary/90 backdrop-blur-md border border-border-subtle px-3 py-1.5 shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low" />
          </span>
          <span className="text-xs font-medium text-text-secondary">LIVE</span>
        </div>
      </div>
    </div>
  );
}

// Leaflet zoom control in custom position
function ZoomControl() {
  const map = useMap();

  useEffect(() => {
    const zoomControl = L.control.zoom({ position: "bottomright" });
    zoomControl.addTo(map);
    return () => {
      zoomControl.remove();
    };
  }, [map]);

  return null;
}

"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import LayerToggle, { type RiskLayer } from "./LayerToggle";
import MapLegend from "./MapLegend";
import { useRegion } from "@/state/region-context";
import { getRiskZones } from "@/lib/data-client";
import { useData } from "@/lib/use-data";
import { RISK_COLORS } from "@/lib/risk-colors";
import type { Region, RiskZoneCollection, RiskZoneFeature } from "@/data/types";

function getFeatureStyle(feature: RiskZoneFeature) {
  const level = feature.properties.riskLevel;
  return {
    fillColor: RISK_COLORS[level],
    fillOpacity: 0.3,
    color: RISK_COLORS[level],
    weight: 2,
    opacity: 0.8,
  };
}

function onEachFeature(feature: RiskZoneFeature, layer: L.Layer) {
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

function RiskOverlay({
  collection,
  activeLayer,
}: {
  collection: RiskZoneCollection;
  activeLayer: RiskLayer;
}) {
  const filteredFeatures = useMemo(() => {
    if (activeLayer === "combined") {
      return collection.features;
    }
    return collection.features.filter(
      (f) => f.properties.riskType === activeLayer || f.properties.riskType === "combined"
    );
  }, [collection, activeLayer]);

  const geojsonData = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: filteredFeatures,
    }),
    [filteredFeatures]
  );

  return (
    <GeoJSON
      key={`${activeLayer}-${collection.features.length}`}
      data={geojsonData as never}
      style={getFeatureStyle as never}
      onEachFeature={onEachFeature as never}
    />
  );
}

function RecenterMap({ region }: { region: Region }) {
  const map = useMap();

  useEffect(() => {
    map.setView([region.center.lat, region.center.lng], region.zoom, { animate: true });
  }, [map, region]);

  return null;
}

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

interface RiskMapProps {
  heightClassName?: string;
}

export default function RiskMap({
  heightClassName = "h-[55vh] lg:h-[60vh]",
}: RiskMapProps) {
  const { region } = useRegion();
  const { data, error } = useData(() => getRiskZones(region.id), [region.id]);
  const [activeLayer, setActiveLayer] = useState<RiskLayer>("combined");

  return (
    <div
      className={`relative w-full ${heightClassName} rounded-2xl overflow-hidden border border-border-subtle`}
    >
      <MapContainer
        center={[region.center.lat, region.center.lng]}
        zoom={region.zoom}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {data && data.features.length > 0 && (
          <RiskOverlay collection={data} activeLayer={activeLayer} />
        )}
        <RecenterMap region={region} />
        <ZoomControl />
      </MapContainer>

      <div className="absolute top-4 right-4 z-[1000]">
        <LayerToggle activeLayer={activeLayer} onLayerChange={setActiveLayer} />
      </div>

      <div className="absolute bottom-8 left-4 z-[1000]">
        <MapLegend />
      </div>

      <div className="absolute top-4 left-4 z-[1000]">
        <div className="flex items-center gap-2 rounded-lg bg-bg-primary/90 backdrop-blur-md border border-border-subtle px-3 py-1.5 shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low" />
          </span>
          <span className="text-xs font-medium text-text-secondary">{region.name}</span>
        </div>
      </div>

      {error && (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-bg-primary/60 backdrop-blur-sm">
          <p className="text-sm text-risk-high px-4 text-center">
            Failed to load risk zones for {region.name}.
          </p>
        </div>
      )}

      {!error && data && data.features.length === 0 && (
        <div className="absolute inset-x-0 bottom-24 z-[1001] flex justify-center px-4">
          <div className="rounded-xl border border-border-subtle bg-bg-primary/90 backdrop-blur-md px-4 py-3 shadow-lg">
            <p className="text-xs text-text-secondary">
              No monitored risk zones in {region.name} yet.
            </p>
          </div>
        </div>
      )}

      {!error && !data && (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-bg-primary/40">
          <svg className="h-8 w-8 animate-spin text-text-secondary" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="30 70" />
          </svg>
        </div>
      )}
    </div>
  );
}
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
    fillOpacity: 0.22,
    color: RISK_COLORS[level],
    weight: 1.5,
    opacity: 0.9,
  };
}

function onEachFeature(feature: RiskZoneFeature, layer: L.Layer) {
  const p = feature.properties;
  const popupContent = `
    <div style="min-width: 220px; padding: 4px 0; color: #26211b;">
      <div style="font-family: Georgia, serif; font-size: 16px; font-weight: 600; margin-bottom: 8px;">${p.name}</div>
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; border-bottom: 1px solid #e2d8c6; padding-bottom: 8px;">
        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 1px; background: ${RISK_COLORS[p.riskLevel]};" aria-hidden="true"></span>
        <span style="font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.06em; color: ${RISK_COLORS[p.riskLevel]};">${p.riskLevel}</span>
        <span style="font-size: 11px; font-family: monospace; color: #8a7d6e; margin-left: auto;">score ${p.riskScore} / 100</span>
      </div>
      <div style="font-size: 13px; color: #6a6054; line-height: 1.45;">${p.description}</div>
    </div>
  `;
  (layer as L.Path).bindPopup(popupContent, {
    maxWidth: 320,
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
      className={`relative w-full ${heightClassName} rounded-2xl overflow-hidden border border-border-subtle shadow-card`}
    >
      <MapContainer
        center={[region.center.lat, region.center.lng]}
        zoom={region.zoom}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
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
        <div className="flex items-center gap-2.5 rounded-lg bg-bg-elevated/90 backdrop-blur-sm border border-border-subtle px-3 py-1.5 shadow-card">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low" />
          </span>
          <span className="font-data text-xs font-medium text-text-primary">{region.name}</span>
        </div>
      </div>

      {error && (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-bg-primary/70 backdrop-blur-sm">
          <p className="text-sm text-risk-high px-4 text-center">
            Failed to load risk zones for {region.name}.
          </p>
        </div>
      )}

      {!error && data && data.features.length === 0 && (
        <div className="absolute inset-x-0 bottom-24 z-[1001] flex justify-center px-4">
          <div className="rounded-xl border border-border-subtle bg-bg-elevated/95 backdrop-blur-sm px-4 py-3 shadow-card">
            <p className="text-sm text-text-secondary">
              No monitored risk zones in {region.name} yet.
            </p>
          </div>
        </div>
      )}

      {!error && !data && (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-bg-primary/40">
          <span className="font-data text-xs uppercase tracking-widest text-text-tertiary">
            Loading zones…
          </span>
        </div>
      )}
    </div>
  );
}
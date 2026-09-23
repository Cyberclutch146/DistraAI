import type { Region } from "./types";

export const REGIONS: Region[] = [
  {
    id: "kerala",
    name: "Kerala",
    subLabel: "State",
    type: "state",
    center: { lat: 10.2, lng: 76.5 },
    zoom: 7,
  },
  {
    id: "wayanad",
    name: "Wayanad",
    subLabel: "District",
    parent: "kerala",
    type: "district",
    center: { lat: 11.72, lng: 76.0 },
    zoom: 9,
  },
  {
    id: "kochi",
    name: "Kochi Metro",
    subLabel: "District",
    parent: "kerala",
    type: "metro",
    center: { lat: 10.02, lng: 76.3 },
    zoom: 10,
  },
  {
    id: "idukki",
    name: "Idukki",
    subLabel: "District",
    parent: "kerala",
    type: "district",
    center: { lat: 9.85, lng: 77.0 },
    zoom: 9,
  },
  {
    id: "alappuzha",
    name: "Alappuzha",
    subLabel: "District",
    parent: "kerala",
    type: "district",
    center: { lat: 9.45, lng: 76.35 },
    zoom: 9,
  },
  {
    id: "thiruvananthapuram",
    name: "Thiruvananthapuram",
    subLabel: "District",
    parent: "kerala",
    type: "district",
    center: { lat: 8.5, lng: 76.95 },
    zoom: 9,
  },
  {
    id: "kozhikode",
    name: "Kozhikode",
    subLabel: "District",
    parent: "kerala",
    type: "district",
    center: { lat: 11.28, lng: 75.8 },
    zoom: 9,
  },
  {
    id: "munnar",
    name: "Munnar",
    subLabel: "District",
    parent: "kerala",
    type: "district",
    center: { lat: 10.08, lng: 77.1 },
    zoom: 10,
  },
  {
    id: "palakkad",
    name: "Palakkad",
    subLabel: "District",
    parent: "kerala",
    type: "district",
    center: { lat: 10.78, lng: 76.7 },
    zoom: 9,
  },
  {
    id: "thrissur",
    name: "Thrissur",
    subLabel: "District",
    parent: "kerala",
    type: "district",
    center: { lat: 10.5, lng: 76.25 },
    zoom: 9,
  },
  {
    id: "mumbai",
    name: "Mumbai Metro",
    subLabel: "Maharashtra",
    type: "metro",
    center: { lat: 19.07, lng: 72.88 },
    zoom: 10,
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand",
    subLabel: "State",
    type: "state",
    center: { lat: 30.4, lng: 79.0 },
    zoom: 8,
  },
  {
    id: "assam",
    name: "Assam",
    subLabel: "State",
    type: "state",
    center: { lat: 26.6, lng: 92.9 },
    zoom: 7,
  },
];

export function getDefaultRegion(): Region {
  return REGIONS[0];
}

export function findRegion(id?: string | null): Region | null {
  if (!id) return null;
  return REGIONS.find((region) => region.id === id) ?? null;
}

export function getRegionOrDefault(id?: string | null): Region {
  return findRegion(id) ?? getDefaultRegion();
}

const ORDER: Record<string, number> = {
  state: 0,
  district: 1,
  metro: 2,
};

export interface RegionGroup {
  label: string;
  regions: Region[];
}

export function groupRegions(): RegionGroup[] {
  const groups = new Map<string, RegionGroup>();
  for (const region of REGIONS) {
    const label = region.type === "state" ? region.name : (region.subLabel ?? "Other");
    let group = groups.get(label);
    if (!group) {
      group = { label, regions: [] };
      groups.set(label, group);
    }
    group.regions.push(region);
  }
  return [...groups.values()].map((group) => ({
    ...group,
    regions: group.regions.sort(
      (a, b) => (ORDER[a.type] ?? 9) - (ORDER[b.type] ?? 9)
    ),
  }));
}
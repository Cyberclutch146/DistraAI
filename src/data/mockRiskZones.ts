import type { RiskZoneCollection, RiskZoneFeature, RiskZoneProperties } from "./types";

function feature(
  properties: RiskZoneProperties,
  coordinates: number[][][]
): RiskZoneFeature {
  return {
    type: "Feature",
    properties,
    geometry: { type: "Polygon", coordinates },
  };
}

export const mockRiskZones: RiskZoneCollection = {
  type: "FeatureCollection",
  features: [
    feature(
      {
        name: "Wayanad District",
        regionId: "wayanad",
        riskLevel: "critical",
        riskType: "landslide",
        riskScore: 92,
        description:
          "Steep terrain with saturated laterite soil. Multiple landslide-prone slopes identified via satellite change detection.",
      },
      [
        [
          [75.8, 11.6],
          [76.2, 11.6],
          [76.2, 11.85],
          [75.8, 11.85],
          [75.8, 11.6],
        ],
      ]
    ),
    feature(
      {
        name: "Kochi Metro",
        regionId: "kochi",
        riskLevel: "high",
        riskType: "flood",
        riskScore: 78,
        description:
          "Low-lying coastal urban area. River Periyar at 95% capacity. Heavy rainfall predicted in next 48h.",
      },
      [
        [
          [76.2, 9.9],
          [76.4, 9.9],
          [76.4, 10.1],
          [76.2, 10.1],
          [76.2, 9.9],
        ],
      ]
    ),
    feature(
      {
        name: "Idukki Highlands",
        regionId: "idukki",
        riskLevel: "high",
        riskType: "combined",
        riskScore: 81,
        description:
          "Elevated reservoir levels combined with steep terrain. Both flood and landslide risk elevated.",
      },
      [
        [
          [76.8, 9.7],
          [77.2, 9.7],
          [77.2, 10.0],
          [76.8, 10.0],
          [76.8, 9.7],
        ],
      ]
    ),
    feature(
      {
        name: "Alappuzha Backwaters",
        regionId: "alappuzha",
        riskLevel: "moderate",
        riskType: "flood",
        riskScore: 58,
        description:
          "Backwater region with rising water tables. Moderate flood risk due to monsoon accumulation.",
      },
      [
        [
          [76.2, 9.3],
          [76.5, 9.3],
          [76.5, 9.6],
          [76.2, 9.6],
          [76.2, 9.3],
        ],
      ]
    ),
    feature(
      {
        name: "Thiruvananthapuram Coast",
        regionId: "thiruvananthapuram",
        riskLevel: "low",
        riskType: "flood",
        riskScore: 24,
        description:
          "Coastal region with adequate drainage infrastructure. Normal monsoon conditions.",
      },
      [
        [
          [76.8, 8.4],
          [77.1, 8.4],
          [77.1, 8.6],
          [76.8, 8.6],
          [76.8, 8.4],
        ],
      ]
    ),
    feature(
      {
        name: "Kozhikode Urban",
        regionId: "kozhikode",
        riskLevel: "moderate",
        riskType: "flood",
        riskScore: 52,
        description:
          "Urban drainage at 70% capacity. Moderate rainfall expected. Historical flood zones showing elevated water levels.",
      },
      [
        [
          [75.7, 11.2],
          [75.9, 11.2],
          [75.9, 11.35],
          [75.7, 11.35],
          [75.7, 11.2],
        ],
      ]
    ),
    feature(
      {
        name: "Munnar Hills",
        regionId: "munnar",
        riskLevel: "high",
        riskType: "landslide",
        riskScore: 74,
        description:
          "Tea plantation regions with deforested slopes. Soil moisture at critical threshold.",
      },
      [
        [
          [77.0, 10.0],
          [77.2, 10.0],
          [77.2, 10.15],
          [77.0, 10.15],
          [77.0, 10.0],
        ],
      ]
    ),
    feature(
      {
        name: "Palakkad Gap",
        regionId: "palakkad",
        riskLevel: "low",
        riskType: "combined",
        riskScore: 31,
        description:
          "Wind corridor with moderate rainfall. Terrain is relatively flat. Low overall risk.",
      },
      [
        [
          [76.5, 10.7],
          [76.9, 10.7],
          [76.9, 10.85],
          [76.5, 10.85],
          [76.5, 10.7],
        ],
      ]
    ),
    feature(
      {
        name: "Thrissur Plains",
        regionId: "thrissur",
        riskLevel: "moderate",
        riskType: "flood",
        riskScore: 47,
        description:
          "Agricultural lowlands with rising river levels. Flood risk increasing with continued rainfall.",
      },
      [
        [
          [76.1, 10.4],
          [76.4, 10.4],
          [76.4, 10.6],
          [76.1, 10.6],
          [76.1, 10.4],
        ],
      ]
    ),
  ],
};
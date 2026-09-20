export interface RiskZoneFeature {
  type: "Feature";
  properties: {
    name: string;
    riskLevel: "low" | "moderate" | "high" | "critical";
    riskType: "flood" | "landslide" | "combined";
    riskScore: number;
    description: string;
  };
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

export interface RiskZoneCollection {
  type: "FeatureCollection";
  features: RiskZoneFeature[];
}

export const mockRiskZones: RiskZoneCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Wayanad District",
        riskLevel: "critical",
        riskType: "landslide",
        riskScore: 92,
        description:
          "Steep terrain with saturated laterite soil. Multiple landslide-prone slopes identified via satellite change detection.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.8, 11.6],
            [76.2, 11.6],
            [76.2, 11.85],
            [75.8, 11.85],
            [75.8, 11.6],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Kochi Metro",
        riskLevel: "high",
        riskType: "flood",
        riskScore: 78,
        description:
          "Low-lying coastal urban area. River Periyar at 95% capacity. Heavy rainfall predicted in next 48h.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.2, 9.9],
            [76.4, 9.9],
            [76.4, 10.1],
            [76.2, 10.1],
            [76.2, 9.9],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Idukki Highlands",
        riskLevel: "high",
        riskType: "combined",
        riskScore: 81,
        description:
          "Elevated reservoir levels combined with steep terrain. Both flood and landslide risk elevated.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.8, 9.7],
            [77.2, 9.7],
            [77.2, 10.0],
            [76.8, 10.0],
            [76.8, 9.7],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Alappuzha Backwaters",
        riskLevel: "moderate",
        riskType: "flood",
        riskScore: 58,
        description:
          "Backwater region with rising water tables. Moderate flood risk due to monsoon accumulation.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.2, 9.3],
            [76.5, 9.3],
            [76.5, 9.6],
            [76.2, 9.6],
            [76.2, 9.3],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Thiruvananthapuram Coast",
        riskLevel: "low",
        riskType: "flood",
        riskScore: 24,
        description:
          "Coastal region with adequate drainage infrastructure. Normal monsoon conditions.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.8, 8.4],
            [77.1, 8.4],
            [77.1, 8.6],
            [76.8, 8.6],
            [76.8, 8.4],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Kozhikode Urban",
        riskLevel: "moderate",
        riskType: "flood",
        riskScore: 52,
        description:
          "Urban drainage at 70% capacity. Moderate rainfall expected. Historical flood zones showing elevated water levels.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.7, 11.2],
            [75.9, 11.2],
            [75.9, 11.35],
            [75.7, 11.35],
            [75.7, 11.2],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Munnar Hills",
        riskLevel: "high",
        riskType: "landslide",
        riskScore: 74,
        description:
          "Tea plantation regions with deforested slopes. Soil moisture at critical threshold.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [77.0, 10.0],
            [77.2, 10.0],
            [77.2, 10.15],
            [77.0, 10.15],
            [77.0, 10.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Palakkad Gap",
        riskLevel: "low",
        riskType: "combined",
        riskScore: 31,
        description:
          "Wind corridor with moderate rainfall. Terrain is relatively flat. Low overall risk.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.5, 10.7],
            [76.9, 10.7],
            [76.9, 10.85],
            [76.5, 10.85],
            [76.5, 10.7],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Thrissur Plains",
        riskLevel: "moderate",
        riskType: "flood",
        riskScore: 47,
        description:
          "Agricultural lowlands with rising river levels. Flood risk increasing with continued rainfall.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.1, 10.4],
            [76.4, 10.4],
            [76.4, 10.6],
            [76.1, 10.6],
            [76.1, 10.4],
          ],
        ],
      },
    },
  ],
};

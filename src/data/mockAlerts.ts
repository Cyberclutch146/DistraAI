export interface Alert {
  id: string;
  severity: "low" | "moderate" | "high" | "critical";
  region: string;
  description: string;
  timestamp: Date;
  type: "flood" | "landslide" | "combined";
}

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000);
const minsAgo = (m: number) => new Date(now.getTime() - m * 60000);

export const mockAlerts: Alert[] = [
  {
    id: "ALT-001",
    severity: "critical",
    region: "Wayanad District",
    description:
      "Imminent landslide risk detected. Soil moisture exceeds 95% threshold on 3 monitored slopes. Satellite imagery shows terrain displacement.",
    timestamp: minsAgo(12),
    type: "landslide",
  },
  {
    id: "ALT-002",
    severity: "high",
    region: "Kochi Metro",
    description:
      "River Periyar water level at 9.2m (danger mark: 9.5m). Flash flood risk elevated for low-lying areas within 6 hours.",
    timestamp: minsAgo(34),
    type: "flood",
  },
  {
    id: "ALT-003",
    severity: "high",
    region: "Idukki Highlands",
    description:
      "Idukki reservoir at 93% capacity. Controlled release may begin within 4 hours. Downstream flood risk increasing.",
    timestamp: hoursAgo(1),
    type: "combined",
  },
  {
    id: "ALT-004",
    severity: "moderate",
    region: "Munnar Hills",
    description:
      "Continuous rainfall (48h accumulation: 186mm) weakening slope stability in deforested tea plantation zones.",
    timestamp: hoursAgo(2),
    type: "landslide",
  },
  {
    id: "ALT-005",
    severity: "moderate",
    region: "Kozhikode Urban",
    description:
      "Urban drainage systems at 72% capacity. Localized waterlogging reported in 4 wards. Monitoring escalated.",
    timestamp: hoursAgo(3),
    type: "flood",
  },
  {
    id: "ALT-006",
    severity: "moderate",
    region: "Alappuzha Backwaters",
    description:
      "Backwater levels rising steadily. Kuttanad region paddy fields at risk of inundation within 24 hours.",
    timestamp: hoursAgo(4),
    type: "flood",
  },
  {
    id: "ALT-007",
    severity: "low",
    region: "Thrissur Plains",
    description:
      "Minor waterlogging in agricultural zones. River levels rising but within safe thresholds. Monitoring continues.",
    timestamp: hoursAgo(6),
    type: "flood",
  },
  {
    id: "ALT-008",
    severity: "low",
    region: "Palakkad Gap",
    description:
      "Seasonal monsoon conditions normal. Wind speeds elevated but no structural risk detected. Routine monitoring.",
    timestamp: hoursAgo(8),
    type: "combined",
  },
  {
    id: "ALT-009",
    severity: "low",
    region: "Thiruvananthapuram Coast",
    description:
      "Coastal conditions stable. Tidal patterns normal. No flood risk indicators above baseline.",
    timestamp: hoursAgo(12),
    type: "flood",
  },
];

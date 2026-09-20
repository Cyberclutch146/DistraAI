export interface InsightData {
  id: string;
  title: string;
  value: string;
  unit: string;
  trend: "up" | "down" | "stable";
  trendValue: string;
  sparklineData: number[];
  threshold?: number;
  status: "normal" | "warning" | "danger";
  icon: string;
}

export const mockInsights: InsightData[] = [
  {
    id: "rainfall",
    title: "Rainfall (24h)",
    value: "127",
    unit: "mm",
    trend: "up",
    trendValue: "+23mm",
    sparklineData: [12, 18, 24, 15, 32, 28, 45, 52, 68, 72, 85, 94, 78, 102, 118, 127],
    status: "warning",
    icon: "🌧",
  },
  {
    id: "soil-saturation",
    title: "Soil Saturation",
    value: "87",
    unit: "%",
    trend: "up",
    trendValue: "+4%",
    sparklineData: [62, 64, 68, 71, 73, 76, 78, 80, 82, 84, 85, 86, 87],
    threshold: 90,
    status: "warning",
    icon: "🏔",
  },
  {
    id: "river-level",
    title: "River Level",
    value: "9.2",
    unit: "m",
    trend: "up",
    trendValue: "+0.3m",
    sparklineData: [7.1, 7.3, 7.6, 7.8, 8.0, 8.2, 8.4, 8.6, 8.7, 8.9, 9.0, 9.1, 9.2],
    threshold: 9.5,
    status: "danger",
    icon: "🌊",
  },
  {
    id: "satellite",
    title: "Change Detection",
    value: "3",
    unit: "zones",
    trend: "up",
    trendValue: "+1 zone",
    sparklineData: [0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3],
    status: "warning",
    icon: "🛰",
  },
];

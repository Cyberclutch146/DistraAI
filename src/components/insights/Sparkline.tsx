"use client";

import { useId } from "react";

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  threshold?: number;
  thresholdColor?: string;
  fillOpacity?: number;
}

export function computeThresholdY(
  threshold: number,
  min: number,
  max: number,
  padding: number,
  height: number
): number {
  const range = max - min || 1;
  const y = padding + (height - padding * 2) - ((threshold - min) / range) * (height - padding * 2);
  return Math.min(Math.max(y, padding), height - padding);
}

export default function Sparkline({
  data,
  color = "var(--accent)",
  width = 120,
  height = 40,
  threshold,
  thresholdColor = "var(--risk-high)",
  fillOpacity = 0.1,
}: SparklineProps) {
  const gradientId = `sparkline-gradient-${useId().replace(/[:]/g, "")}`;

  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padding = 2;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((value - min) / range) * chartHeight;
    return { x, y };
  });

  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
    const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
    linePath += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  const fillPath =
    linePath +
    ` L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  const thresholdY =
    threshold !== undefined
      ? computeThresholdY(threshold, min, max, padding, height)
      : undefined;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={fillOpacity * 2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      <path d={fillPath} fill={`url(#${gradientId})`} />

      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {thresholdY !== undefined && (
        <line
          x1={padding}
          y1={thresholdY}
          x2={width - padding}
          y2={thresholdY}
          stroke={thresholdColor}
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.6}
        />
      )}

      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r={2.5}
        fill={color}
      />
    </svg>
  );
}
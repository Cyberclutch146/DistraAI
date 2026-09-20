"use client";

import { useEffect, useState } from "react";

interface RiskGaugeProps {
  score: number;       // 0–100
  size?: number;       // SVG size
  strokeWidth?: number;
}

export default function RiskGauge({ score, size = 180, strokeWidth = 12 }: RiskGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate from 0 to target score
    const duration = 1200;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [score]);

  const center = size / 2;
  const radius = (size - strokeWidth) / 2 - 4;
  // Semicircular arc (180 degrees)
  const circumference = Math.PI * radius;
  const fillLength = (animatedScore / 100) * circumference;
  const dashOffset = circumference - fillLength;

  // Color based on score
  const getColor = (s: number) => {
    if (s >= 80) return "var(--risk-critical)";
    if (s >= 60) return "var(--risk-high)";
    if (s >= 40) return "var(--risk-moderate)";
    return "var(--risk-low)";
  };

  const color = getColor(animatedScore);

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg
        width={size}
        height={size / 2 + 20}
        viewBox={`0 0 ${size} ${size / 2 + 20}`}
        className="overflow-visible"
      >
        {/* Background arc */}
        <path
          d={`M ${strokeWidth / 2 + 4} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2 - 4} ${center}`}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d={`M ${strokeWidth / 2 + 4} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2 - 4} ${center}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
            transition: "stroke 0.3s ease",
          }}
        />
        {/* Score text */}
        <text
          x={center}
          y={center - 8}
          textAnchor="middle"
          className="font-data"
          style={{
            fontSize: size * 0.28,
            fontWeight: 700,
            fill: color,
          }}
        >
          {animatedScore}
        </text>
        {/* "/ 100" label */}
        <text
          x={center}
          y={center + 14}
          textAnchor="middle"
          style={{
            fontSize: 12,
            fill: "var(--text-tertiary)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
          }}
        >
          / 100
        </text>
      </svg>
    </div>
  );
}

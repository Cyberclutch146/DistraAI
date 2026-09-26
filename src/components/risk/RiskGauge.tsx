"use client";

import { useEffect, useState } from "react";

interface RiskGaugeProps {
  score: number;       // 0–100
  size?: number;       // SVG size
  strokeWidth?: number;
}

export default function RiskGauge({ score, size = 180, strokeWidth = 10 }: RiskGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1100;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
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
  const circumference = Math.PI * radius;

  const getColor = (s: number) => {
    if (s >= 80) return "var(--risk-critical)";
    if (s >= 60) return "var(--risk-high)";
    if (s >= 40) return "var(--risk-moderate)";
    return "var(--risk-low)";
  };

  const color = getColor(animatedScore);
  const fillLength = (animatedScore / 100) * circumference;
  const dashOffset = circumference - fillLength;

  // Hairline tick marks along the arc (0, 25, 50, 75)
  const ticks = [0, 25, 50, 75].map((pct) => {
    const angle = Math.PI * (1 - pct / 100);
    const x = center + Math.cos(angle) * radius;
    const y = center - Math.sin(angle) * radius * 0;
    return { x, y };
  });

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg
        aria-hidden="true"
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
        {/* Index ticks on the arc baseline */}
        {ticks.map((t) => (
          <line
            key={t.x}
            x1={t.x}
            y1={center - strokeWidth / 2 - 2}
            x2={t.x}
            y2={center - strokeWidth / 2 + 6}
            stroke="var(--border-strong)"
            strokeWidth={1}
            aria-hidden="true"
          />
        ))}
        {/* Filled arc — flat, no glow */}
        <path
          d={`M ${strokeWidth / 2 + 4} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2 - 4} ${center}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke 0.3s ease" }}
        />
        {/* Quote marks */}
        <text
          x={strokeWidth / 2 + 4}
          y={center - strokeWidth / 2 - 6}
          fontSize={7}
          fill="var(--text-tertiary)"
          fontFamily="var(--font-karla), sans-serif"
          textAnchor="start"
        >
          0
        </text>
        <text
          x={size - strokeWidth / 2 - 4}
          y={center - strokeWidth / 2 - 6}
          fontSize={7}
          fill="var(--text-tertiary)"
          fontFamily="var(--font-karla), sans-serif"
          textAnchor="end"
        >
          100
        </text>
        {/* Score text */}
        <text
          x={center}
          y={center - 8}
          textAnchor="middle"
          style={{
            fontSize: size * 0.3,
            fontWeight: 600,
            fill: "var(--text-primary)",
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontOpticalSizing: "auto",
          }}
        >
          {animatedScore}
        </text>
        {/* Unit label */}
        <text
          x={center}
          y={center + 14}
          textAnchor="middle"
          style={{
            fontSize: 11,
            fill: "var(--text-tertiary)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            letterSpacing: "0.08em",
          }}
        >
          / 100
        </text>
      </svg>
    </div>
  );
}
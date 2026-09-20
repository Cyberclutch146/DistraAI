interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  threshold?: number;
  thresholdColor?: string;
  fillOpacity?: number;
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
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padding = 2;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Build path points
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((value - min) / range) * chartHeight;
    return { x, y };
  });

  // Build smooth SVG path with cubic bezier
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
    const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
    linePath += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  // Fill path (close to bottom)
  const fillPath =
    linePath +
    ` L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  // Threshold line Y position
  const thresholdY =
    threshold !== undefined
      ? padding + chartHeight - ((threshold - min) / range) * chartHeight
      : undefined;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      aria-hidden="true"
    >
      {/* Gradient fill under the line */}
      <defs>
        <linearGradient id={`sparkline-gradient-${data.length}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={fillOpacity * 2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      <path
        d={fillPath}
        fill={`url(#sparkline-gradient-${data.length})`}
      />

      {/* Main line */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Threshold line */}
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

      {/* End dot */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r={2.5}
        fill={color}
      />
    </svg>
  );
}

import React from "react";

/**
 * PUBLIC_INTERFACE
 * WeeklyTrendGraph: Cyber/dark-themed trend chart showing weekly metrics using mock data.
 * - Uses SVG (no external libraries) for a sleek line graph.
 * - Easily replace mockData & colors for API/real integration.
 */
const mockData = [
  { day: "Mon", value: 18 },
  { day: "Tue", value: 31 },
  { day: "Wed", value: 22 },
  { day: "Thu", value: 49 },
  { day: "Fri", value: 37 },
  { day: "Sat", value: 55 },
  { day: "Sun", value: 44 },
];

const CYBER_COLORS = {
  line: "url(#cyber-gradient)",
  point: "var(--secondary)",
  grid: "#2a2c44",
  fill: "url(#cyber-area-gradient)",
  label: "var(--text-secondary)",
};

function getMax(data) {
  return Math.max(...data.map(d => d.value), 1);
}

function WeeklyTrendGraph() {
  const width = 322;
  const height = 180;
  const padding = 38;
  const pointRadius = 4.2;

  const maxValue = getMax(mockData);
  const minValue = 0; // For demo, graph starts from 0
  const chartHeight = height - padding * 1.15;
  const chartWidth = width - 2 * padding;

  // Map data points to SVG coordinates
  const points = mockData.map((d, i) => {
    const x = padding + (i * chartWidth) / (mockData.length - 1);
    const y =
      padding +
      chartHeight -
      ((d.value - minValue) / (maxValue - minValue)) * chartHeight;
    return { ...d, x, y };
  });

  // SVG path for lines
  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");

  // Area path for subtle area-fill effect
  const areaPath =
    `M ${points[0].x} ${height - padding}
    ` +
    points.map((p) => `L ${p.x} ${p.y}`).join(" ") +
    ` L ${points[points.length - 1].x} ${height - padding} Z`;

  // Grid lines (horizontal only for clarity)
  const nYGrid = 4;
  const gridLines = [];
  for (let i = 0; i <= nYGrid; ++i) {
    const y =
      padding + (chartHeight * i) / nYGrid;
    gridLines.push(
      <line
        key={i}
        x1={padding - 7}
        x2={width - padding + 7}
        y1={y}
        y2={y}
        stroke={CYBER_COLORS.grid}
        strokeDasharray="3,6"
        strokeWidth={i === nYGrid ? 1.4 : 1}
        opacity={i === nYGrid ? 0.24 : 0.13}
      />
    );
  }

  // Y-axis value labels
  const yLabels = [];
  for (let i = 0; i <= nYGrid; ++i) {
    const val =
      minValue +
      ((maxValue - minValue) * (nYGrid - i)) / nYGrid;
    yLabels.push(
      <text
        key={i}
        x={padding - 18}
        y={padding + (chartHeight * i) / nYGrid + 4}
        fill={CYBER_COLORS.label}
        fontSize="11"
        fontWeight="600"
        style={{ textShadow: "0 0 8px #09f" }}
        opacity={0.6}
        textAnchor="end"
      >
        {Math.round(val)}
      </text>
    );
  }

  return (
    <div
      className="card card-glow"
      style={{
        background: "var(--surface)",
        border: "1.5px solid var(--accent)",
        boxShadow:
          "0 1px 22px 5px #0ff4, 0 0 12px 3px #f0fa inset",
        borderRadius: 20,
        minWidth: 320,
        maxWidth: 390,
        margin: "20px auto",
        textAlign: "left",
        position: "relative",
        flex: "1 1 320px",
      }}
    >
      <div className="widget-title" style={{ marginBottom: 7 }}>
        Weekly Trend
      </div>
      <div style={{ color: "var(--accent)", fontSize: 13.5, opacity: 0.78, marginBottom: 12 }}>
        Mock activity score (last 7 days)
      </div>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="cyber-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0ff" />
            <stop offset="89%" stopColor="#f0f" />
          </linearGradient>
          <linearGradient id="cyber-area-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="12%" stopColor="#2cfeffbb" />
            <stop offset="100%" stopColor="#14162200" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {gridLines}
        {/* Y axis labels */}
        {yLabels}
        {/* Optional X-axis line for cyber accent */}
        <line
          x1={padding - 7}
          x2={width - padding + 7}
          y1={height - padding}
          y2={height - padding}
          stroke="var(--primary)"
          strokeWidth="1.4"
          opacity={0.19}
        />
        {/* Area under the line */}
        <path
          d={areaPath}
          fill={CYBER_COLORS.fill}
          opacity={0.78}
          style={{ filter: "blur(.3px)" }}
        />
        {/* Themed trend line */}
        <path
          d={linePath}
          fill="none"
          stroke={CYBER_COLORS.line}
          strokeWidth="3"
          style={{
            filter:
              "drop-shadow(0 0 12px var(--secondary)) drop-shadow(0 0 7px var(--accent))",
          }}
        />
        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={p.day}
            cx={p.x}
            cy={p.y}
            r={pointRadius}
            fill="var(--surface)"
            stroke={CYBER_COLORS.point}
            strokeWidth="2.1"
            style={{
              filter: "drop-shadow(0 0 7px var(--primary))",
              transition: "r 0.17s",
              cursor: "pointer",
            }}
          >
            {/* Could animate/click for tooltip interactivity */}
          </circle>
        ))}
        {/* X-axis labels */}
        {points.map((p, i) => (
          <text
            key={p.day + "lbl"}
            x={p.x}
            y={height - padding + 18}
            fill={CYBER_COLORS.label}
            fontSize="13"
            fontWeight={600}
            textAnchor="middle"
            style={{
              textShadow: "0 0 8px var(--secondary)",
              letterSpacing: ".04em",
            }}
            opacity={0.73}
          >
            {p.day}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default WeeklyTrendGraph;

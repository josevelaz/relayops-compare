import * as stylex from "@stylexjs/stylex";
import { useId } from "react";

const c = stylex.create({
  spark: {
    width: { default: 95, "@media (max-width: 680px)": 45 },
    height: 37,
    overflow: "hidden",
    flexShrink: 1,
    minWidth: 0,
  },
  chart: {
    width: "100%",
    height: "auto",
    display: "block",
    overflow: "visible",
  },
  chartWrap: { padding: "6px 18px 12px" },
  legend: {
    display: "flex",
    gap: 15,
    alignItems: "center",
    fontSize: 10,
    color: "#8b958d",
  },
  legendItem: { display: "flex", gap: 5, alignItems: "center" },
  dot: { width: 6, height: 6, backgroundColor: "#70a382", borderRadius: 2 },
  pale: { backgroundColor: "#d5e7d8" },
});
export function Sparkline({
  variant = 0,
  color = "#8eb29a",
}: {
  variant?: number;
  color?: string;
}) {
  const lines = [
    "0,27 6,27 11,22 18,24 24,18 31,22 37,20 43,23 49,16 55,18 61,11 67,13 73,9 79,13 85,6 95,8",
    "0,10 8,12 14,8 21,18 28,12 36,21 44,18 52,25 59,21 66,24 73,28 80,25 87,29 95,27",
    "0,29 9,28 17,26 26,26 33,19 40,20 48,14 57,17 65,10 72,12 80,7 89,8 95,5",
  ];
  return (
    <svg viewBox="0 0 95 37" aria-hidden="true" {...stylex.props(c.spark)}>
      <path
        d={`M ${lines[variant % 3].replaceAll(" ", " L ")} L 95,37 L 0,37 Z`}
        fill={color}
        fillOpacity=".07"
      />
      <polyline
        points={lines[variant % 3]}
        fill="none"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function IncidentTrend({
  large = false,
  total = 28,
  days = 30,
}: {
  large?: boolean;
  total?: number;
  days?: number;
}) {
  const weights = [
    2, 3, 1, 2, 4, 2, 3, 1, 2, 3, 5, 2, 1, 3, 2, 4, 2, 3, 1, 2, 4, 2, 3, 2, 1,
    3, 2, 5, 3, 4,
  ];
  const height = large ? 220 : 158;
  const bucketCount = Math.min(days, 30);
  const selectedWeights = weights.slice(30 - bucketCount);
  const weightTotal = selectedWeights.reduce((sum, value) => sum + value, 0);
  let cumulative = 0;
  let previous = 0;
  const bars = selectedWeights.map((weight) => {
    cumulative += weight;
    const next = Math.round((cumulative / weightTotal) * total);
    const count = next - previous;
    previous = next;
    return count;
  });
  const maximum = Math.max(3, Math.ceil(Math.max(...bars) / 3) * 3);
  const labels = Array.from({ length: 6 }, (_, index) =>
    new Date(
      Date.UTC(2026, 8, 8 - days + 1 + Math.round((index * (days - 1)) / 5)),
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }),
  );
  return (
    <div {...stylex.props(c.chartWrap)}>
      <svg
        viewBox={`0 0 620 ${height}`}
        role="img"
        aria-label={`${total} incidents over the last ${days} days, grouped into ${bucketCount} time buckets.`}
        {...stylex.props(c.chart)}
      >
        {[0, 1, 2, 3].map((n) => (
          <g key={n}>
            <line
              x1="24"
              x2="608"
              y1={20 + n * ((height - 50) / 3)}
              y2={20 + n * ((height - 50) / 3)}
              stroke="#edf1eb"
              strokeDasharray="3 4"
            />
            <text
              x="5"
              y={24 + n * ((height - 50) / 3)}
              fontSize="8.5"
              fill="#a1a99f"
            >
              {maximum - (n * maximum) / 3}
            </text>
          </g>
        ))}
        {bars.map((v, i) => {
          const barHeight = (v / maximum) * (height - 52);
          const x = 32 + i * (570 / bucketCount);
          const width = Math.min(30, 300 / bucketCount);
          return (
            <g key={i}>
              <rect
                x={x}
                y={height - 30 - barHeight}
                width={width}
                height={barHeight}
                rx="2"
                fill={i === 29 ? "#659d78" : "#d8e8db"}
              />
              <rect
                x={x}
                y={height - 30 - barHeight * 0.4}
                width={width}
                height={barHeight * 0.4}
                rx="1"
                fill={i === 29 ? "#487e5b" : "#9ec3a7"}
              />
            </g>
          );
        })}
        {labels.map((label, i) => (
          <text
            key={label}
            x={31 + i * 111}
            y={height - 7}
            fontSize="8.3"
            fill="#98a391"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}
export function Legend() {
  return (
    <div {...stylex.props(c.legend)}>
      <span {...stylex.props(c.legendItem)}>
        <span {...stylex.props(c.dot)} />
        SEV0–1
      </span>
      <span {...stylex.props(c.legendItem)}>
        <span {...stylex.props(c.dot, c.pale)} />
        SEV2–3
      </span>
    </div>
  );
}
export function ErrorChart({
  healthy = false,
  label = "Checkout error rate over the past hour",
  compact = false,
  kind = "error",
  days,
}: {
  healthy?: boolean;
  label?: string;
  compact?: boolean;
  kind?: "error" | "reliability";
  days?: number;
}) {
  const id = useId().replaceAll(":", "");
  const h = compact ? 140 : 205;
  const values: [number, number][] = [
    [0, 0.3],
    [7, 0.4],
    [15, 0.2],
    [21, 0.4],
    [22, 18.2],
    [25, 20.1],
    [29, 21.4],
    [32, 20.9],
    [33, 18.7],
    [38, 8.7],
    [43, 9.1],
    [48, 8.4],
    [53, 8.9],
    [58, 8.7],
  ];
  const points = values
    .map(([minute, value], index) => {
      const y =
        kind === "reliability"
          ? 20 + (((index % 4) + 1) / 30) * (h - 60)
          : h -
            40 -
            ((healthy ? 0.3 + (index % 3) * 0.06 : value) / 25) * (h - 60);
      return `${34 + (minute / 58) * 546},${y}`;
    })
    .join(" ");
  const rollbackX = 34 + (33 / 58) * 546;
  const finalY = h - 40 - (8.7 / 25) * (h - 60);
  const color = healthy ? "#70a584" : "#ca8268";
  return (
    <svg
      viewBox={`0 0 610 ${h}`}
      role="img"
      aria-label={label}
      {...stylex.props(c.chart)}
    >
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".16" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <line
            x1="34"
            x2="590"
            y1={20 + (i * (h - 60)) / 3}
            y2={20 + (i * (h - 60)) / 3}
            stroke="#eef0ea"
            strokeDasharray="3 4"
          />
          <text x="0" y={23 + (i * (h - 60)) / 3} fontSize="8.5" fill="#a0a895">
            {kind === "reliability"
              ? ["100%", "99.9", "99.8", "99.7"][i]
              : ["25%", "16%", "8%", "0%"][i]}
          </text>
        </g>
      ))}
      <path
        d={`M ${points.replaceAll(" ", " L ")} L 580,${h - 35} L 34,${h - 35} Z`}
        fill={`url(#${id})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {!healthy && !compact && (
        <>
          <line
            x1={rollbackX}
            x2={rollbackX}
            y1="19"
            y2={h - 35}
            stroke="#d4c7b6"
            strokeDasharray="3 3"
          />
          <rect
            x={rollbackX - 33}
            y="5"
            width="65"
            height="18"
            rx="4"
            fill="#f5f1e9"
          />
          <text x={rollbackX - 25} y="17" fill="#9a8a6c" fontSize="8">
            Rollback 10:43
          </text>
          <circle cx="580" cy={finalY} r="3" fill={color} />
        </>
      )}
      {(days
        ? Array.from({ length: 6 }, (_, index) =>
            new Date(
              Date.UTC(
                2026,
                8,
                8 - days + 1 + Math.round((index * (days - 1)) / 5),
              ),
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            }),
          )
        : ["10:10", "10:22", "10:34", "10:45", "10:57", "11:08"]
      ).map((t, i) => (
        <text key={t} x={34 + i * 106} y={h - 7} fill="#9ca58f" fontSize="8.5">
          {t}
        </text>
      ))}
    </svg>
  );
}
export function UptimeBars({ degraded = false }: { degraded?: boolean }) {
  return (
    <svg
      viewBox="0 0 300 27"
      role="img"
      aria-label={
        degraded
          ? "Service uptime: degraded during the current incident"
          : "Service uptime: operational"
      }
      {...stylex.props(c.chart)}
    >
      {Array.from({ length: 50 }, (_, i) => (
        <rect
          key={i}
          x={i * 6}
          y="2"
          width="3.5"
          height="21"
          rx="1.3"
          fill={
            degraded && [12, 35, 46, 47, 48, 49].includes(i)
              ? "#d8b779"
              : i % 9 === 0
                ? "#b4ceab"
                : "#93bb99"
          }
        />
      ))}
    </svg>
  );
}

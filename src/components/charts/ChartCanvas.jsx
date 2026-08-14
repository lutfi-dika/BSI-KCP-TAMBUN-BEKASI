import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { formatCompact } from "../../utils/helpers";
import { EASE } from "../../utils/animation";

const VIEW_W = 760;
const PAD_L = 54;
const PAD_R = 10;
const PAD_T = 12;
const PAD_B = 28;
const BASE_FONT = 10;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

/** Smooth cubic curve through the given points. */
function smoothPath(points) {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/**
 * Lightweight dependency-free SVG chart (line / area / bar) with an HTML
 * tooltip, hover guide, and a focus dot. Follows the active theme through the
 * --chart-N / --surface / --line tokens so it works in both color modes.
 */
export default function ChartCanvas({
  type = "line",
  series = [],
  data = [],
  locale = "id",
  height = 250,
  formatter,
  focusSeries = 0,
  ariaLabel = "",
  tooltipExtra,
}) {
  const wrapRef = useRef(null);
  const [active, setActive] = useState(null);
  const [wrapW, setWrapW] = useState(null);
  const uid = useId();

  // Track the rendered width so label fonts/paddings stay readable even when
  // the 760-unit viewBox is scaled down on small screens.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width;
      if (w) setWrapW(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const zoom = Math.min(
    MAX_ZOOM,
    Math.max(MIN_ZOOM, (wrapW ?? VIEW_W) ? VIEW_W / (wrapW ?? VIEW_W) : MIN_ZOOM)
  );
  const fontS = BASE_FONT * zoom;
  const padL = PAD_L * zoom;
  const padR = PAD_R * zoom;
  const padT = PAD_T * zoom;
  const padB = PAD_B * zoom;

  const innerW = VIEW_W - padL - padR;
  const innerH = height - padT - padB;

  const localize = useCallback(
    (label) => {
      if (typeof label === "string") return label;
      return label?.[locale] ?? label?.en ?? label?.id ?? "";
    },
    [locale]
  );

  const scales = useMemo(() => {
    const allValues = data.flatMap((d) => d.values);
    if (!allValues.length) return null;
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min || 1;
    const pad = range * 0.14;
    const yMin = min - pad;
    const yMax = max + pad;
    const n = data.length;
    const xAt = (i) =>
      padL + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
    const yAt = (v) => padT + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
    const ticks = Array.from({ length: 5 }, (_, i) => yMin + ((yMax - yMin) * i) / 4);
    const targetLabels = zoom >= 1.6 ? 5 : 6;
    const step = Math.max(1, Math.round(n / targetLabels));
    const xLabels = data
      .map((d, i) => ({ i, label: localize(d.label) }))
      .filter(({ i }) => i === 0 || i === n - 1 || i % step === 0);
    return { xAt, yAt, ticks, xLabels, yMin };
  }, [data, innerW, innerH, padL, padT, zoom, localize]);

  const lineFor = useCallback(
    (values) => smoothPath(values.map((v, i) => [scales.xAt(i), scales.yAt(v)])),
    [scales]
  );

  const areaFor = useCallback(
    (values) => {
      if (!values.length) return "";
      const baseY = padT + innerH;
      const pts = values.map((v, i) => [scales.xAt(i), scales.yAt(v)]);
      return `${smoothPath(pts)} L ${pts[pts.length - 1][0]} ${baseY} L ${pts[0][0]} ${baseY} Z`;
    },
    [scales, innerH, padT]
  );

  const fmt = formatter ?? ((v) => formatCompact(v, locale));

  const handlePointerMove = (event) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || !scales || !data.length) return;
    const svgX = (event.clientX - rect.left) * (VIEW_W / rect.width);
    const i = Math.round(((svgX - padL) / innerW) * (data.length - 1));
    setActive(Math.max(0, Math.min(data.length - 1, i)));
  };

  if (!scales) return null;

  const baseY = padT + innerH;
  const xLabelIsLast = (i) => i === data.length - 1;
  const colorOf = (s, i) => `var(--chart-${s.colorIndex ?? i + 1})`;

  const groupWidth = (innerW / data.length) * 0.62;
  const barWidth = groupWidth / series.length;

  const focusValue =
    active != null && series.length > 0 ? data[active].values[focusSeries] : null;
  const tooltipLeft = active != null ? (scales.xAt(active) / VIEW_W) * 100 : 0;

  return (
    <div
      ref={wrapRef}
      className="relative w-full select-none"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setActive(null)}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${height}`}
        className="block h-auto w-full"
        role="img"
        aria-label={ariaLabel}
      >
        {/* Grid lines + y labels */}
        {scales.ticks.map((t, ti) => (
          <g key={ti}>
            <line
              x1={padL}
              x2={VIEW_W - padR}
              y1={scales.yAt(t)}
              y2={scales.yAt(t)}
              stroke="var(--line-strong)"
              strokeWidth="1"
              strokeDasharray={ti === 0 ? undefined : "3 5"}
            />
            <text
              x={padL - 8}
              y={scales.yAt(t) + 3.5}
              textAnchor="end"
              fontSize={fontS}
              fill="var(--ink-faint)"
              fontFamily="inherit"
            >
              {formatCompact(t, locale)}
            </text>
          </g>
        ))}

        {/* X labels */}
        {scales.xLabels.map(({ i, label }) => (
          <text
            key={i}
            x={scales.xAt(i)}
            y={height - 8}
            textAnchor={i === 0 ? "start" : xLabelIsLast(i) ? "end" : "middle"}
            fontSize={fontS}
            fill="var(--ink-faint)"
            fontFamily="inherit"
          >
            {label}
          </text>
        ))}

        {/* Bars */}
        {type === "bar" &&
          data.map((d, i) => {
            const groupX = scales.xAt(i) - groupWidth / 2;
            return series.map((s, si) => {
              const bx = groupX + si * barWidth + (series.length > 1 ? 1.5 : 3);
              const bw = barWidth - (series.length > 1 ? 3 : 6);
              const v = d.values[si];
              const by = scales.yAt(v);
              const dimmed = active != null && active !== i;
              return (
                <motion.rect
                  key={`${s.id}-${i}`}
                  x={bx}
                  y={by}
                  width={bw}
                  height={Math.max(0, baseY - by)}
                  rx={4}
                  fill={colorOf(s, si)}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: dimmed ? 0.35 : 0.92 }}
                  transition={{ duration: 0.7, ease: EASE, delay: i * 0.04 }}
                  style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
                />
              );
            });
          })}

        {/* Area / line series */}
        {type !== "bar" &&
          series.map((s, si) => {
            const values = data.map((d) => d.values[si]);
            const color = colorOf(s, si);
            const isArea = s.kind === "area" || (type === "area" && si === 0);
            const gradId = `${uid}-g${si}`;
            return (
              <g key={s.id}>
                {isArea && (
                  <>
                    <defs>
                      <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.22 }} />
                        <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d={areaFor(values)}
                      fill={`url(#${gradId})`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
                    />
                  </>
                )}
                <motion.path
                  d={lineFor(values)}
                  fill="none"
                  stroke={color}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeDasharray={s.dashed ? "6 6" : undefined}
                  initial={s.dashed ? { opacity: 0 } : { pathLength: 0, opacity: 0 }}
                  animate={s.dashed ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: EASE, delay: si * 0.12 }}
                />
              </g>
            );
          })}

        {/* Hover guide + focus dot */}
        {active != null && focusValue != null && (
          <g pointerEvents="none">
            <line
              x1={scales.xAt(active)}
              x2={scales.xAt(active)}
              y1={padT}
              y2={baseY}
              stroke="var(--line-strong)"
              strokeWidth="1"
            />
            <circle
              cx={scales.xAt(active)}
              cy={scales.yAt(focusValue)}
              r={5}
              fill="var(--surface)"
              stroke={`var(--chart-${series[focusSeries].colorIndex ?? focusSeries + 1})`}
              strokeWidth="2.5"
            />
          </g>
        )}
      </svg>

      {/* Tooltip */}
      {active != null && (
        <div
          className="pointer-events-none absolute top-0 z-10 min-w-[140px] rounded-xl border border-line bg-elevated/95 px-3.5 py-2.5 shadow-lg backdrop-blur-sm"
          style={{
            left: `${tooltipLeft}%`,
            transform:
              tooltipLeft > 62
                ? "translateX(calc(-100% - 12px))"
                : "translateX(12px)",
          }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            {localize(data[active].label)}
          </p>
          <div className="mt-1 flex flex-col gap-0.5">
            {series.map((s, si) => (
              <p key={s.id} className="flex items-center justify-between gap-3 text-xs text-ink-mid">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: colorOf(s, si) }}
                  />
                  {s.name}
                </span>
                <span className="font-semibold tabular-nums text-ink">
                  {fmt(data[active].values[si])}
                </span>
              </p>
            ))}
          </div>
          {tooltipExtra && (
            <div className="mt-1.5 border-t border-line pt-1.5">
              {tooltipExtra(active, data)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

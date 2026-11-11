"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { trackingDemo } from "@/content/site";

const W = 560;
const H = 520;

/* Tramos de la ruta entre paradas */
const STOPS = [
  { x: 84, y: 92 },
  { x: 312, y: 150 },
  { x: 196, y: 330 },
  { x: 452, y: 428 },
];
const SEGMENTS = [
  "M84 92 C 170 58, 246 96, 312 150",
  "M312 150 C 392 214, 116 236, 196 330",
  "M196 330 C 262 404, 370 384, 452 428",
];
const LABEL_SIDE = ["right", "right", "left", "left"] as const;

/* Curvas de nivel alrededor de dos cerros: deterministas para que el servidor y el cliente dibujen lo mismo */
const contours = [
  { cx: 400, cy: 250, rings: 9, base: 22 },
  { cx: 140, cy: 190, rings: 6, base: 18 },
].flatMap(({ cx, cy, rings, base }, hill) =>
  Array.from({ length: rings }, (_, k) => {
    const radius = base + k * 26;
    const points = Array.from({ length: 73 }, (_, j) => {
      const t = (j / 72) * Math.PI * 2;
      const wobble = 1 + 0.09 * Math.sin(3 * t + k * 0.7 + hill) + 0.05 * Math.sin(5 * t + k * 1.3);
      return `${(cx + Math.cos(t) * radius * wobble * 1.25).toFixed(1)},${(cy + Math.sin(t) * radius * wobble).toFixed(1)}`;
    });
    return `M${points.join("L")}Z`;
  }),
);

/** `progress` va de 0 a 1 a lo largo de toda la ruta. */
export function RouteMap({ progress }: { progress: MotionValue<number> }) {
  const segmentRefs = useRef<(SVGPathElement | null)[]>([]);
  const markerRef = useRef<SVGGElement>(null);

  const draws = [
    useTransform(progress, [0, 1 / 3], [0, 1]),
    useTransform(progress, [1 / 3, 2 / 3], [0, 1]),
    useTransform(progress, [2 / 3, 1], [0, 1]),
  ];

  const place = (p: number) => {
    const marker = markerRef.current;
    const seg = Math.min(2, Math.floor(p * 3));
    const path = segmentRefs.current[seg];
    if (!marker || !path) return;
    const local = Math.min(1, Math.max(0, p * 3 - seg));
    const point = path.getPointAtLength(local * path.getTotalLength());
    marker.setAttribute("transform", `translate(${point.x} ${point.y})`);
  };

  useMotionValueEvent(progress, "change", place);
  useEffect(() => place(progress.get()));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="size-full" role="img" aria-label="Ruta de ejemplo de una donación hasta su entrega">
      <g fill="none" stroke="#fff" strokeOpacity={0.07} strokeWidth={1}>
        {contours.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {SEGMENTS.map((d, i) => (
        <g key={i} fill="none" strokeLinecap="round">
          <path d={d} stroke="#fff" strokeOpacity={0.18} strokeWidth={2} strokeDasharray="2 8" />
          <motion.path
            ref={(el) => {
              segmentRefs.current[i] = el;
            }}
            d={d}
            stroke="#f2b544"
            strokeWidth={3.5}
            style={{ pathLength: draws[i] }}
          />
        </g>
      ))}

      {STOPS.map((stop, i) => (
        <Stop key={i} index={i} x={stop.x} y={stop.y} progress={progress} side={LABEL_SIDE[i]} />
      ))}

      <g ref={markerRef} transform={`translate(${STOPS[0].x} ${STOPS[0].y})`}>
        <circle r={22} fill="#f2b544" fillOpacity={0.2} />
        <circle r={13} fill="#f2b544" />
        <path d="M-5 -4 L0 -6.5 L5 -4 L5 4 L0 6.5 L-5 4 Z M-5 -4 L0 -1.5 L5 -4 M0 -1.5 L0 6.5" fill="none" stroke="#062724" strokeWidth={1.5} strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function Stop({
  index,
  x,
  y,
  progress,
  side,
}: {
  index: number;
  x: number;
  y: number;
  progress: MotionValue<number>;
  side: "left" | "right";
}) {
  const reachedAt = index / 3;
  const fill = useTransform(progress, [reachedAt - 0.02, reachedAt], ["#0a3833", "#f2b544"]);
  const labelOpacity = useTransform(progress, [reachedAt - 0.06, reachedAt], [0.45, 1]);
  const dx = side === "right" ? 22 : -22;

  return (
    <g>
      <motion.circle cx={x} cy={y} r={8} stroke="#f2b544" strokeWidth={2} style={{ fill }} />
      <motion.text
        x={x + dx}
        y={y + 5}
        textAnchor={side === "right" ? "start" : "end"}
        fill="#fff"
        fontSize={15}
        fontWeight={600}
        style={{ opacity: labelOpacity }}
      >
        {trackingDemo.stops[index]}
      </motion.text>
    </g>
  );
}

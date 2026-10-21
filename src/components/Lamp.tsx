import { cn } from "@/lib/cn";

export type LampState = "idle" | "active" | "passed" | "failed";

const colors = {
  idle: {
    ambient: "rgba(255, 178, 76, 0.16)",
    cone: "rgba(255, 178, 76, 0.30)",
    pool: "rgba(255, 178, 76, 0.14)",
    bulb: "#ffc473",
  },
  active: {
    ambient: "rgba(255, 178, 76, 0.34)",
    cone: "rgba(255, 178, 76, 0.48)",
    pool: "rgba(255, 178, 76, 0.30)",
    bulb: "#ffe2ae",
  },
  passed: {
    ambient: "rgba(91, 191, 164, 0.32)",
    cone: "rgba(91, 191, 164, 0.42)",
    pool: "rgba(91, 191, 164, 0.26)",
    bulb: "#b8ebd9",
  },
  failed: {
    ambient: "rgba(224, 101, 91, 0.32)",
    cone: "rgba(224, 101, 91, 0.46)",
    pool: "rgba(224, 101, 91, 0.28)",
    bulb: "#f5b3ad",
  },
};

const glowClass: Record<LampState, string> = {
  idle: "lamp-glow-idle",
  active: "lamp-glow-active",
  passed: "lamp-glow-passed",
  failed: "lamp-glow-failed",
};

const labelX = {
  cone: 200,
  pool: 196,
  shade: 200,
  bulb: 202,
  armBase: 172,
  base: 164,
};

const labelY = {
  cone: 135,
  pool: 270,
  shade: 120,
  bulb: 120,
  armBase: 250,
  base: 255,
};

export default function Lamp({
  state = "idle",
  className,
}: {
  state?: LampState;
  className?: string;
}) {
  const c = colors[state];
  const transition = { transition: "fill 0.6s ease, opacity 0.6s ease" };
  const labelColor = state === "failed" ? "#e0655b" : state === "passed" ? "#5bbfa4" : "#ffb24c";

  return (
    <svg
      viewBox="0 0 320 300"
      className={cn("w-full h-auto", className)}
      role="img"
      aria-label={`FocusGlow lamp is ${state}`}
    >
      <defs>
        <radialGradient id="ambientGlow">
          <stop offset="0%" stopColor={c.ambient} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <linearGradient id="coneGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.cone} />
          <stop offset="100%" stopColor={c.pool} />
        </linearGradient>
      </defs>

      {/* Ambient room glow behind the lamp */}
      <circle cx="200" cy="112" r="150" fill="url(#ambientGlow)" style={transition} />

      {/* Desk surface */}
      <rect x="16" y="268" width="288" height="10" rx="5" fill="#303650" />
      <rect x="16" y="276" width="288" height="2" rx="1" fill="#262b40" />

      <g className={glowClass[state]}>
        {/* Light cone from shade to desk */}
        <polygon
          points="160,126 242,126 214,266 178,266"
          fill="url(#coneGrad)"
          style={transition}
        />
        {/* Pool of light on the desk */}
        <ellipse cx="196" cy="264" rx="62" ry="12" fill={c.pool} style={transition} />

        {/* Shade / dome */}
        <path
          d="M154 114 A 48 30 0 0 1 250 114 L 248 122 Q 202 140 156 122 Z"
          fill="#454d6e"
        />
        {/* Bulb glow inside the shade */}
        <ellipse
          cx="202" cy="116" rx="30" ry="12" fill={c.bulb} style={transition}
        />

        {/* Arm from base to shade */}
        <path
          d="M172 244 C 172 170, 176 140, 200 112"
          fill="none"
          stroke="#3c4363"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Base */}
        <rect x="118" y="238" width="92" height="26" rx="13" fill="#3c4363" />
        <circle cx="164" cy="251" r="4" fill={c.bulb} style={transition} />
      </g>

      {/* Labels for lamp components */}
      <text
        x={labelX.cone}
        y={labelY.cone}
        textAnchor="middle"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fontSize="10"
        fontWeight="500"
        fill={labelColor}
        opacity={0.8}
      >
        Light Cone
      </text>

      <text
        x={labelX.pool}
        y={labelY.pool}
        textAnchor="middle"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fontSize="10"
        fontWeight="500"
        fill={labelColor}
        opacity={0.8}
      >
        Light Pool
      </text>

      <text
        x={labelX.shade}
        y={labelY.shade}
        textAnchor="middle"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fontSize="10"
        fontWeight="500"
        fill={labelColor}
        opacity={0.8}
      >
        Shade / Dome
      </text>

      <text
        x={labelX.bulb}
        y={labelY.bulb - 8}
        textAnchor="middle"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fontSize="10"
        fontWeight="500"
        fill={labelColor}
        opacity={0.8}
      >
        Bulb
      </text>

      <text
        x={labelX.armBase}
        y={labelY.armBase + 12}
        textAnchor="middle"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fontSize="9"
        fontWeight="500"
        fill={labelColor}
        opacity={0.8}
      >
        Arm
      </text>

      <text
        x={labelX.base}
        y={labelY.base + 16}
        textAnchor="middle"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fontSize="9"
        fontWeight="500"
        fill={labelColor}
        opacity={0.8}
      >
        Base
      </text>
    </svg>
  );
}
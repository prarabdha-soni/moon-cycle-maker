interface Phase {
  from: number;
  to: number;
  color: string;
}

interface CycleRingProps {
  cycleLen: number;
  day: number;
  phases: Phase[];
  top?: string;
  big: string;
  sub?: string;
  dashed?: boolean;
  accent?: string;
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arc(cx: number, cy: number, r: number, s0: number, s1: number): string {
  const s = polar(cx, cy, r, s1);
  const e = polar(cx, cy, r, s0);
  const big = s1 - s0 <= 180 ? 0 : 1;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${big} 0 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

export function CycleRing({
  cycleLen,
  day,
  phases,
  top,
  big,
  sub,
  dashed,
  accent = "#E26D8A",
}: CycleRingProps) {
  const size = 262;
  const stroke = 15;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - stroke) / 2 - 8;
  const gap = 2.2;

  const d2deg = (d: number) => ((d - 1) / cycleLen) * 360;
  const mk = polar(cx, cy, r, d2deg(day - 0.5));

  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F6ECE8" strokeWidth={stroke} />
        {phases.map((p, i) => {
          const a0 = d2deg(p.from) + gap;
          const a1 = d2deg(p.to + 1) - gap;
          if (a1 <= a0) return null;
          return (
            <path
              key={i}
              d={arc(cx, cy, r, a0, a1)}
              fill="none"
              stroke={p.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              {...(dashed ? { strokeDasharray: "1 9", opacity: 0.55 } : {})}
            />
          );
        })}
        <circle
          cx={mk.x.toFixed(2)}
          cy={mk.y.toFixed(2)}
          r={13}
          fill="#fff"
          stroke={accent}
          strokeWidth={3.5}
          style={{ filter: "drop-shadow(0 3px 6px rgba(150,75,100,.25))" }}
        />
        <circle cx={mk.x.toFixed(2)} cy={mk.y.toFixed(2)} r={4} fill={accent} />
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 36px",
        }}
      >
        {top && (
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              color: "#C9577A",
              marginBottom: 6,
            }}
          >
            {top}
          </div>
        )}
        <div
          style={{
            fontSize: 38,
            fontWeight: 800,
            color: "#2E2329",
            lineHeight: 1.05,
            letterSpacing: -0.5,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {big}
        </div>
        {sub && (
          <div
            style={{
              fontSize: 13.5,
              fontWeight: 500,
              color: "#705F66",
              marginTop: 7,
              lineHeight: 1.35,
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

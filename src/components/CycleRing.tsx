import { useMemo } from "react";

interface CycleRingProps {
  cycleLength: number;
  currentDay: number;
  periodLength: number;
  ovulationDay: number;
  fertileWindow: [number, number];
}

export function CycleRing({
  cycleLength,
  currentDay,
  periodLength,
  ovulationDay,
  fertileWindow,
}: CycleRingProps) {
  const size = 320;
  const stroke = 22;
  const r = (size - stroke) / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const perDeg = 360 / cycleLength;

  // Helper: convert day range to stroke-dasharray + offset (rotated -90deg via transform)
  const segment = (startDay: number, endDay: number) => {
    const startAngle = (startDay - 1) * perDeg;
    const lengthDeg = (endDay - startDay + 1) * perDeg;
    const lengthArc = (lengthDeg / 360) * circumference;
    const offsetArc = (startAngle / 360) * circumference;
    return {
      strokeDasharray: `${lengthArc} ${circumference}`,
      strokeDashoffset: -offsetArc,
    };
  };

  const periodSeg = useMemo(() => segment(1, periodLength), [periodLength, circumference]);
  const fertileSeg = useMemo(
    () => segment(fertileWindow[0], fertileWindow[1]),
    [fertileWindow, circumference],
  );

  // Indicator dot for "today"
  const todayAngleDeg = (currentDay - 1) * perDeg - 90;
  const todayRad = (todayAngleDeg * Math.PI) / 180;
  const todayX = cx + r * Math.cos(todayRad);
  const todayY = cy + r * Math.sin(todayRad);

  // Period drop indicator (start of period)
  const dropAngleDeg = -90;
  const dropRad = (dropAngleDeg * Math.PI) / 180;
  const dropX = cx + r * Math.cos(dropRad);
  const dropY = cy + r * Math.sin(dropRad);

  // Decorative dots scattered along cycle (PMS, mood, symptoms)
  const dots = useMemo(() => {
    const palette = [
      "var(--color-period)",
      "var(--color-fertile)",
      "var(--color-ovulation)",
      "var(--color-pms)",
      "var(--color-period-light)",
    ];
    return Array.from({ length: 22 }).map((_, i) => {
      const day = ((i * 1.6) % cycleLength) + 1;
      const angle = ((day - 1) * perDeg - 90) * (Math.PI / 180);
      const radial = r - stroke / 2 - 6 - ((i * 7) % 22);
      return {
        x: cx + radial * Math.cos(angle),
        y: cy + radial * Math.sin(angle),
        color: palette[i % palette.length],
        size: (i % 3) + 2,
      };
    });
  }, [cycleLength]);

  const daysUntilNextPeriod = cycleLength - currentDay + 1;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${cx} ${cy})`}>
          {/* Track */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="var(--color-track)"
            strokeWidth={stroke}
          />

          {/* Fertile / luteal teal segment */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="var(--color-fertile)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={fertileSeg.strokeDasharray}
            strokeDashoffset={fertileSeg.strokeDashoffset}
          />

          {/* Period segment (red gradient feel via two layers) */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="var(--color-period-light)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={periodSeg.strokeDasharray}
            strokeDashoffset={periodSeg.strokeDashoffset}
            opacity={0.85}
          />
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="var(--color-period)"
            strokeWidth={stroke - 6}
            strokeLinecap="round"
            strokeDasharray={segment(1, Math.max(2, periodLength - 2)).strokeDasharray}
            strokeDashoffset={segment(1, Math.max(2, periodLength - 2)).strokeDashoffset}
          />
        </g>

        {/* Ovulation marker */}
        {(() => {
          const a = ((ovulationDay - 1) * perDeg - 90) * (Math.PI / 180);
          const x = cx + r * Math.cos(a);
          const y = cy + r * Math.sin(a);
          return <circle cx={x} cy={y} r={6} fill="var(--color-ovulation)" />;
        })()}

        {/* Decorative symptom dots */}
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.size} fill={d.color} opacity={0.85} />
        ))}

        {/* Today indicator */}
        <g>
          <circle
            cx={todayX}
            cy={todayY}
            r={20}
            fill="var(--color-card)"
            stroke="var(--color-fertile)"
            strokeWidth={2}
          />
          <text
            x={todayX}
            y={todayY - 3}
            textAnchor="middle"
            fontSize="7"
            fill="var(--color-muted-foreground)"
            fontFamily="var(--font-sans)"
          >
            Day
          </text>
          <text
            x={todayX}
            y={todayY + 8}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="var(--color-foreground)"
            fontFamily="var(--font-sans)"
          >
            {currentDay}
          </text>
        </g>

        {/* Period blood drop at start */}
        <g transform={`translate(${dropX - 8}, ${dropY - 14})`}>
          <path
            d="M8 0 C 12 6, 16 10, 16 16 A 8 8 0 0 1 0 16 C 0 10, 4 6, 8 0 Z"
            fill="var(--color-period)"
          />
        </g>
      </svg>

      {/* Center text */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-[13px] font-medium text-muted-foreground">Today, 16 Aug</p>
        <p className="mt-2 max-w-[180px] font-display text-[26px] font-medium leading-tight text-foreground">
          {daysUntilNextPeriod} days until your next period
        </p>
      </div>
    </div>
  );
}

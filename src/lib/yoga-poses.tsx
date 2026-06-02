export type YogaPose = {
  id: string;
  name: string;
  sanskrit: string;
  durationSec: number;
  holdLabel: string;
  benefit: string;
  benefitClass: string;
  tip: string;
};

export const YOGA_POSES: YogaPose[] = [
  {
    id: "butterfly",
    name: "Butterfly pose",
    sanskrit: "Baddha Konasana",
    durationSec: 180,
    holdLabel: "3 min",
    benefit: "Irregular periods",
    benefitClass: "bg-period/10 text-period",
    tip: "Sit tall. Gently press knees toward the mat with your elbows.",
  },
  {
    id: "reclining",
    name: "Reclining butterfly",
    sanskrit: "Supta Baddha Konasana",
    durationSec: 300,
    holdLabel: "5 min",
    benefit: "Anxiety + Periods",
    benefitClass: "bg-pms/10 text-pms",
    tip: "Let gravity do the work. One hand on belly, one on heart.",
  },
  {
    id: "garland",
    name: "Garland pose",
    sanskrit: "Malasana",
    durationSec: 120,
    holdLabel: "2 min",
    benefit: "Ovary stimulation",
    benefitClass: "bg-ovulation/10 text-ovulation",
    tip: "Press palms together at chest. Heels flat, or use a folded blanket.",
  },
  {
    id: "child",
    name: "Child's pose",
    sanskrit: "Balasana",
    durationSec: 180,
    holdLabel: "3 min",
    benefit: "Anxiety",
    benefitClass: "bg-pms/10 text-pms",
    tip: "Breathe into your back. Let your forehead soften into the mat.",
  },
  {
    id: "fold",
    name: "Forward fold",
    sanskrit: "Uttanasana",
    durationSec: 120,
    holdLabel: "2 min",
    benefit: "Calm",
    benefitClass: "bg-fertile/10 text-fertile",
    tip: "Bend your knees generously. Let your head hang heavy — no forcing.",
  },
  {
    id: "legs-up",
    name: "Legs up the wall",
    sanskrit: "Viparita Karani",
    durationSec: 300,
    holdLabel: "5 min",
    benefit: "Cycle regulation",
    benefitClass: "bg-pcos/10 text-pcos",
    tip: "Scoot hips close to the wall. Arms at sides, palms facing up.",
  },
];

// All SVGs use viewBox="0 0 108 110", stroke="currentColor", so color is
// inherited from the parent's text color class (e.g. text-pcos).
export function PoseSVG({ id, className }: { id: string; className?: string }) {
  const base = {
    viewBox: "0 0 108 110",
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  // Butterfly pose — front view, seated, knees splayed
  if (id === "butterfly") {
    return (
      <svg {...base}>
        <ellipse cx="54" cy="12" rx="9" ry="9" fill="currentColor" fillOpacity={0.18} stroke="currentColor" strokeWidth={1} />
        <path d="M54 21 L54 52" stroke="currentColor" strokeWidth={2} />
        <path d="M54 52 Q30 60 20 72 Q16 78 22 80 Q28 80 32 72 Q40 62 54 58" stroke="currentColor" strokeWidth={1.5} />
        <path d="M54 52 Q78 60 88 72 Q92 78 86 80 Q80 80 76 72 Q68 62 54 58" stroke="currentColor" strokeWidth={1.5} />
        <ellipse cx="22" cy="81" rx="10" ry="6" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} />
        <ellipse cx="86" cy="81" rx="10" ry="6" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} />
        <path d="M54 52 L42 70 L42 95" stroke="currentColor" strokeWidth={1.5} />
        <path d="M54 52 L66 70 L66 95" stroke="currentColor" strokeWidth={1.5} />
        <ellipse cx="30" cy="96" rx="15" ry="6" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} />
        <ellipse cx="78" cy="96" rx="15" ry="6" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} />
        <path d="M42 95 Q36 96 30 96" stroke="currentColor" strokeWidth={1.5} />
        <path d="M66 95 Q72 96 78 96" stroke="currentColor" strokeWidth={1.5} />
        <line x1="10" y1="105" x2="98" y2="105" stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} strokeDasharray="3,3" />
      </svg>
    );
  }

  // Reclining butterfly — lying, top-down angled view, arms out, legs butterfly
  if (id === "reclining") {
    return (
      <svg {...base}>
        <ellipse cx="54" cy="10" rx="9" ry="9" fill="currentColor" fillOpacity={0.18} stroke="currentColor" strokeWidth={1} />
        <path d="M54 19 L54 42" stroke="currentColor" strokeWidth={2} />
        <path d="M54 30 L26 44" stroke="currentColor" strokeWidth={1.5} />
        <path d="M54 30 L82 44" stroke="currentColor" strokeWidth={1.5} />
        <ellipse cx="20" cy="46" rx="8" ry="5" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} transform="rotate(-20,20,46)" />
        <ellipse cx="88" cy="46" rx="8" ry="5" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} transform="rotate(20,88,46)" />
        <path d="M54 42 L38 65 L18 75" stroke="currentColor" strokeWidth={1.5} />
        <path d="M54 42 L70 65 L90 75" stroke="currentColor" strokeWidth={1.5} />
        <rect x="4" y="72" width="28" height="10" rx="5" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} transform="rotate(-15,18,77)" />
        <rect x="76" y="72" width="28" height="10" rx="5" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} transform="rotate(15,90,77)" />
        <path d="M54 42 L52 65 L18 85" stroke="currentColor" strokeWidth={1.5} />
        <path d="M54 42 L56 65 L90 85" stroke="currentColor" strokeWidth={1.5} />
        <ellipse cx="12" cy="87" rx="12" ry="5" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} transform="rotate(-10,12,87)" />
        <ellipse cx="96" cy="87" rx="12" ry="5" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} transform="rotate(10,96,87)" />
        <line x1="10" y1="100" x2="98" y2="100" stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} strokeDasharray="3,3" />
      </svg>
    );
  }

  // Garland pose — deep squat, front view, hands in prayer
  if (id === "garland") {
    return (
      <svg {...base}>
        <ellipse cx="54" cy="28" rx="9" ry="9" fill="currentColor" fillOpacity={0.18} stroke="currentColor" strokeWidth={1} />
        <path d="M54 37 L54 58" stroke="currentColor" strokeWidth={2} />
        <path d="M54 48 L32 52" stroke="currentColor" strokeWidth={1.5} />
        <path d="M54 48 L76 52" stroke="currentColor" strokeWidth={1.5} />
        <rect x="23" y="48" width="18" height="9" rx="4" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} transform="rotate(-5,32,52)" />
        <rect x="67" y="48" width="18" height="9" rx="4" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} transform="rotate(5,76,52)" />
        <path d="M46 58 L26 72 Q18 82 26 86 L54 88 L82 86 Q90 82 82 72 L62 58 Z" fill="currentColor" fillOpacity={0.07} stroke="currentColor" strokeWidth={1.5} />
        <path d="M54 58 L54 88" stroke="currentColor" strokeOpacity={0.25} strokeWidth={1} strokeDasharray="2,2" />
        <ellipse cx="26" cy="87" rx="12" ry="5" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} />
        <ellipse cx="82" cy="87" rx="12" ry="5" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} />
        <line x1="10" y1="100" x2="98" y2="100" stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} strokeDasharray="3,3" />
      </svg>
    );
  }

  // Child's pose — kneeling, folded forward, arms extended
  if (id === "child") {
    return (
      <svg {...base}>
        <ellipse cx="54" cy="22" rx="9" ry="9" fill="currentColor" fillOpacity={0.18} stroke="currentColor" strokeWidth={1} />
        <path d="M54 31 L54 52" stroke="currentColor" strokeWidth={2} />
        <path d="M54 40 L30 46" stroke="currentColor" strokeWidth={1.5} />
        <path d="M54 40 L78 46" stroke="currentColor" strokeWidth={1.5} />
        <rect x="20" y="42" width="18" height="9" rx="4" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} transform="rotate(-8,30,46)" />
        <rect x="70" y="42" width="18" height="9" rx="4" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} transform="rotate(8,78,46)" />
        <path d="M54 52 L48 72 L48 92" stroke="currentColor" strokeWidth={1.5} />
        <path d="M54 52 L60 72 L60 92" stroke="currentColor" strokeWidth={1.5} />
        <path d="M48 92 L40 96 L68 96 L60 92 Z" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} />
        <path d="M40 96 L14 96" stroke="currentColor" strokeWidth={1.5} />
        <path d="M68 96 L94 96" stroke="currentColor" strokeWidth={1.5} />
        <ellipse cx="8" cy="96" rx="8" ry="5" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} />
        <ellipse cx="100" cy="96" rx="8" ry="5" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} />
        <line x1="10" y1="106" x2="98" y2="106" stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} strokeDasharray="3,3" />
      </svg>
    );
  }

  // Forward fold — standing, bent at hips, head hanging between knees
  if (id === "fold") {
    return (
      <svg {...base}>
        <ellipse cx="54" cy="18" rx="9" ry="9" fill="currentColor" fillOpacity={0.18} stroke="currentColor" strokeWidth={1} />
        <path d="M54 27 L54 50" stroke="currentColor" strokeWidth={2} />
        <path d="M54 36 L34 34" stroke="currentColor" strokeWidth={1.5} />
        <path d="M54 36 L74 34" stroke="currentColor" strokeWidth={1.5} />
        <rect x="23" y="30" width="18" height="9" rx="4" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} transform="rotate(-10,32,35)" />
        <rect x="67" y="30" width="18" height="9" rx="4" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} transform="rotate(10,76,35)" />
        <path d="M54 50 Q42 62 40 78 Q38 90 54 92 Q70 90 68 78 Q66 62 54 50" fill="currentColor" fillOpacity={0.07} stroke="currentColor" strokeWidth={1.5} />
        <ellipse cx="40" cy="96" rx="12" ry="5" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} />
        <ellipse cx="68" cy="96" rx="12" ry="5" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} />
        <path d="M46 92 L40 96" stroke="currentColor" strokeWidth={1.5} />
        <path d="M62 92 L68 96" stroke="currentColor" strokeWidth={1.5} />
        <line x1="20" y1="103" x2="88" y2="103" stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} strokeDasharray="3,3" />
      </svg>
    );
  }

  // Legs up the wall — inverted, person lying with legs vertical
  if (id === "legs-up") {
    return (
      <svg {...base}>
        <ellipse cx="54" cy="72" rx="9" ry="9" fill="currentColor" fillOpacity={0.18} stroke="currentColor" strokeWidth={1} />
        <path d="M54 63 L54 40" stroke="currentColor" strokeWidth={2} />
        <path d="M54 50 L30 38" stroke="currentColor" strokeWidth={1.5} />
        <path d="M54 50 L78 38" stroke="currentColor" strokeWidth={1.5} />
        <ellipse cx="22" cy="35" rx="9" ry="5" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} transform="rotate(-30,22,35)" />
        <ellipse cx="86" cy="35" rx="9" ry="5" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} transform="rotate(30,86,35)" />
        <path d="M54 40 L38 18 M54 40 L70 18" stroke="currentColor" strokeWidth={1.5} />
        <ellipse cx="34" cy="14" rx="8" ry="5" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} transform="rotate(-20,34,14)" />
        <ellipse cx="74" cy="14" rx="8" ry="5" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={1} transform="rotate(20,74,14)" />
        <line x1="10" y1="86" x2="98" y2="86" stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} strokeDasharray="3,3" />
        <path d="M20 86 L88 86" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1.5} />
      </svg>
    );
  }

  return null;
}

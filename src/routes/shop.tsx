import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [{ title: "Shop — SheThrives" }],
  }),
  component: ShopScreen,
});

const ACCENT = "#E26D8A";
const ACCENT_DEEP = "#C9577A";
const ACCENT_SOFT = "#FBE7EC";
const CARD_SHADOW = "0 1px 2px rgba(70,35,48,.04), 0 10px 30px rgba(170,90,115,.07)";

const CATS = ["Curated for you", "Supplements", "Teas", "Comfort", "Books"];

const PRODUCTS = [
  { c1:"#9C7CC1", c2:"#E26D8A", ic:"🌿", name:"Myo-Inositol blend", sub:"Hormone & cycle support", price:"₹2,349" },
  { c1:"#E26D8A", c2:"#D99B57", ic:"🍵", name:"Cramp-ease tea", sub:"Ginger & raspberry leaf", price:"₹1,349" },
  { c1:"#6FA98B", c2:"#9C7CC1", ic:"🔥", name:"Warming heat patch", sub:"8-hour gentle relief · 5pk", price:"₹1,149" },
  { c1:"#D99B57", c2:"#6FA98B", ic:"💧", name:"Iron + B12 gummies", sub:"Restore mode essentials", price:"₹1,849" },
  { c1:"#E26D8A", c2:"#9C7CC1", ic:"❤️", name:"Prenatal complete", sub:"Folate-rich, gentle on tummy", price:"₹2,699" },
  { c1:"#9C7CC1", c2:"#D99B57", ic:"🌙", name:"Magnesium calm", sub:"For sleep & PMS ease", price:"₹1,599" },
];

function ThumbGradient({ c1, c2, ic, h }: { c1: string; c2: string; ic: string; h: number }) {
  return (
    <div style={{ position: "relative", width: "100%", height: h, borderRadius: 16, overflow: "hidden", background: `linear-gradient(135deg,${c1},${c2})`, flexShrink: 0 }}>
      <div style={{ position: "absolute", right: -14, bottom: -14, opacity: .32, fontSize: h * 0.5 }}>{ic}</div>
      <div style={{ position: "absolute", left: -20, top: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,.14)" }} />
    </div>
  );
}

function ShopScreen() {
  const [activeCat, setActiveCat] = useState("Curated for you");
  const [cartCount] = useState(2);

  return (
    <AppShell>
      <div className="fade-in" style={{ minHeight: "100%", background: "linear-gradient(180deg,#FCF5F2,#FBF3F0)" }}>
        <div style={{ padding: "60px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: "#2E2329", marginBottom: 4, letterSpacing: -0.6 }}>Shop</h1>
              <p style={{ fontSize: 14.5, color: "#705F66", margin: 0 }}>Wellness picks for your phase.</p>
            </div>
            <button style={{ position: "relative", width: 44, height: 44, borderRadius: "50%", background: "#fff", border: "1px solid #F0E2DE", boxShadow: CARD_SHADOW, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 21 }}>
              🛒
              <span style={{ position: "absolute", top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 999, background: ACCENT, color: "#fff", fontSize: 10.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{cartCount}</span>
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", marginTop: 16, paddingBottom: 4 }} className="scrollbar-hide">
            {CATS.map(c => (
              <button key={c} onClick={() => setActiveCat(c)}
                style={{ flexShrink: 0, padding: "9px 15px", fontSize: 13.5, fontWeight: 600, borderRadius: 999, border: `1px solid ${activeCat === c ? ACCENT : "#F0E2DE"}`, background: activeCat === c ? ACCENT : "#fff", color: activeCat === c ? "#fff" : "#705F66", cursor: "pointer", fontFamily: "inherit", transition: "all .15s ease", whiteSpace: "nowrap" }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "18px 20px 20px" }}>
          {/* Banner */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, borderRadius: 24, padding: "18px 20px", marginBottom: 18, background: `linear-gradient(120deg,${ACCENT_DEEP},${ACCENT})`, boxShadow: `0 12px 30px rgba(226,109,138,.28)` }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".8px", textTransform: "uppercase", color: "rgba(255,255,255,.85)" }}>Phase bundle</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "4px 0 8px" }}>Your follicular essentials, 20% off</div>
              <span style={{ display: "inline-block", background: "#fff", color: ACCENT_DEEP, fontSize: 12.5, fontWeight: 700, padding: "7px 14px", borderRadius: 999 }}>Shop the edit</span>
            </div>
            <span style={{ fontSize: 56, opacity: .5 }}>🌿</span>
          </div>

          {/* Product grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {PRODUCTS.map(p => (
              <div key={p.name} style={{ background: "#fff", borderRadius: 22, padding: 9, border: "1px solid #F6ECE8", boxShadow: CARD_SHADOW }}>
                <div style={{ position: "relative" }}>
                  <ThumbGradient c1={p.c1} c2={p.c2} ic={p.ic} h={118} />
                  <button style={{ position: "absolute", right: 8, bottom: 8, width: 34, height: 34, borderRadius: "50%", border: "none", background: "#fff", boxShadow: "0 8px 26px rgba(180,100,120,.10)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 19, color: ACCENT }}>+</button>
                </div>
                <div style={{ padding: "11px 7px 6px" }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: "#2E2329", lineHeight: 1.25 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#705F66", marginTop: 2, lineHeight: 1.3 }}>{p.sub}</div>
                  <div style={{ fontSize: 15.5, fontWeight: 800, color: "#2E2329", marginTop: 8, letterSpacing: -0.2 }}>{p.price}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ height: 8 }} />
        </div>
      </div>
    </AppShell>
  );
}

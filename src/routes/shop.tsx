import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ShoppingBag, Star, Check, Heart } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";
import shetrivesCup from "@/assets/shetrives-cup.png";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Petal" },
      { name: "description", content: "Curated period care products for your cycle." },
    ],
  }),
  component: ShopScreen,
});

const CATEGORIES = ["All", "Period Care", "Supplements", "Skincare", "Wellness"];

const PRODUCTS = [
  {
    id: "shetrives-cup",
    name: "SheTrives Soft Menstrual Cup",
    subtitle: "Size Regular · Desert Blush",
    price: 499,
    mrp: 799,
    rating: 4.8,
    reviews: 1240,
    tag: "Period Care",
    badge: "Best Seller",
    badgeColor: "bg-period/10 text-period",
    features: ["Medical-grade soft silicone", "Reusable for up to 5 years", "Made in India"],
    image: shetrivesCup,
    hasImage: true,
  },
  {
    id: "iron-gummies",
    name: "Iron + Vitamin C Gummies",
    subtitle: "Strawberry flavour · 60 gummies",
    price: 349,
    mrp: 499,
    rating: 4.6,
    reviews: 843,
    tag: "Supplements",
    badge: "New",
    badgeColor: "bg-fertile/10 text-fertile",
    features: ["Supports energy during period", "High-absorption formula", "Vegan & gluten-free"],
    hasImage: false,
    gradient: "from-period-light to-ovulation",
  },
  {
    id: "magnesium",
    name: "Magnesium Glycinate 400mg",
    subtitle: "60 capsules · 2-month supply",
    price: 599,
    mrp: 799,
    rating: 4.9,
    reviews: 2105,
    tag: "Supplements",
    badge: "Top Rated",
    badgeColor: "bg-ovulation/10 text-ovulation",
    features: ["Reduces cramps & PMS", "Improves sleep quality", "Clinically studied dosage"],
    hasImage: false,
    gradient: "from-ovulation to-fertile",
  },
  {
    id: "pcos-support",
    name: "PCOS Balance Supplement",
    subtitle: "90 capsules · 3-month supply",
    price: 899,
    mrp: 1299,
    rating: 4.8,
    reviews: 1567,
    tag: "Supplements",
    badge: "PCOS Care",
    badgeColor: "bg-pms/10 text-pms",
    features: ["Supports hormonal balance", "Myo-inositol & D-chiro inositol", "Helps regulate cycles", "Vegan & gluten-free"],
    hasImage: false,
    gradient: "from-pms to-period",
  },
  {
    id: "heating-patch",
    name: "Period Relief Heating Patch",
    subtitle: "Pack of 5 · 8-hour heat",
    price: 249,
    mrp: 349,
    rating: 4.7,
    reviews: 576,
    tag: "Wellness",
    badge: null,
    badgeColor: "",
    features: ["Air-activated warmth", "Ultra-thin & discreet", "Drug-free relief"],
    hasImage: false,
    gradient: "from-pms to-period-light",
  },
];

function ShopScreen() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());

  const toggleWishlist = (id: string) => {
    setWishlist((w) => {
      const next = new Set(w);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = activeCategory === "All"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.tag === activeCategory);

  const [featured, ...rest] = filtered;

  return (
    <AppShell title="Shop">
      <div className="pb-6">

        {/* Search */}
        <div className="px-5 pt-2 pb-3">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-2.5">
            <Search className="size-4 text-muted-foreground shrink-0" strokeWidth={2} />
            <span className="text-[14px] text-muted-foreground">Search products…</span>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto px-5 pb-3 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors",
                activeCategory === cat
                  ? "bg-period text-white"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="px-5 space-y-4">

          {/* Featured product */}
          {featured && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Featured</p>
              <div className="overflow-hidden rounded-3xl border border-border bg-card">
                {/* Product image / gradient */}
                <div className="relative">
                  {featured.hasImage ? (
                    <div className="relative grid place-items-center bg-gradient-to-br from-fertile-light/40 via-period-light/30 to-pms/30 px-4 pt-5 pb-2">
                      {featured.badge && (
                        <span className={cn("absolute left-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider", featured.badgeColor)}>
                          {featured.badge}
                        </span>
                      )}
                      <button
                        onClick={() => toggleWishlist(featured.id)}
                        className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-background/70 backdrop-blur-sm"
                      >
                        <Heart className={cn("size-4", wishlist.has(featured.id) ? "fill-period text-period" : "text-muted-foreground")} strokeWidth={2} />
                      </button>
                      <img src={featured.image} alt={featured.name} className="h-44 w-auto object-contain drop-shadow-md" />
                    </div>
                  ) : (
                    <div className={cn("h-36 bg-gradient-to-br flex items-end p-4", featured.gradient)}>
                      {featured.badge && (
                        <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-white/20 text-white")}>
                          {featured.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {/* Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{featured.tag}</p>
                      <h3 className="mt-0.5 font-display text-[18px] font-semibold leading-snug text-foreground">{featured.name}</h3>
                      <p className="text-[12px] text-muted-foreground">{featured.subtitle}</p>
                    </div>
                    {!featured.hasImage && (
                      <button onClick={() => toggleWishlist(featured.id)} className="grid size-8 place-items-center rounded-full bg-muted">
                        <Heart className={cn("size-4", wishlist.has(featured.id) ? "fill-period text-period" : "text-muted-foreground")} strokeWidth={2} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="size-3.5 fill-pms text-pms" strokeWidth={0} />
                    <span className="text-[12px] font-semibold text-foreground">{featured.rating}</span>
                    <span className="text-[12px] text-muted-foreground">({featured.reviews.toLocaleString()})</span>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {featured.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[13px] text-foreground">
                        <Check className="size-3.5 shrink-0 text-fertile" strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="font-display text-[22px] font-bold text-foreground">₹{featured.price}</p>
                      <p className="text-[11px] text-muted-foreground line-through">₹{featured.mrp}</p>
                    </div>
                    <button
                      onClick={() => setCart((c) => { const n = new Set(c); n.add(featured.id); return n; })}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all",
                        cart.has(featured.id)
                          ? "bg-fertile/15 text-fertile"
                          : "bg-period text-white shadow-md shadow-period/30"
                      )}
                    >
                      <ShoppingBag className="size-4" />
                      {cart.has(featured.id) ? "Added" : "Add to bag"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rest of products */}
          {rest.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">More products</p>
              <div className="space-y-3">
                {rest.map((p) => (
                  <div key={p.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
                    {/* Thumb */}
                    <div className={cn("size-16 shrink-0 rounded-xl bg-gradient-to-br", p.gradient ?? "from-muted to-muted")} />
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <p className="text-[12px] font-semibold text-foreground leading-snug">{p.name}</p>
                          <p className="text-[11px] text-muted-foreground">{p.subtitle}</p>
                        </div>
                        <button onClick={() => toggleWishlist(p.id)} className="shrink-0 mt-0.5">
                          <Heart className={cn("size-4", wishlist.has(p.id) ? "fill-period text-period" : "text-muted-foreground")} strokeWidth={2} />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="size-3 fill-pms text-pms" strokeWidth={0} />
                        <span className="text-[11px] font-semibold text-foreground">{p.rating}</span>
                        <span className="text-[11px] text-muted-foreground">({p.reviews.toLocaleString()})</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-display text-[15px] font-bold text-foreground">₹{p.price}</span>
                          <span className="text-[11px] text-muted-foreground line-through">₹{p.mrp}</span>
                        </div>
                        <button
                          onClick={() => setCart((c) => { const n = new Set(c); n.add(p.id); return n; })}
                          className={cn(
                            "rounded-full px-3 py-1 text-[11px] font-semibold transition-all",
                            cart.has(p.id)
                              ? "bg-fertile/15 text-fertile"
                              : "bg-period/10 text-period"
                          )}
                        >
                          {cart.has(p.id) ? "Added ✓" : "Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
}

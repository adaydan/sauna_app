"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, ArrowRight, Check, ChevronDown, Flame, Leaf, Menu, Minus, Plus, ShoppingBag, Wind, X } from "lucide-react";
import { motion, MotionConfig, useScroll, useSpring } from "motion/react";
import BlurText from "@/components/react-bits/BlurText";
import SpotlightCard from "@/components/react-bits/SpotlightCard";
import AnimatedContent from "@/components/react-bits/AnimatedContent";
import ProductArt from "@/components/product-art";
import SteamBackground from "@/components/steam-background";

const products = [
  { id: "hat", name: "The Banya Hat", russian: "БАННАЯ ШАПКА", category: "Hats & textiles", detail: "Natural wool felt · Oat", price: 32, label: "A BANYA ESSENTIAL", description: "A classic, generously shaped felt hat with a soft rolled edge. A little tradition to take into every session." },
  { id: "stones", name: "Jadeite Sauna Stones", russian: "КАМНИ ДЛЯ БАНИ", category: "Sauna stones", detail: "Tumbled jadeite · 5 kg", price: 65, label: "TURN UP THE HEAT", description: "Beautiful green jadeite stones for your sauna heater. Check your heater’s stone size and material requirements before use." },
  { id: "venik", name: "Birch Venik", russian: "БЕРЁЗОВЫЙ ВЕНИК", category: "Veniks & botanicals", detail: "Dried birch · Hand-tied", price: 24, label: "THE ORIGINAL RITUAL", description: "A traditional bundle of dried birch branches. Soak before use and let the earthy, leafy scent become part of your banya ritual." },
  { id: "bucket", name: "The Linden Bucket", russian: "БАННЫЙ УШАТ", category: "Banya essentials", detail: "Linden wood · 4 L", price: 58, label: "MADE FOR SLOW MOMENTS", description: "A wooden bucket and long-handled ladle, inspired by the timeless tools of the bathhouse. For that next perfect pour." },
];
const filters = ["All essentials", "Sauna stones", "Hats & textiles", "Veniks & botanicals", "Banya essentials"];
type Cart = Record<string, number>;

export default function Home() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [filter, setFilter] = useState("All essentials");
  const [cart, setCart] = useState<Cart>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState<typeof products[number] | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [steamOn, setSteamOn] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [notice, setNotice] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("zhar-bag") || "{}");
      const valid: Cart = {};
      for (const p of products) if (Number.isInteger(saved[p.id]) && saved[p.id] > 0) valid[p.id] = Math.min(saved[p.id], 99);
      setCart(valid);
    } catch { /* Invalid saved bags start empty. */ }
    setCartLoaded(true);
  }, []);
  useEffect(() => { if (cartLoaded) { try { localStorage.setItem("zhar-bag", JSON.stringify(cart)); } catch { /* Storage can be unavailable in private browsing. */ } } }, [cart, cartLoaded]);
  useEffect(() => {
    if (cartOpen || selected) { dialogRef.current?.showModal(); closeRef.current?.focus(); }
    else dialogRef.current?.close();
  }, [cartOpen, selected]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(""), 3000); return () => clearTimeout(timer); }, [notice]);
  function add(id: string) { setCart(c => ({ ...c, [id]: Math.min((c[id] || 0) + 1, 99) })); setNotice("A little more ritual, added to your bag."); }
  function update(id: string, change: number) { setCart(c => { const next = { ...c, [id]: Math.min(99, (c[id] || 0) + change) }; if (next[id] <= 0) delete next[id]; return next; }); }
  function close() { setCartOpen(false); setSelected(null); }

  return <MotionConfig reducedMotion="user"><motion.div className="scroll-progress" style={{ scaleX: progress }} /><main>
    <div className="announcement"><span>A little tradition. A lot of soul.</span><span>С ЛЁГКИМ ПАРОМ <span className="announcement-dot">✳</span> HERE’S TO GOOD STEAM</span><span>THE BANYA COLLECTION / 01</span></div>
    <header className="header">
      <a href="#" className="wordmark" aria-label="Zhar home">ЖАР<span>ZHAR · BANYA GOODS</span></a>
      <nav className={menuOpen ? "navigation navigation-open" : "navigation"} aria-label="Main navigation"><a href="#shop" onClick={() => setMenuOpen(false)}>The collection <ChevronDown size={12} /></a><a href="#ritual" onClick={() => setMenuOpen(false)}>The banya ritual</a><a href="#story" onClick={() => setMenuOpen(false)}>Our story</a></nav>
      <div className="header-actions"><span className="header-note">WARMTH IS A WAY OF LIFE.</span><button className="bag-button" onClick={() => { setSelected(null); setCartOpen(true); }} aria-label={`Open shopping bag, ${count} items`}><ShoppingBag size={19} strokeWidth={1.5} /><span>Bag ({count})</span></button><button className="mobile-menu icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button></div>
    </header>
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-image room-placeholder" role="img" aria-label="Stylized architectural placeholder for a warm wooden bathhouse"><div className="room-window" /><div className="room-bench bench-back" /><div className="room-bench bench-front" /><span className="placeholder-label">THE BATHHOUSE / IMAGE PLACEHOLDER</span></div>
      <div className="hero-shade" /><SteamBackground active={steamOn} />
      <div className="hero-top"><span><span className="live-dot" /> ROOTED IN RUSSIAN BANYA CULTURE</span><span>ТЕПЛО. ПАР. ДУША.</span></div>
      <div className="hero-content"><p className="eyebrow">GOOD HEAT. BETTER RITUALS.</p><h1 id="hero-heading"><BlurText text="For the heat." delay={100} direction="bottom" trigger="load" /><BlurText text="For the soul." delay={130} direction="bottom" trigger="load" className="second-line" /></h1><p className="hero-description">Thoughtful essentials for the Russian banya.<br />From the first pour to the last quiet moment.</p><a className="button button-red" href="#shop">Find your ritual <ArrowUpRight size={19} /></a></div>
      <div className="hero-seal"><span>С ЛЁГКИМ ПАРОМ</span><Wind size={40} strokeWidth={1} /><span>HERE’S TO GOOD STEAM</span></div>
      <div className="hero-bottom"><a href="#shop"><ArrowDown size={15} /> SLOW DOWN. WARM UP.</a><button onClick={() => setSteamOn(!steamOn)} aria-pressed={steamOn}><span className={steamOn ? "steam-status active" : "steam-status"} />STEAM {steamOn ? "ON" : "OFF"}<span className="toggle"><span /></span></button><span className="hero-caption">THE EVERYDAY, A LITTLE MORE SACRED.</span></div>
    </section>
    <div className="values-strip"><span><Leaf /> Natural materials</span><span className="strip-star">✳</span><span><Wind /> Steeped in tradition</span><span className="strip-star">✳</span><span><Flame /> Made for the ritual</span><span className="strip-star">✳</span><span className="strip-russian">ДЛЯ ТЕЛА И ДУШИ <span>For body & soul</span></span></div>
    <section className="shop section-pad" id="shop" aria-labelledby="shop-heading">
      <AnimatedContent distance={30} duration={0.7}><div className="section-heading"><div><p className="eyebrow red">THE GOOD STUFF / ХОРОШИЕ ВЕЩИ</p><h2 id="shop-heading">Small things. <em>Deep rituals.</em></h2></div><p>Honest materials. Timeless purpose.<br />Everything you need to make it your own.</p></div></AnimatedContent>
      <div className="shop-controls"><div className="filter-tabs" aria-label="Product categories">{filters.map(f => <button key={f} onClick={() => setFilter(f)} className={filter === f ? "filter active" : "filter"} aria-pressed={filter === f}>{f}</button>)}</div><span className="result-count">{filter === "All essentials" ? "04" : "01"} GOOD THINGS</span></div>
      <div className="product-grid">{products.filter(p => filter === "All essentials" || p.category === filter).map(p => <motion.article layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="product" key={p.id}><SpotlightCard className={`product-visual product-${p.id}`} theme="light" spotlightColor="rgba(255, 220, 160, 0.6)" intensity={0.6} borderGlow={0.1}><div className="product-topline"><span>{p.label}</span><span>0{products.indexOf(p) + 1}</span></div><button className="art-button" onClick={() => setSelected(p)} aria-label={`View ${p.name}`}><ProductArt type={p.id} /></button><button className="quick-add" onClick={() => add(p.id)} aria-label={`Add ${p.name} to bag`}><Plus size={19} /></button><span className="product-russian">{p.russian}</span></SpotlightCard><div className="product-info"><button onClick={() => setSelected(p)}>{p.name}</button><span>${p.price}</span></div><p className="product-detail">{p.detail}</p></motion.article>)}</div>
      <p className="shop-footnote"><span>✳</span> Nothing extra. Just the things that make the ritual.</p>
    </section>
    <section className="ritual" id="ritual"><div className="ritual-photo"><SteamBackground active={steamOn} className="ritual-steam" /><div className="ritual-placeholder" role="img" aria-label="Warm abstract placeholder for banya ritual photography"><Wind size={100} strokeWidth={0.5} /><small>THE RITUAL / IMAGE PLACEHOLDER</small></div><span>01 / THE ART OF DOING LESS</span></div><div className="ritual-copy"><p className="eyebrow">MORE THAN A SAUNA</p><h2>Some things<br />can’t be rushed.<br /><em>Пар — одно из них.</em></h2><p>Steam is one of them. The banya is a place to leave the day at the door. Warm wood, the scent of birch, a ladle of water on hot stones. A tradition passed from one generation to the next.</p><p>We’re here for the objects that bring it to life.</p><a className="text-link" href="#story">A little about our roots <ArrowUpRight size={19} /></a><div className="ritual-steps"><span>01 <b>HEAT</b></span><span>02 <b>STEAM</b></span><span>03 <b>REST</b></span><span>04 <b>REPEAT</b></span></div></div></section>
    <section className="story section-pad" id="story"><SteamBackground active={steamOn} className="story-steam" /><p className="eyebrow red">ЖАР MEANS HEAT. THE REST IS A FEELING.</p><AnimatedContent distance={20}><h2>Born from the bathhouse.<br />Made for <em>your kind of ritual.</em></h2></AnimatedContent><p>ZHAR is a small collection inspired by Russian banya culture: practical objects, natural textures, and a slower way to spend your time. Familiar traditions. A fresh perspective.</p><div className="story-mark">Ж</div></section>
    <section className="newsletter"><div><p className="eyebrow">LET’S KEEP THE FIRE GOING</p><h2>A little warmth in your inbox.</h2><p>New collections, banya notes, and reasons to slow down.</p></div><form onSubmit={e => { e.preventDefault(); if (email.trim()) setSubscribed(true); }}><label htmlFor="newsletter-email" className="sr-only">Email address</label><div className="email-field"><input id="newsletter-email" type="email" placeholder="Your email address" required value={email} onChange={e => { setEmail(e.target.value); setSubscribed(false); }} disabled={subscribed} /><button aria-label="Subscribe to banya notes" type="submit" disabled={subscribed}>{subscribed ? <Check /> : <ArrowUpRight />}</button></div><p role="status">{subscribed ? "You’re on the list for this preview. No email has been sent." : "Only the good stuff. This local preview doesn’t send emails."}</p></form></section>
    <footer><a className="footer-logo" href="#" aria-label="Zhar home">ЖАР<span>BANYA GOODS FOR BODY & SOUL.</span></a><div><span>© 2026 ZHAR</span><span>С ЛЁГКИМ ПАРОМ.</span><span>LOCAL CONCEPT STORE · USD</span></div></footer>
    <div className={`toast ${notice ? "toast-visible" : ""}`} role="status"><Check size={17} />{notice}</div>
    <dialog ref={dialogRef} className={cartOpen ? "shop-dialog cart-dialog" : "shop-dialog detail-dialog"} aria-label={cartOpen ? "Your shopping bag" : selected?.name || "Product details"} onCancel={close} onClick={e => { if (e.target === dialogRef.current) close(); }}><div className="dialog-inner"><button ref={closeRef} className="dialog-close icon-button" onClick={close} aria-label="Close dialog"><X /></button>{cartOpen ? <><p className="eyebrow red">GOOD THINGS, GATHERED</p><h2>Your ritual bag <span>({count})</span></h2>{count ? <><div className="cart-items">{products.filter(p => cart[p.id]).map(p => <div className="cart-item" key={p.id}><div className="cart-art"><ProductArt type={p.id} /></div><div><h3>{p.name}</h3><p>{p.detail}</p><div className="quantity"><button onClick={() => update(p.id, -1)} aria-label={`Remove one ${p.name}`}><Minus size={13} /></button><span>{cart[p.id]}</span><button onClick={() => update(p.id, 1)} aria-label={`Add one ${p.name}`}><Plus size={13} /></button></div></div><strong>${p.price * cart[p.id]}</strong></div>)}</div><div className="subtotal"><span>Subtotal</span><strong>${subtotal}</strong></div><p className="cart-preview-note">You’re exploring a local concept store. Your bag is saved on this device; payment and shipping aren’t connected.</p><button className="button button-red" onClick={close}>Keep exploring <ArrowRight size={18} /></button></> : <div className="empty-cart"><ShoppingBag size={45} strokeWidth={1} /><h3>A good ritual starts somewhere.</h3><p>Find a few essentials to make it yours.</p><button className="button button-red" onClick={() => { close(); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>Explore the collection <ArrowUpRight size={18} /></button></div>}</> : selected && <><div className={`detail-art product-${selected.id}`}><ProductArt type={selected.id} /></div><p className="eyebrow red">{selected.russian}</p><h2>{selected.name}</h2><p className="detail-material">{selected.detail}</p><p className="detail-description">{selected.description}</p><div className="detail-buy"><strong>${selected.price}</strong><button className="button button-red" onClick={() => add(selected.id)}>Add to your ritual <Plus size={18} /></button></div><p className="detail-note">Illustrated product · Concept collection</p></>}</div></dialog>
  </main></MotionConfig>;
}

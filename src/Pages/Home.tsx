import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MenuItem {
 id: number;
 name: string;
 emoji: string;
 category: string;
 desc: string;
 tag: string | null;
 tagColor: string;
}

interface CartItem extends MenuItem {
 qty: number;
}

type Cart = Record<number, CartItem>;

interface OrderFormState {
 name: string;
 phone: string;
 location: string;
 order: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MENU_ITEMS: MenuItem[] = [
 {
  id: 1, name: "Chicken Sharwama", emoji: "🌯", category: "Sharwama",
  desc: "Grilled chicken, fresh veggies, sauces wrapped in a soft flatbread. Our signature.",
  tag: "Best Seller", tagColor: "#C0392B",
 },
 {
  id: 2, name: "Beef Sharwama", emoji: "🫔", category: "Sharwama",
  desc: "Seasoned beef strips with crisp cabbage and our house special sauce in a warm wrap.",
  tag: "Popular", tagColor: "#B7950B",
 },
 {
  id: 3, name: "Mixed Sharwama", emoji: "🌮", category: "Sharwama",
  desc: "The best of both — chicken and beef together. For those who can't choose.",
  tag: null, tagColor: "",
 },
 {
  id: 4, name: "Barbeque Chicken", emoji: "🍗", category: "Barbeque",
  desc: "Smoky, charcoal-grilled chicken seasoned to perfection. Served hot off the grill.",
  tag: "Smoky", tagColor: "#784212",
 },
 {
  id: 5, name: "Barbeque Fish", emoji: "🐟", category: "Barbeque",
  desc: "Fresh grilled fish with our signature spice blend. Rich flavour, tender flesh.",
  tag: null, tagColor: "",
 },
 {
  id: 6, name: "Asun", emoji: "🥩", category: "Asun",
  desc: "Spicy peppered goat meat — a classic Nigerian BBQ snack. Hot, smoky and addictive.",
  tag: "Spicy 🌶️", tagColor: "#C0392B",
 },
 {
  id: 7, name: "Fries & Chicken", emoji: "🍟", category: "Fries",
  desc: "Crispy golden fries paired with seasoned fried chicken. Comfort food at its best.",
  tag: null, tagColor: "",
 },
 {
  id: 8, name: "Noodles & Egg", emoji: "🍜", category: "Noodles",
  desc: "Seasoned stir-fried noodles topped with a perfectly fried egg. Quick and satisfying.",
  tag: "Light Meal", tagColor: "#117A65",
 },
 {
  id: 9, name: "Noodles & Chicken", emoji: "🍝", category: "Noodles",
  desc: "Hearty noodles combined with our flavourful grilled chicken pieces.",
  tag: null, tagColor: "",
 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): string {
 const r = parseInt(hex.slice(1, 3), 16);
 const g = parseInt(hex.slice(3, 5), 16);
 const b = parseInt(hex.slice(5, 7), 16);
 return `${r},${g},${b}`;
}

function buildWhatsAppUrl(message: string): string {
 return `https://wa.me/2347081992566?text=${encodeURIComponent(message)}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Navbar({ cartCount, onCartOpen }: { cartCount: number; onCartOpen: () => void }) {
 const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
 };

 return (
  <nav
   className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
   style={{
    background: "rgba(15,15,15,0.92)",
    backdropFilter: "blur(16px)",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
   }}
  >
   <div className="flex items-center gap-3">
    <div
     className="w-8 h-8 rounded-full flex items-center justify-center"
     style={{ background: "#C0392B" }}
    >
     <span className="p-1" style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 12, color: "#fff", borderRadius: '7px', background: 'linear-gradient(135deg, #96281B, goldenrod, #96281B)' }}>DT</span>
    </div>
    <span style={{ fontFamily: "'Bebas Neue',cursive", color: 'white', fontSize: 22, letterSpacing: "0.05em" }}>
     DAMSAM <span style={{ color: "#F5C518" }}>TREATS</span>
    </span>
   </div>

   <div className="hidden md:flex items-center gap-10">
    {["menu", "about", "contact"].map((id) => (
     <button
      key={id}
      onClick={() => scrollTo(id)}
      className="nav-link text-gray-300 capitalize"
     >
      {id}
     </button>
    ))}
   </div>

   <button
    onClick={onCartOpen}
    className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
    style={{
     background: "rgba(245,197,24,0.1)",
     border: "1px solid rgba(245,197,24,0.3)",
     color: "#F5C518",
     fontFamily: "'Syne',sans-serif",
    }}
   >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
     <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
     <line x1="3" y1="6" x2="21" y2="6" />
     <path d="M16 10a4 4 0 01-8 0" />
    </svg>
    Cart
    {cartCount > 0 && (
     <span
      className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
      style={{ background: "#C0392B", color: "#fff" }}
     >
      {cartCount}
     </span>
    )}
   </button>
  </nav>
 );
}

// ─────────────────────────────────────────────────────────────────────────────

function HeroSection() {
 const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
 };

 return (
  <section
   className="hero-bg min-h-screen flex flex-col justify-center pt-20 px-6 md:px-16 lg:px-24"
   style={{ animation: "fadeUp 0.8s ease both" }}
  >
   <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
    <div>
     <div className="section-label mb-4 font-fraunces italic">📍 Ibadan, Nigeria</div>
     <h1
      className="hero-title text-white mb-2 font-semibold pacifico"
      style={{ fontSize: "clamp(72px, 12vw, 15px)" }}
     >
      DAMSAM
     </h1>
     <h1
      className="hero-title mb-6 font-semibold pacifico"
      style={{ fontSize: "clamp(72px, 12vw, 15px)", color: "#F5C518" }}
     >
      TREATS
     </h1>
     <div style={{ borderTop: '3px solid red' }} className="w-34 mb-2"></div>
     <div style={{ borderTop: '2px solid gold' }} className="w-26 mb-8"></div>
     <p
      className="text-xl mb-2"
      style={{ fontFamily: "'Syne',sans-serif", color: "#ccc", fontWeight: 600, fontStyle: "italic" }}
     >
      Cravings Meet Satisfaction
     </p>
     <p className="text-gray-400 mb-10 max-w-md leading-relaxed font-fraunces italic">
      Sharwama, BBQ, Asun, Fries & more — made fresh and served hot, any time of day or night.
     </p>
     <div className="flex flex-wrap gap-4 items-center">
      <button
       onClick={() => scrollTo("menu")}
       className="order-btn px-8 py-4 rounded-full text-white text-sm tracking-wider uppercase"
      >
       Order Now
      </button>
      <div
       className="badge-24 rounded-full w-20 h-20 flex flex-col items-center justify-center text-center bg-[#f5c51829]"
       style={{ border: "2px solid #F5C518" }}
      >
       <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 20, color: "#F5C518", lineHeight: 1 }}>
        24
       </span>
       <span style={{ fontSize: 7, fontWeight: 500, letterSpacing: "0.1em", color: "#ccc" }}>
        HRS <p>SERVICE</p>
       </span>
      </div>
     </div>
    </div>

    <div className="relative hidden md:flex justify-center items-center">
     <div
      className="absolute w-80 h-80 rounded-full"
      style={{ background: "radial-gradient(circle, rgba(192,57,43,0.15) 0%, transparent 70%)" }}
     />
     <div
      className="absolute w-60 h-60 rounded-full border"
      style={{ borderColor: "rgba(245,197,24,0.1)" }}
     />
     <div className="relative z-10 grid grid-cols-2 gap-4 p-8">
      {[
       { emoji: "🌯", label: "SHARWAMA" },
       { emoji: "🍖", label: "BARBEQUE" },
       { emoji: "🥩", label: "ASUN" },
       { emoji: "🍟", label: "FRIES & CHICK" },
      ].map(({ emoji, label }) => (
       <div key={label} className="menu-card rounded-2xl py-6 px-3 flex flex-col items-center gap-2">
        <span style={{ fontSize: 50 }}>{emoji}</span>
        <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 18, color: "#F5C518" }}>
         {label}
        </span>
       </div>
      ))}
     </div>
    </div>
   </div>
  </section>
 );
}

// ─────────────────────────────────────────────────────────────────────────────

interface MenuCardProps {
 item: MenuItem;
 onAdd: (id: number, qty: number) => void;
}

function MenuCard({ item, onAdd }: MenuCardProps) {
 const [qty, setQty] = useState<number>(0);

 const changeQty = (delta: number) => {
  setQty((prev) => Math.max(0, prev + delta));
 };

 const handleAdd = () => {
  const amount = qty > 0 ? qty : 1;
  onAdd(item.id, amount);
  setQty(0);
 };

 return (
  <div className="menu-card rounded-2xl p-6 flex flex-col gap-4 border border-[#f5c51842] transition-all duration-300 hover:-translate-y-2 hover:border-[#f5c518a6]">
   <div className="flex items-start justify-between">
    <span style={{ fontSize: 44, lineHeight: 1 }}>{item.emoji}</span>
    {item.tag ? (
     <span
      className="tag-pill py-1 px-3"
      style={{
       background: `rgba(${hexToRgb(item.tagColor)},0.15)`,
       color: item.tagColor,
       border: `1px solid rgba(${hexToRgb(item.tagColor)},0.3)`,
       borderRadius: '15px'
      }}
     >
      {item.tag}
     </span>
    ) : (
     <span />
    )}
   </div>

   <div>
    <div
     className="text-xs font-semibold tracking-widest uppercase mb-1"
     style={{ color: "rgba(245,197,24,0.5)", fontFamily: "'Syne',sans-serif" }}
    >
     {item.category}
    </div>
    <h3 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 26, color: "#fff", lineHeight: 1 }}>
     {item.name}
    </h3>
    <p className="text-gray-400 text-sm mt-2 leading-relaxed">{item.desc}</p>
   </div>

   <div
    className="flex items-center justify-between mt-auto pt-2 border-t"
    style={{ borderColor: "rgba(255,255,255,0.07)" }}
   >
    <div className="flex items-center gap-3">
     <button className="qty-btn" onClick={() => changeQty(-1)}>−</button>
     <span
      style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 22, color: "#fff", minWidth: 20, textAlign: "center" }}
     >
      {qty}
     </span>
     <button className="qty-btn" onClick={() => changeQty(1)}>+</button>
    </div>
    <button
     onClick={handleAdd}
     className="order-btn px-5 py-2 rounded-full text-white text-xs tracking-wider uppercase"
    >
     Add
    </button>
   </div>
  </div>
 );
}

// ────────────────────────────────────────MENU SECTION─────────────────────────────────────

function MenuSection({ onAdd }: { onAdd: (id: number, qty: number) => void }) {
 return (
  <section id="menu" className="py-24 px-6 md:px-16" style={{ background: "#111" }}>
   <div className="max-w-6xl mx-auto">
    <div className="section-label mb-3 text-center">What We Serve</div>
    <h2
     className="text-center mb-2"
     style={{ fontSize: "clamp(48px, 8vw, 80px)", color: "#fff" }}
    >
     OUR <span style={{ color: "#F5C518" }}>MENU</span>
    </h2>
    <p className="text-center text-gray-400 mb-14 max-w-lg mx-auto">
     Everything prepared fresh, loaded with flavour. Pick your favourites and we'll sort you out.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
     {MENU_ITEMS.map((item) => (
      <MenuCard key={item.id} item={item} onAdd={onAdd} />
     ))}
    </div>
   </div>
  </section>
 );
}

// ─────────────────────────────────────────────ABOUT SECTION────────────────────────────────

function AboutSection() {
 const locations = [
  { label: "LOCATION 1", address: "Opposite Blessed Baptist Church, Lakoto Area, Ajibode, Ibadan" },
  { label: "LOCATION 2", address: "Onigbodogi Junction, Apete, Ibadan" },
  { label: "CALL / WHATSAPP", address: "07081992566  |  08068955641" },
 ];

 const icons = ["📍", "📍", "📞"];

 return (
  <section id="about" className="py-24 px-6 md:px-16 hero-bg">
   <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
    <div>
     <div className="section-label mb-3">Who We Are</div>
     <h2 style={{ fontSize: "clamp(48px,6vw,72px)", color: "#fff", lineHeight: 0.95 }}>
      ABOUT <span style={{ color: "#F5C518" }}>DAMSAM</span>
     </h2>
     <div style={{ borderTop: '4px solid red' }} className=" w-36 my-4" />
     <p className="text-gray-300 leading-relaxed mb-6">
      We are a passionate mini eatery in Ibadan dedicated to one thing: making your cravings a
      reality. From sizzling sharwama to smoky asun, every item is prepared with care and quality
      ingredients.
     </p>
     <p className="text-gray-400 leading-relaxed mb-8">
      Open <strong style={{ color: "#F5C518" }}>24 hours</strong>, 7 days a week — because hunger
      doesn't keep a schedule. Whether it's a midnight craving or a weekend feast, Damsam Treats
      has you covered.
     </p>
     <div className="flex gap-6">
      {[
       { value: "24/7", label: "Open Always" },
       { value: "5+", label: "Menu Items" },
       { value: "2", label: "Locations" },
      ].map(({ value, label }, i) => (
       <div key={label} className="flex gap-6 items-center">
        {i > 0 && <div className="w-px bg-gray-700 self-stretch" />}
        <div className="text-center">
         <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 48, color: "#F5C518" }}>
          {value}
         </div>
         <div className="text-xs text-gray-400 uppercase tracking-widest">{label}</div>
        </div>
       </div>
      ))}
     </div>
    </div>

    <div className="space-y-4">
     {locations.map((loc, i) => (
      <div key={loc.label} className="menu-card rounded-2xl p-6 flex items-start gap-4">
       <span style={{ fontSize: 28 }}>{icons[i]}</span>
       <div>
        <div
         style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#F5C518", fontSize: 14, marginBottom: 4 }}
        >
         {loc.label}
        </div>
        <p className="text-gray-300 text-sm">{loc.address}</p>
       </div>
      </div>
     ))}
    </div>
   </div>
  </section>
 );
}

// ─────────────────────────────────────────────────────────────────────────────

function ContactSection({ onToast }: { onToast: (msg: string) => void }) {
 const [form, setForm] = useState<OrderFormState>({
  name: "", phone: "", location: "", order: "",
 });

 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
 ) => {
  setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
 };

 const handleSubmit = () => {
  if (!form.name || !form.phone || !form.order) {
   onToast("⚠️ Please fill all fields!");
   return;
  }
  const msg = `Hi Damsam Treats! 👋\n\nName: ${form.name}\nPhone: ${form.phone}\nPickup/Location: ${form.location || "Not specified"}\n\nOrder:\n${form.order}\n\nKindly confirm. Thank you!`;
  window.open(buildWhatsAppUrl(msg), "_blank");
 };

 return (
  <section id="contact" className="py-24 px-6 md:px-16" style={{ background: "#111" }}>
   <div className="max-w-xl mx-auto">
    <div className="section-label mb-3 text-center">Get In Touch</div>
    <h2
     className="text-center mb-10"
     style={{ fontSize: "clamp(40px,6vw,68px)", color: "#fff" }}
    >
     PLACE YOUR <span style={{ color: "#F5C518" }}>ORDER</span>
    </h2>

    <div className="menu-card rounded-3xl p-8">
     <div className="space-y-5">
      {[
       { label: "Your Name", name: "name", type: "text", placeholder: "e.g. Amina Bello" },
       { label: "Phone Number", name: "phone", type: "tel", placeholder: "080XXXXXXXX" },
      ].map((field) => (
       <div key={field.name}>
        <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
         {field.label}
        </label>
        <input
         name={field.name}
         type={field.type}
         placeholder={field.placeholder}
         value={form[field.name as keyof OrderFormState]}
         onChange={handleChange}
         className="w-full rounded-xl px-4 py-3 text-sm"
        />
       </div>
      ))}

      <div>
       <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
        Preferred Location
       </label>
       <select
        name="location"
        value={form.location}
        onChange={handleChange}
        className="w-full rounded-xl px-4 py-3 text-sm"
       >
        <option value="">-- Select Location --</option>
        <option>Ajibode (Lakoto Area)</option>
        <option>Apete (Onigbodogi Junction)</option>
        <option>Delivery (call to confirm)</option>
       </select>
      </div>

      <div>
       <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
        Your Order
       </label>
       <textarea
        name="order"
        rows={4}
        placeholder="e.g. 2x Chicken Sharwama, 1x Asun, 1x Noodles & Egg..."
        value={form.order}
        onChange={handleChange}
        className="w-full rounded-xl px-4 py-3 text-sm resize-none"
       />
      </div>

      <button
       onClick={handleSubmit}
       className="order-btn w-full py-4 rounded-xl text-white tracking-wider uppercase text-sm"
      >
       Send Order via WhatsApp
      </button>
      <p className="text-center text-gray-500 text-xs mt-2">
       Your order will open WhatsApp — we'll confirm & prepare!
      </p>
     </div>
    </div>
   </div>
  </section>
 );
}

// ─────────────────────────────────────────────────────────────────────────────

interface CartSidebarProps {
 cart: Cart;
 isOpen: boolean;
 onClose: () => void;
 onQtyChange: (id: number, delta: number) => void;
 onClear: () => void;
 onCheckout: () => void;
}

function CartSidebar({ cart, isOpen, onClose, onQtyChange, onClear, onCheckout }: CartSidebarProps) {
 const entries = Object.values(cart).filter((i) => i.qty > 0);
 const totalItems = entries.reduce((s, i) => s + i.qty, 0);

 return (
  <>
   {/* Overlay */}
   <div
    onClick={onClose}
    className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    style={{ background: "rgba(0,0,0,0.7)" }}
   />

   {/* Sidebar */}
   <div
    className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    style={{ background: "#141414", borderLeft: "1px solid rgba(255,255,255,0.08)" }}
   >
    <div
     className="flex items-center justify-between p-6 border-b"
     style={{ borderColor: "rgba(255,255,255,0.07)" }}
    >
     <h3 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 28 }}>YOUR CART</h3>
     <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
       <line x1="18" y1="6" x2="6" y2="18" />
       <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
     </button>
    </div>

    <div className="flex-1 overflow-y-auto p-6 space-y-4">
     {entries.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
       <span style={{ fontSize: 48, opacity: 0.3 }}>🛒</span>
       <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 14 }}>Your cart is empty</p>
       <button
        onClick={onClose}
        className="text-xs"
        style={{ color: "#F5C518" }}
       >
        Browse Menu →
       </button>
      </div>
     ) : (
      entries.map((item) => (
       <div
        key={item.id}
        className="flex items-center gap-4 p-4 rounded-xl"
        style={{ background: "#1f1f1f", animation: "slideIn 0.3s ease" }}
       >
        <span style={{ fontSize: 28 }}>{item.emoji}</span>
        <div className="flex-1">
         <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: "#fff" }}>
          {item.name}
         </div>
         <div className="text-gray-500 text-xs">{item.category}</div>
        </div>
        <div className="flex items-center gap-2">
         <button
          className="qty-btn"
          onClick={() => onQtyChange(item.id, -1)}
          style={{ width: 26, height: 26, fontSize: 14 }}
         >
          −
         </button>
         <span
          style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 18, color: "#F5C518", minWidth: 16, textAlign: "center" }}
         >
          {item.qty}
         </span>
         <button
          className="qty-btn"
          onClick={() => onQtyChange(item.id, 1)}
          style={{ width: 26, height: 26, fontSize: 14 }}
         >
          +
         </button>
        </div>
       </div>
      ))
     )}
    </div>

    <div className="p-6 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
     <div className="flex justify-between mb-4">
      <span className="text-gray-400" style={{ fontFamily: "'Syne',sans-serif", fontSize: 13 }}>
       TOTAL ITEMS
      </span>
      <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 22, color: "#F5C518" }}>
       {totalItems} item{totalItems !== 1 ? "s" : ""}
      </span>
     </div>
     <button
      onClick={onCheckout}
      className="order-btn w-full py-4 rounded-xl text-white tracking-wider uppercase text-sm mb-3"
     >
      Order via WhatsApp 💬
     </button>
     <button
      onClick={onClear}
      className="w-full py-3 rounded-xl text-gray-400 text-sm"
      style={{ border: "1px solid rgba(255,255,255,0.1)" }}
     >
      Clear Cart
     </button>
    </div>
   </div>
  </>
 );
}

// ─────────────────────────────────────────────────────────────────────────────

function Toast({ message }: { message: string | null }) {
 return (
  <div
   className={`fixed z-50 px-4 py-3 rounded-xl text-sm text-white font-semibold transition-all duration-300 ${message ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}`}
   style={{
    bottom: 90,
    right: 28,
    background: "#1a1a1a",
    border: "1px solid rgba(245,197,24,0.4)",
    fontFamily: "'Syne',sans-serif",
   }}
  >
   {message}
  </div>
 );
}

// ─────────────────────────────────────────────────────────────────────────────

function Footer() {
 return (
  <footer
   className="py-12 px-6 text-center border-t"
   style={{ borderColor: "rgba(255,255,255,0.06)", background: "#0f0f0f" }}
  >
   <div className="text-white" style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 32, letterSpacing: "0.1em" }}>
    DAMSAM <span style={{ color: "#F5C518" }}>TREATS</span>
   </div>
   <p className="text-gray-500 text-sm mt-2 mb-6" style={{ fontStyle: "italic" }}>
    Cravings Meet Satisfaction
   </p>
   <div className="flex justify-center gap-6 mb-6">
    <a href="https://wa.me/2347081992566" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
     WhatsApp
    </a>
    <a href="mailto:damsamtreats4@gmail.com" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
     Email
    </a>
    <a href="https://tiktok.com/@damsam.treats" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">
     TikTok
    </a>
   </div>
   <p className="text-gray-600 text-xs">© 2025 Damsam Treats. All rights reserved. Open 24 hours, every day.</p>
  </footer>
 );
}


// ─── Root App Component ───────────────────────────────────────────────────────

export default function App() {
 const [cart, setCart] = useState<Cart>({});
 const [cartOpen, setCartOpen] = useState(false);
 const [toast, setToast] = useState<string | null>(null);
 const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

 // Inject global styles once
 useEffect(() => {
  const style = document.createElement("style");
  // style.textContent = GLOBAL_CSS;
  document.head.appendChild(style);
  return () => { document.head.removeChild(style); };
 }, []);

 const showToast = useCallback((msg: string) => {
  setToast(msg);
  if (toastTimer.current) clearTimeout(toastTimer.current);
  toastTimer.current = setTimeout(() => setToast(null), 2500);
 }, []);

 const handleAdd = useCallback((id: number, qty: number) => {
  const item = MENU_ITEMS.find((m) => m.id === id);
  if (!item) return;
  setCart((prev) => {
   const existing = prev[id];
   return {
    ...prev,
    [id]: { ...item, qty: (existing?.qty ?? 0) + qty },
   };
  });
  showToast(`${item.emoji} ${item.name} added!`);
 }, [showToast]);

 const handleQtyChange = useCallback((id: number, delta: number) => {
  setCart((prev) => {
   const updated = { ...prev };
   if (!updated[id]) return prev;
   updated[id] = { ...updated[id], qty: updated[id].qty + delta };
   if (updated[id].qty <= 0) delete updated[id];
   return updated;
  });
 }, []);

 const handleClear = useCallback(() => setCart({}), []);

 const handleCheckout = useCallback(() => {
  const entries = Object.values(cart).filter((i) => i.qty > 0);
  if (entries.length === 0) { showToast("🛒 Cart is empty!"); return; }
  const lines = entries.map((i) => `• ${i.qty}x ${i.name}`).join("\n");
  const msg = `Hi Damsam Treats! 👋\n\nI'd like to order:\n${lines}\n\nPlease confirm availability and details. Thank you!`;
  window.open(buildWhatsAppUrl(msg), "_blank");
 }, [cart, showToast]);

 const cartCount = Object.values(cart).reduce((s, i) => s + i.qty, 0);

 return (
  <>
   <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
   <HeroSection />
   <MenuSection onAdd={handleAdd} />
   <AboutSection />
   <ContactSection onToast={showToast} />
   <Footer />

   <CartSidebar
    cart={cart}
    isOpen={cartOpen}
    onClose={() => setCartOpen(false)}
    onQtyChange={handleQtyChange}
    onClear={handleClear}
    onCheckout={handleCheckout}
   />

   {/* WhatsApp Float */}
   <a
    href="https://wa.me/2347081992566"
    target="_blank"
    rel="noreferrer"
    className="fixed z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
    style={{ bottom: 28, right: 28, background: "#25D366", animation: "glowPulse 3s infinite" }}
   >
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
   </a>

   <Toast message={toast} />
  </>
 );
}

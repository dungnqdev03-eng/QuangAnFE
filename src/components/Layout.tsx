import { Link, Outlet, ScrollRestoration, useLocation, useNavigate } from "react-router-dom";
import { cartActions, useCart } from "../state";
import { useEffect, useState } from "react";

import Footer from "./Footer";
import config from "../../app-config.json";
import FloatingContact from "./FloatingContact";


const OPEN_HOURS = "Mở cửa từ 8:00 đến 21:00";


// to = "#" nghĩa là chưa có trang, bạn đổi khi làm xong trang đó
const NAV = [
  { label: "Trang chủ", to: "/" },
  { label: "Giới thiệu", to: "/about" },
  { label: "Sản phẩm", to: "/catalog" },
  { label: "Dịch vụ", to: "/catalog?category=4" },
  { label: "Dự án", to: "#" },
  { label: "Tin tức", to: "#" },
  { label: "Liên hệ", to: "/contact" },
];

export default function Layout() {
  const cart = useCart();
  const nav = useNavigate();
  const loc = useLocation();
  // Rời khỏi trang Thanh toán thì xóa giỏ
useEffect(() => {
  if (loc.pathname !== "/cart") cartActions.clear();
}, [loc.pathname]);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (<>
<ScrollRestoration />   <div className="tbar">
  <div className="container tbar-in">
    <nav className="tbar-links">
      <Link to="/">Trang chủ</Link>
      <a href="/about">Giới thiệu</a>
      <a href="/contact">Hướng dẫn mua hàng</a>
      <Link to="/contact">Hướng dẫn đường đi</Link>
    </nav>

    <div className="tbar-info">
      <a href={`mailto:${config.email}`}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
        {config.email}
      </a>
      <span className="tbar-hours">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
        {OPEN_HOURS}
      </span>
      <a href={`tel:${config.phone.replace(/\s/g, "")}`}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
        {config.phone}
      </a>
    </div>
  </div>
</div>

<header className="header"></header>
    <header className="header">
      <div className="container hbar">
        <Link to="/" className="logo">
          <b>QUANG AN</b>
          <small>TRỤ ĐÈN & CƠ KHÍ</small>
        </Link>

        <nav className="hmenu">
          {NAV.map((n) => {
            const active = n.to !== "#" && loc.pathname + loc.search === n.to;
            return n.to === "#"
              ? <a key={n.label} href="#">{n.label}</a>
              : <Link key={n.label} to={n.to} className={active ? "active" : ""}>{n.label}</Link>;
          })}
        </nav>

        <div className="hright">
          <form className="hsearch" onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) nav(`/search?q=${encodeURIComponent(q)}`);
            setOpen(false);
          }}>
            {open && <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm kiếm..." />}
            <button type={open ? "submit" : "button"} className="icon-btn" aria-label="Tìm kiếm" onClick={() => !open && setOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0b2545" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="10" cy="10" r="7" /><line x1="15" y1="15" x2="21" y2="21" />
              </svg>
            </button>
          </form>

          <a href={`tel:${config.phone.replace(/\s/g, "/contact")}`} className="btn pill">Liên hệ ngay</a>
        </div>
      </div>
    </header>

    {/* Trang chủ tự quản lý bố cục full-width, các trang khác nằm trong container */}
    <main className={loc.pathname === "/" ? "" : "container"}><Outlet /></main>
    <Footer />
    <FloatingContact />
  </>);
}
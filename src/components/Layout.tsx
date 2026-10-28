import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../state";
import Footer from "./Footer";
import config from "../../app-config.json";

// to = "#" nghĩa là chưa có trang, bạn đổi khi làm xong trang đó
const NAV = [
  { label: "Trang chủ", to: "/" },
  { label: "Giới thiệu", to: "#" },
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
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (<>
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
          <Link to="/cart" className="icon-btn cart-btn" aria-label="Báo giá">
            🛒{count > 0 && <span className="badge">{count}</span>}
          </Link>
          <a href={`tel:${config.phone.replace(/\s/g, "")}`} className="btn pill">📞 Liên hệ ngay</a>
        </div>
      </div>
    </header>

    {/* Trang chủ tự quản lý bố cục full-width, các trang khác nằm trong container */}
    <main className={loc.pathname === "/" ? "" : "container"}><Outlet /></main>
    <Footer />
  </>);
}
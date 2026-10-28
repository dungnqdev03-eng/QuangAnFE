import { Link } from "react-router-dom";
import { getCategories } from "../api/category";
import { useAsync } from "../hooks";
import config from "../../app-config.json";

export default function Footer() {
  const cats = useAsync(getCategories, []);
  const c = config.company;
  return (
    <footer className="footer">
      <div className="container fgrid">
        {/* Cột 1: bản đồ + danh mục */}
        <div>
          <h3 className="fh">{c.name}</h3>
          <iframe className="fmap" loading="lazy" title="Bản đồ"
            src={`https://www.google.com/maps?q=${encodeURIComponent(config.mapQuery)}&output=embed`} />
          <h3 className="fh">DANH MỤC SẢN PHẨM</h3>
          <ul className="flist arrow">
            {cats.data?.map((x) => (
              <li key={x.id}><Link to={`/catalog?category=${x.id}`}>{x.name.toUpperCase()}</Link></li>
            ))}
          </ul>
        </div>

        {/* Cột 2: hệ thống công ty */}
        <div>
          <h3 className="fh">HỆ THỐNG CÔNG TY</h3>
          {config.branches.map((b) => (
            <div key={b.title} className="branch">
              <h4>{b.title}</h4>
              <p>📍 {b.address}</p>
              <p>📞 {b.phone}</p>
            </div>
          ))}
        </div>

        {/* Cột 3: hướng dẫn, mạng xã hội, thông tin công ty */}
        <div>
          <h3 className="fh">HƯỚNG DẪN MUA HÀNG</h3>
          <ul className="flist diamond small">
            {config.guides.map((g) => <li key={g.label}><a href={g.url}>{g.label}</a></li>)}
          </ul>
          <h3 className="fsub">Mạng xã hội</h3>
          <div className="socials">
            {config.socials.map((s) => (
              <a key={s.label} href={s.url} style={{ background: s.color }} target="_blank" rel="noreferrer">{s.label}</a>
            ))}
          </div>
          <h3 className="fh">{c.name}</h3>
          <ul className="flist diamond small">
            <li>MST: {c.taxCode}</li>
            <li>Địa chỉ: {c.address}</li>
            <li>Hotline: {c.hotline}</li>
            <li>Email: {c.email}</li>
          </ul>
        </div>
      </div>
      <div className="fcopy">© {new Date().getFullYear()} {c.name}. All rights reserved.</div>
    </footer>
  );
}
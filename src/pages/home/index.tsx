import { Link } from "react-router-dom";
import { getCategories } from "../../api/category";
import { getProducts } from "../../api/product";
import { useAsync } from "../../hooks";
import ProductCard from "../../components/ProductCard";
import { Loading } from "../../components/State";
import config from "../../../app-config.json";
import { categoryImage } from "../../utils/categoryImages";
import { mockCatImage } from "../../utils/mockImage";
import FeatureStrip from "../../components/FeatureStrip";
import ImageStrip from "../../components/ImageStrip";

// Ảnh tạm. Thay bằng ảnh thật: bỏ file vào src/static/ rồi import vào đây
// Biểu tượng SVG vẽ lại theo ảnh mẫu (nét trắng, nằm trong vòng tròn cam)
const P = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "#fff", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const ICONS = {
  // Huy chương
  award: <svg {...P}><circle cx="12" cy="9" r="5.5" /><circle cx="12" cy="9" r="2" /><path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5" /></svg>,
  // Cờ lê + tua vít
  tools: <svg {...P}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" /><path d="M4 4l3 3M7 7l9 9M16 16l4 4" /></svg>,
  // Xe tải
  truck: <svg {...P}><rect x="2" y="6" width="12" height="10" rx="1" /><path d="M14 9.5h4l3 3.5v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>,
  // Vương miện
  crown: <svg {...P}><path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z" /></svg>,
  // Tai nghe hỗ trợ (tôi tự vẽ thêm, không có trong ảnh)
  support: <svg {...P}><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /></svg>,
};

const FEATS = [
  { icon: ICONS.award, t: "Cam kết chất lượng", d: "ISO 9001:2015" },
  { icon: ICONS.tools, t: "Kinh nghiệm", d: "Hơn 5 năm trong ngành" },
  { icon: ICONS.support, t: "Hỗ trợ nhanh", d: "24/7 mọi lúc mọi nơi" },
];
const STATS = [["5+", "Năm kinh nghiệm"], ["500+", "Công trình"], ["100%", "Khách hàng hài lòng"]];

export default function Home() {
  const cats = useAsync(getCategories, []);
  const prods = useAsync(() => getProducts(), []);

  return (<>
    {/* ===== BANNER ===== */}
    <section className="hero2">
      <div className="container hero2-in">
        <div className="hero2-text">
          <p className="eyebrow">{config.company.name}</p>
          <h1>GIẢI PHÁP TRỤ ĐÈN & CƠ KHÍ<br />CHO CÔNG TRÌNH BỀN VỮNG</h1>
          <p className="lead">Chúng tôi cung cấp trụ đèn, cột đèn và gia công cơ khí chất lượng cao,
            giúp công trình tối ưu hiệu suất, tiết kiệm chi phí và vận hành lâu dài.</p>
          <div className="hero2-btns">
            <Link to="/cart" className="btn pill big">Xem báo giá →</Link>
            <Link to="/contact" className="btn-outline">Liên hệ tư vấn</Link>
          </div>
          <div className="feats">
            {FEATS.map((f) => (
              <div key={f.t} className="feat"><span>{f.icon}</span>
                <div><b>{f.t}</b><small>{f.d}</small></div></div>
            ))}
          </div>
        </div>
<div className="hero2-img">
  <img
    src="https://res.cloudinary.com/odufc811/image/upload/v1793433631/42c30e6e-6f76-4798-8411-a20ce4f98d68.jpg"
  />
</div>      </div>
    </section>

    {/* ===== DANH MỤC ===== */}
    <section className="container sec">
      <div className="sec-head">
        <div>
          <p className="eyebrow sm">DANH MỤC SẢN PHẨM & DỊCH VỤ</p>
          <h2>GIẢI PHÁP TOÀN DIỆN CHO DOANH NGHIỆP</h2>
          <p className="muted">Từ trụ đèn đến dịch vụ gia công, chúng tôi luôn đồng hành cùng bạn.</p>
        </div>
        <Link to="/catalog" className="more">Xem tất cả →</Link>
      </div>
      <div className="catgrid">
        {cats.data?.map((c) => (
          <Link key={c.id} to={`/catalog?category=${c.id}`} className="catcard">
            <div className="catimg"><img
  src={categoryImage(c)}
  alt={c.name}
  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = mockCatImage(c.name); }}
/></div>
            <div className="catbody">
              <h3>{c.name}</h3>
              <p>Tư vấn, cung cấp và lắp đặt đáp ứng mọi nhu cầu công trình.</p>
              <span className="more">Xem chi tiết →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>

    {/* ===== VÌ SAO CHỌN ===== */}
    <section className="container">
      <div className="why">
        <div><p className="eyebrow sm">VÌ SAO CHỌN CHÚNG TÔI?</p><h2>ĐỒNG HÀNH CÙNG CÔNG TRÌNH CỦA BẠN</h2></div>
        <div className="stats">{STATS.map(([n, l]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}</div>
      </div>
    </section>

    {/* ===== SẢN PHẨM NỔI BẬT ===== */}
    <section className="container sec">
      <div className="sec-head"><div><p className="eyebrow sm">SẢN PHẨM</p><h2>SẢN PHẨM NỔI BẬT</h2></div>
        <Link to="/catalog" className="more">Xem tất cả →</Link></div>
      {prods.loading ? <Loading /> : <div className="grid">{prods.data?.slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}</div>}
    </section>
  </>);
}
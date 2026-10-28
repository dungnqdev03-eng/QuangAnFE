import { Link } from "react-router-dom";
import { getCategories } from "../../api/category";
import { getProducts } from "../../api/product";
import { useAsync } from "../../hooks";
import ProductCard from "../../components/ProductCard";
import { Loading } from "../../components/State";
import config from "../../../app-config.json";
import { categoryImage } from "../../utils/categoryImages";
import { mockCatImage } from "../../utils/mockImage";

// Ảnh tạm. Thay bằng ảnh thật: bỏ file vào src/static/ rồi import vào đây
const ph = (w: number, h: number, t: string) =>
  `https://placehold.co/${w}x${h}/e8eef6/0b2545?text=${encodeURIComponent(t)}`;

const FEATS = [
  { icon: "🛡️", t: "Chất lượng", d: "Đạt tiêu chuẩn quốc tế" },
  { icon: "⚙️", t: "Kinh nghiệm", d: "Hơn 10 năm trong ngành" },
  { icon: "🎧", t: "Hỗ trợ nhanh", d: "24/7 mọi lúc mọi nơi" },
];
const STATS = [["10+", "Năm kinh nghiệm"], ["500+", "Công trình"], ["100%", "Khách hàng hài lòng"]];

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
            <Link to="/contact" className="btn-outline">📞 Liên hệ tư vấn</Link>
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
    src="https://ba-design.vn/wp-content/uploads/2025/06/tru-den-san-vuon-1.jpg"
    alt="Trụ đèn sân vườn"
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
/><span className="caticon">{c.icon}</span></div>
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
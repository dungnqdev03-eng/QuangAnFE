import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../../api/product";
import { getCategories } from "../../api/category";
import { useAsync } from "../../hooks";
import { cartActions } from "../../state";
import { formatPrice } from "../../utils/format";
import { Loading } from "../../components/State";
import RichText from "../../components/RichText";
import CategorySidebar from "../../components/CategorySidebar";
import config from "../../../app-config.json";

type Tab = "desc" | "specs" | "review";

export default function ProductDetail() {
  const id = Number(useParams().id);
  const { data: p, loading } = useAsync(() => getProduct(id), [id]);
  const cats = useAsync(getCategories, []);
  const [sel, setSel] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [tab, setTab] = useState<Tab>("desc");

  const images = p ? (p.images?.length ? p.images : [p.image]) : [];
  const total = images.length;
  const go = (i: number) => total > 0 && setSel((i + total) % total);

  useEffect(() => { setSel(0); setTab("desc"); }, [id]);

  useEffect(() => {
    if (total < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(sel - 1);
      if (e.key === "ArrowRight") go(sel + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, total]);

  if (loading) return <Loading />;
  if (!p) return <p>Không tìm thấy sản phẩm.</p>;

  const cat = cats.data?.find((c) => c.id === p.categoryId);
  const tel = config.phone.replace(/\s/g, "");

  return (
    <div className="pdp">
      <div className="pdp-main">
        <div className="detail">
          {/* ===== Bộ ảnh ===== */}
          <div className="gallery">
            <div
              className="gmain"
              onTouchStart={(e) => setStartX(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (startX === null) return;
                const dx = e.changedTouches[0].clientX - startX;
                if (Math.abs(dx) > 50) go(dx < 0 ? sel + 1 : sel - 1);
                setStartX(null);
              }}
            >
              <div className="gtrack" style={{ transform: `translateX(-${sel * 100}%)` }}>
                {images.map((src, i) => (
                  <div className="gslide" key={src}>
                    <img src={src} alt={`${p.name} ${i + 1}`} draggable={false} />
                  </div>
                ))}
              </div>
              {total > 1 && (<>
                <button className="garrow left" onClick={() => go(sel - 1)} aria-label="Ảnh trước">‹</button>
                <button className="garrow right" onClick={() => go(sel + 1)} aria-label="Ảnh sau">›</button>
                <span className="gcount">{sel + 1} / {total}</span>
              </>)}
            </div>
            {total > 1 && (
              <div className="gthumbs">
                {images.map((src, i) => (
                  <button key={src} className={i === sel ? "gthumb active" : "gthumb"} onClick={() => setSel(i)}>
                    <img src={src} alt={`${p.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== Thông tin sản phẩm ===== */}
          <div className="pinfo">
            <nav className="crumb">
              <Link to="/">Trang chủ</Link>
              {cat && <><span>/</span><Link to={`/catalog?category=${cat.id}`}>{cat.name}</Link></>}
              <span>/</span>{p.name}
            </nav>

            <h1>{p.name}</h1>
            <div className="price big">{formatPrice(p.price)}</div>

            <div className="pbtns">
              <button className="btn" onClick={() => cartActions.add(p)}>Thêm vào báo giá</button>
              <Link to="/contact" className="btn-outline">Hướng dẫn mua hàng</Link>
            </div>

            <p className="hotline">📞 Hotline: <b>{config.phone}</b></p>

            <div className="addrbox">
              {config.branches.slice(0, 2).map((b) => (
                <p key={b.title}>📍 <b>{b.title}:</b> {b.address}</p>
              ))}
            </div>

            <a href={`tel:${tel}`} className="quickbuy">
              <b>Mua hàng nhanh</b>
              <span>Gọi điện xác nhận và giao hàng tận nơi</span>
            </a>

            {/* <p><Link to={`/admin/product/${p.id}/description`} className="more">✎ Sửa mô tả</Link></p> */}
          </div>
        </div>

        {/* ===== Tab mô tả / thông số / đánh giá ===== */}
        <section className="ptabs">
          <div className="tabbar">
            <button className={tab === "desc" ? "tabbtn active" : "tabbtn"} onClick={() => setTab("desc")}>Mô tả sản phẩm</button>
            <button className={tab === "specs" ? "tabbtn active" : "tabbtn"} onClick={() => setTab("specs")}>Thông số</button>
            <button className={tab === "review" ? "tabbtn active" : "tabbtn"} onClick={() => setTab("review")}>Đánh giá</button>
          </div>
          <div className="tabpanel">
            {tab === "desc" && <RichText html={p.description} />}
            {tab === "specs" && (p.specs
              ? <table><tbody>{Object.entries(p.specs).map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}</tbody></table>
              : <p className="muted">Chưa có thông số.</p>)}
            {tab === "review" && <p className="muted">Chưa có đánh giá. <Link to="/contact" className="more">Liên hệ tư vấn →</Link></p>}
          </div>
        </section>
      </div>

      {/* ===== Cột danh mục đi theo khi cuộn ===== */}
      <CategorySidebar activeId={p.categoryId} />
    </div>
  );
}
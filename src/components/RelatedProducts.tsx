import { useRef } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/product";
import { useAsync } from "../hooks";
import ProductCard from "./ProductCard";

export default function RelatedProducts({ product }: { product: Product }) {
  const track = useRef<HTMLDivElement>(null);

  // Chỉ lấy sản phẩm cùng danh mục, bỏ sản phẩm đang xem, tối đa 8
  const { data } = useAsync(async () => {
    const list = await getProducts({ categoryId: product.categoryId });
    return list.filter((x) => x.id !== product.id).slice(0, 8);
  }, [product.id, product.categoryId]);

  // Danh mục không có sản phẩm nào khác thì ẩn cả khối, không hiện khung trống
  if (!data?.length) return null;

  const scroll = (dir: number) =>
    track.current?.scrollBy({ left: dir * 480, behavior: "smooth" });

  return (
    <section className="related">
      <div className="rel-head">
        <div>
          <h2>Sản phẩm liên quan</h2>
        </div>
        <div className="rel-ctrl">
          <Link to={`/catalog?category=${product.categoryId}`} className="more">Xem tất cả →</Link>
          <button className="rel-btn" onClick={() => scroll(-1)} aria-label="Trước">‹</button>
          <button className="rel-btn" onClick={() => scroll(1)} aria-label="Sau">›</button>
        </div>
      </div>

      <div className="rel-track" ref={track}>
        {data.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}
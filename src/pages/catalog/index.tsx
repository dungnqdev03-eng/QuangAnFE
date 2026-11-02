import { useSearchParams } from "react-router-dom";
import { getProducts } from "../../api/product";
import { useAsync } from "../../hooks";
import ProductCard from "../../components/ProductCard";
import CategorySidebar from "../../components/CategorySidebar";
import { Loading, ErrorMsg } from "../../components/State";

export default function Catalog() {
  const [sp] = useSearchParams();
  const cid = Number(sp.get("category")) || undefined;
  const { data, loading, error } = useAsync(() => getProducts({ categoryId: cid }), [cid]);

  return (
    <div className="layout2">
      <CategorySidebar activeId={cid} allActive={!cid} />
      <section>
        {loading ? <Loading /> : error ? <ErrorMsg msg={error} /> : (
          data?.length
            ? <div className="grid">{data.map((p) => <ProductCard key={p.id} p={p} />)}</div>
            : <p className="muted">Chưa có sản phẩm trong danh mục này.</p>
        )}
      </section>
    </div>
  );
}
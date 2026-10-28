import { useSearchParams } from "react-router-dom";
import { getCategories } from "../../api/category";
import { getProducts } from "../../api/product";
import { useAsync } from "../../hooks";
import ProductCard from "../../components/ProductCard";
import { Loading, ErrorMsg } from "../../components/State";

export default function Catalog() {
  const [sp, setSp] = useSearchParams();
  const cid = Number(sp.get("category")) || undefined;
  const cats = useAsync(getCategories, []);
  const { data, loading, error } = useAsync(() => getProducts({ categoryId: cid }), [cid]);
  return (<div className="layout2">
    <aside><h3>Danh mục</h3>
      <button className={!cid ? "side active" : "side"} onClick={() => setSp({})}>Tất cả</button>
      {cats.data?.map((c) => <button key={c.id} className={cid === c.id ? "side active" : "side"} onClick={() => setSp({ category: String(c.id) })}>{c.icon} {c.name}</button>)}
    </aside>
    <section>{loading ? <Loading /> : error ? <ErrorMsg msg={error} /> : <div className="grid">{data?.map((p) => <ProductCard key={p.id} p={p} />)}</div>}</section>
  </div>);
}

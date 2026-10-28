import { useSearchParams } from "react-router-dom";
import { getProducts } from "../../api/product";
import { useAsync } from "../../hooks";
import ProductCard from "../../components/ProductCard";
import { Loading } from "../../components/State";

export default function Search() {
  const q = useSearchParams()[0].get("q") || "";
  const { data, loading } = useAsync(() => getProducts({ q }), [q]);
  return (<><h2>Kết quả cho "{q}"</h2>
    {loading ? <Loading /> : data?.length ? <div className="grid">{data.map((p) => <ProductCard key={p.id} p={p} />)}</div> : <p>Không có sản phẩm phù hợp.</p>}</>);
}

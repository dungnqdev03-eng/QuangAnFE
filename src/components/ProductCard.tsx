import { Link } from "react-router-dom";
import { cartActions } from "../state";
import { formatPrice } from "../utils/format";

export default function ProductCard({ p }: { p: Product }) {
  return (<div className="card">
    <Link to={`/product/${p.id}`}><img src={p.image} alt={p.name} /></Link>
    <Link to={`/product/${p.id}`} className="name">{p.name}</Link>
    <div className="price">{formatPrice(p.price)}</div>
    <button className="btn" onClick={() => cartActions.add(p)}>Thêm vào báo giá</button>
  </div>);
}

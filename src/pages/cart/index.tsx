import { useState } from "react";
import { useCart, cartActions } from "../../state";
import { submitQuote } from "../../api/product";
import { formatPrice } from "../../utils/format";

export default function Cart() {
  const cart = useCart(); const [f, setF] = useState({ name: "", phone: "", note: "" });
  const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  async function send() {
    if (!f.name || !f.phone) return setMsg("Vui lòng nhập tên và số điện thoại.");
    setBusy(true);
    try { await submitQuote({ ...f, items: cart.map((i) => ({ productId: i.product.id, qty: i.qty })) }); cartActions.clear(); setMsg("✅ Đã gửi yêu cầu! Chúng tôi sẽ liên hệ sớm."); }
    catch (e) { setMsg("⚠️ " + (e as Error).message); } finally { setBusy(false); }
  }
  return (<><h2>Danh sách báo giá</h2>{msg && <p>{msg}</p>}
    {cart.length === 0 ? <p className="muted">Chưa có sản phẩm.</p> : <>
      <table className="cart"><tbody>{cart.map(({ product: p, qty }) => <tr key={p.id}>
        <td><img src={p.image} width={64} /></td><td>{p.name}</td><td>{formatPrice(p.price)}</td>
        <td><input type="number" min={1} value={qty} onChange={(e) => cartActions.setQty(p.id, +e.target.value)} /></td>
        <td><button onClick={() => cartActions.remove(p.id)}>✕</button></td></tr>)}</tbody></table>
      <p className="price big">Tạm tính: {formatPrice(total)}</p>
      <div className="form"><input placeholder="Họ tên" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input placeholder="Số điện thoại" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
        <textarea placeholder="Ghi chú (địa chỉ, yêu cầu...)" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} />
        <button className="btn big" disabled={busy} onClick={send}>{busy ? "Đang gửi..." : "Gửi yêu cầu báo giá"}</button></div></>}</>);
}

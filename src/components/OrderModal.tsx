import { useEffect, useRef, useState } from "react";
import { submitQuote } from "../api/product";
import { formatPrice } from "../utils/format";
import { createOrder } from "../api/product";

const PHONE_RE = /^(0|\+84)\d{9}$/;
const EMAIL_RE = /^\S+@\S+\.\S+$/;

interface Props { product: Product; onClose: () => void }

export default function OrderModal({ product, onClose }: Props) {
  const [qty, setQty] = useState(1);
  const [f, setF] = useState({ gender: "Anh", name: "", phone: "", email: "", address: "", note: "", payment: "ELECTRONIC_PAYMENT" });
  const [tried, setTried] = useState(false); // đã bấm gửi ít nhất 1 lần thì mới hiện lỗi
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));
  const phone = f.phone.replace(/[\s.]/g, "");
  const errs = {
    name: f.name.trim() ? "" : "Vui lòng nhập họ và tên",
    phone: !phone ? "Vui lòng nhập số điện thoại" : PHONE_RE.test(phone) ? "" : "Số điện thoại chưa đúng (ví dụ: 0907123456)",
    email: !f.email.trim() || EMAIL_RE.test(f.email.trim()) ? "" : "Email chưa đúng định dạng",
  };
  const total = product.price * qty;

  // Esc để đóng, khóa cuộn trang phía sau, đưa con trỏ vào ô họ tên
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nameRef.current?.focus();
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = old; };
  }, [onClose]);

  async function submit() {
    setTried(true); setError("");
    if (errs.name || errs.phone || errs.email) return;
    setBusy(true);
    try {
await createOrder({
  gender: f.gender === "Anh",
  fullName: f.name.trim(),
  phone,
  email: f.email.trim(),
  address: f.address.trim(),
  note: f.note.trim(),
  productName: product.name,
  productId: product.id,
  quantity: qty,
  unitPrice: product.price,
  paymentMethod: f.payment as PaymentMethod,
});
      setDone(true);
    } catch (e) {
      setError((e as Error).message || "Không gửi được đơn, vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  const show = (k: keyof typeof errs) => tried && errs[k];

  return (
    <div className="om-bg" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="om" role="dialog" aria-modal="true" aria-labelledby="om-title">
        <header className="om-head">
          <h2 id="om-title">Đặt mua {product.name}</h2>
          <button className="om-x" onClick={onClose} aria-label="Đóng">✕</button>
        </header>

        {done ? (
          <div className="om-done">
            <div className="om-check">✓</div>
            <h3>Đặt hàng thành công</h3>
            <p>Cảm ơn {f.gender} {f.name.trim()}. Nhân viên sẽ gọi đến số <b>{phone}</b> để xác nhận đơn hàng trước khi giao.</p>
            <div className="om-sum">
              <div><span>Sản phẩm</span><b>{product.name} × {qty}</b></div>
              <div className="om-sum-total"><span>Tổng</span><b>{formatPrice(total)}</b></div>
            </div>
            <button className="btn big" onClick={onClose}>Tiếp tục xem sản phẩm</button>
          </div>
        ) : (
          <div className="om-body">
            {/* ===== Trái: sản phẩm ===== */}
            <section className="om-left">
              <div className="om-prod">
                <img src={product.image} alt={product.name} />
                <div>
                  <h3>{product.name}</h3>
                  <div className="price big">{formatPrice(product.price)}</div>
                </div>
              </div>

              <div className="om-qty">
                <span>Số lượng</span>
                <div className="om-step">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Giảm">−</button>
                  <input type="number" min={1} max={999} value={qty}
                    onChange={(e) => setQty(Math.min(999, Math.max(1, Number(e.target.value) || 1)))} />
                  <button type="button" onClick={() => setQty((q) => Math.min(999, q + 1))} aria-label="Tăng">+</button>
                </div>
              </div>

              <div className="om-sum">
                <div><span>Đơn giá</span><b>{formatPrice(product.price)}</b></div>
                <div><span>Số lượng</span><b>{qty}</b></div>
                <div className="om-sum-total"><span>Tạm tính</span><b>{formatPrice(total)}</b></div>
              </div>

              <ul className="om-notes">
                <li>📞 Vui lòng nhập đúng số điện thoại để chúng tôi gọi xác nhận đơn hàng trước khi giao.</li>
                <li>📦 Nên gọi điện xác nhận với nhân viên trước khi đặt để biết trình trạng còn hàng.</li>
              </ul>
            </section>

            {/* ===== Phải: form ===== */}
            <section className="om-right">
              <h3>Thông tin người mua</h3>

              <div className="om-radios">
                {["Anh", "Chị"].map((g) => (
                  <label key={g}><input type="radio" name="gender" checked={f.gender === g} onChange={() => set("gender", g)} /> {g}</label>
                ))}
              </div>

              <div className="om-row">
                <div className={show("name") ? "om-f has-err" : "om-f"}>
                  <input ref={nameRef} className="om-in" placeholder="Họ và tên *" aria-label="Họ và tên"
                    value={f.name} onChange={(e) => set("name", e.target.value)} />
                  {show("name") && <small>{errs.name}</small>}
                </div>
                <div className={show("phone") ? "om-f has-err" : "om-f"}>
                  <input className="om-in" type="tel" inputMode="tel" placeholder="Số điện thoại *" aria-label="Số điện thoại"
                    value={f.phone} onChange={(e) => set("phone", e.target.value)} />
                  {show("phone") && <small>{errs.phone}</small>}
                </div>
              </div>

              <div className={show("email") ? "om-f has-err" : "om-f"}>
                <input className="om-in" type="email" placeholder="Địa chỉ email (không bắt buộc)" aria-label="Email"
                  value={f.email} onChange={(e) => set("email", e.target.value)} />
                {show("email") && <small>{errs.email}</small>}
              </div>

              <div className="om-f"><textarea className="om-in" rows={2} placeholder="Địa chỉ nhận hàng (không bắt buộc)" aria-label="Địa chỉ"
                value={f.address} onChange={(e) => set("address", e.target.value)} /></div>

              <div className="om-f"><textarea className="om-in" rows={2} placeholder="Ghi chú đơn hàng (không bắt buộc)" aria-label="Ghi chú"
                value={f.note} onChange={(e) => set("note", e.target.value)} /></div>

              <h4>Hình thức thanh toán</h4>
<div className="om-pays">
  <label className={f.payment === "ELECTRONIC_PAYMENT" ? "om-pay on" : "om-pay"}>
    <input type="radio" name="pay" checked={f.payment === "ELECTRONIC_PAYMENT"} onChange={() => set("payment", "ELECTRONIC_PAYMENT")} />
    <span><b>Chuyển khoản ngân hàng</b><small>Thông tin tài khoản gửi sau khi xác nhận đơn</small></span>
  </label>
  <label className={f.payment === "CASH" ? "om-pay on" : "om-pay"}>
    <input type="radio" name="pay" checked={f.payment === "CASH"} onChange={() => set("payment", "CASH")} />
    <span><b>Trả tiền mặt khi nhận hàng</b><small>Thanh toán trực tiếp cho người giao</small></span>
  </label>
</div>

              <div className="om-total"><span>Tổng cộng</span><b>{formatPrice(total)}</b></div>

              {error && <p className="error">⚠️ {error}</p>}
              <button className="btn big om-submit" onClick={submit} disabled={busy}>
                {busy ? "Đang gửi..." : "Đặt hàng ngay"}
              </button>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
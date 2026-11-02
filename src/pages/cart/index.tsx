import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart, cartActions } from "../../state";
import { createOrder } from "../../api/product";
import { formatPrice } from "../../utils/format";
import CategorySidebar from "../../components/CategorySidebar";

const PHONE_RE = /^(0|\+84)\d{9}$/;
const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function Cart() {
  const cart = useCart();
  const added = (useLocation().state as { added?: string } | null)?.added;
  const [f, setF] = useState({ gender: "Anh", name: "", address: "", phone: "", email: "", note: "", payment: "ELECTRONIC_PAYMENT" as PaymentMethod });
  const [tried, setTried] = useState(false); // đã bấm đặt hàng thì mới hiện lỗi
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ name: string; phone: string; total: number } | null>(null);

  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));
  const phone = f.phone.replace(/[\s.]/g, "");
  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const quoteOnly = cart.filter((i) => i.product.price === 0).length; // sản phẩm giá "Liên hệ"

  const errs = {
    name: f.name.trim() ? "" : "Vui lòng nhập họ và tên",
    address: f.address.trim() ? "" : "Vui lòng nhập địa chỉ",
    phone: !phone ? "Vui lòng nhập số điện thoại" : PHONE_RE.test(phone) ? "" : "Số điện thoại chưa đúng (ví dụ: 0907123456)",
    email: !f.email.trim() ? "Vui lòng nhập email" : EMAIL_RE.test(f.email.trim()) ? "" : "Email chưa đúng định dạng",
  };
  const bad = (k: keyof typeof errs) => tried && errs[k];

  async function submit() {
    setTried(true); setError("");
    if (Object.values(errs).some(Boolean) || !cart.length) return;
    setBusy(true);

    // Backend nhận 1 sản phẩm cho mỗi đơn nên gửi lần lượt từng sản phẩm, thành công thì bỏ khỏi giỏ
    const items = [...cart];
    const failed: string[] = [];
    for (const it of items) {
      try {
        await createOrder({
          gender: f.gender === "Anh",
          fullName: f.name.trim(),
          phone,
          email: f.email.trim(),
          address: f.address.trim(),
          note: f.note.trim(),
          productName: it.product.name,
          productId: it.product.id,
          quantity: it.qty,
          unitPrice: it.product.price,
          paymentMethod: f.payment,
        });
        cartActions.remove(it.product.id);
      } catch (e) {
        failed.push(`${it.product.name} (${(e as Error).message})`);
      }
    }
    setBusy(false);
    if (failed.length) setError("Chưa gửi được: " + failed.join("; ") + ". Các sản phẩm này vẫn còn trong giỏ, bạn thử lại nhé.");
    else setDone({ name: `${f.gender} ${f.name.trim()}`, phone, total });
  }

  if (done) {
    return (
      <div className="co-done">
        <div className="ct-check">✓</div>
        <h1>Đặt hàng thành công</h1>
        <p>Cảm ơn {done.name}. Nhân viên sẽ gọi đến số <b>{done.phone}</b> để xác nhận đơn hàng trước khi giao.</p>
        <p className="price big">{formatPrice(done.total)}</p>
        <Link to="/catalog" className="btn big">Tiếp tục xem sản phẩm</Link>
      </div>
    );
  }

  return (<>
{added && cart.length > 0 && <div className="co-added"><span>✔</span> “{added}” đã được thêm vào giỏ hàng.</div>}
    <div className="co">
      <CategorySidebar />

      {/* ===== Giữa: thông tin thanh toán ===== */}
      <section className="co-main">
        <h1>THANH TOÁN</h1>
        <h2>THÔNG TIN THANH TOÁN</h2>

        <div className="co-radios">
          {["Anh", "Chị"].map((g) => (
            <label key={g}><input type="radio" name="gender" checked={f.gender === g} onChange={() => set("gender", g)} /> {g}</label>
          ))}
        </div>

        <div className={bad("name") ? "co-f err" : "co-f"}>
          <label htmlFor="co-name">Họ và tên <i>*</i></label>
          <input id="co-name" placeholder="Nhập đầy đủ họ và tên của bạn" value={f.name} onChange={(e) => set("name", e.target.value)} />
          {bad("name") && <small>{errs.name}</small>}
        </div>
        <div className={bad("address") ? "co-f err" : "co-f"}>
          <label htmlFor="co-addr">Địa chỉ <i>*</i></label>
          <input id="co-addr" placeholder="Ví dụ: Số 12, đường ABC, phường XYZ, tỉnh/thành phố" value={f.address} onChange={(e) => set("address", e.target.value)} />
          {bad("address") && <small>{errs.address}</small>}
        </div>
        <div className={bad("phone") ? "co-f err" : "co-f"}>
          <label htmlFor="co-phone">Số điện thoại <i>*</i></label>
          <input id="co-phone" type="tel" inputMode="tel" placeholder="Số điện thoại để chúng tôi gọi xác nhận" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
          {bad("phone") && <small>{errs.phone}</small>}
        </div>
        <div className={bad("email") ? "co-f err" : "co-f"}>
          <label htmlFor="co-mail">Địa chỉ email <i>*</i></label>
          <input id="co-mail" type="email" placeholder="ten@email.com" value={f.email} onChange={(e) => set("email", e.target.value)} />
          {bad("email") && <small>{errs.email}</small>}
        </div>
        <div className="co-f">
          <label htmlFor="co-note">Ghi chú đơn hàng (không bắt buộc)</label>
          <textarea id="co-note" rows={3} placeholder="Ví dụ: giao giờ hành chính, cần xuất hóa đơn..." value={f.note} onChange={(e) => set("note", e.target.value)} />
        </div>
      </section>

      {/* ===== Phải: đơn hàng ===== */}
      <aside className="co-sum">
        <h2>ĐƠN HÀNG CỦA BẠN</h2>

        {cart.length === 0 ? (
          <p className="muted">Chưa có sản phẩm. <Link to="/catalog" className="more">Xem sản phẩm →</Link></p>
        ) : (<>
          <div className="co-th"><span>SẢN PHẨM</span><span>TẠM TÍNH</span></div>
          {cart.map(({ product: p, qty }) => (
            <div className="co-item" key={p.id}>
              <img src={p.image} alt="" />
              <div className="co-item-info">
                <Link to={`/product/${p.id}`}>{p.name}</Link>
                <div className="co-step">
                  <button type="button" onClick={() => cartActions.setQty(p.id, qty - 1)} aria-label="Giảm">−</button>
                  <span>{qty}</span>
                  <button type="button" onClick={() => cartActions.setQty(p.id, qty + 1)} aria-label="Tăng">+</button>
                  <button type="button" className="co-del" onClick={() => cartActions.remove(p.id)}>Xóa</button>
                </div>
              </div>
              <b>{formatPrice(p.price * qty)}</b>
            </div>
          ))}

          <div className="co-row"><span>Tạm tính</span><b>{formatPrice(total)}</b></div>
          <div className="co-row co-total"><span>Tổng</span><b>{formatPrice(total)}</b></div>
          {quoteOnly > 0 && <p className="co-hint">Có {quoteOnly} sản phẩm giá “Liên hệ”, chưa tính vào tổng. Chúng tôi sẽ báo giá khi gọi xác nhận.</p>}

          <label className={f.payment === "ELECTRONIC_PAYMENT" ? "co-pay on" : "co-pay"}>
            <input type="radio" name="pay" checked={f.payment === "ELECTRONIC_PAYMENT"} onChange={() => set("payment", "ELECTRONIC_PAYMENT")} />
            <span><b>Chuyển khoản ngân hàng</b>
              {f.payment === "ELECTRONIC_PAYMENT" && <small>Chúng tôi sẽ gửi thông tin tài khoản sau khi xác nhận đơn. Đơn hàng được giao sau khi bạn đã chuyển khoản.</small>}
            </span>
          </label>
          <label className={f.payment === "CASH" ? "co-pay on" : "co-pay"}>
            <input type="radio" name="pay" checked={f.payment === "CASH"} onChange={() => set("payment", "CASH")} />
            <span><b>Trả tiền mặt khi nhận hàng</b>
              {f.payment === "CASH" && <small>Thanh toán trực tiếp cho người giao hàng.</small>}
            </span>
          </label>

          {error && <p className="error">⚠️ {error}</p>}
          <button className="btn big co-submit" onClick={submit} disabled={busy}>{busy ? "ĐANG GỬI..." : "ĐẶT HÀNG"}</button>
          <p className="co-priv">Thông tin cá nhân của bạn chỉ được dùng để xử lý đơn hàng và liên hệ xác nhận. Xem <Link to="/contact" className="more">chính sách riêng tư</Link>.</p>
        </>)}
      </aside>
    </div>
  </>);
}
import { useState, type FormEvent } from "react";
import { sendContact } from "../../api/contact";
import config from "../../../app-config.json";

// Đổi giờ làm việc và fanpage ở đây
const HOURS = "7h30 – 17h30 (Thứ 2 – Chủ nhật)";
const FANPAGE = { name: "Quang An – Trụ đèn chiếu sáng", url: "#" };
const TOPICS = ["Báo giá sản phẩm", "Tư vấn kỹ thuật", "Gia công cơ khí", "Hợp tác, đại lý", "Khác"];

const PHONE_RE = /^(0|\+84)\d{9}$/;
const EMAIL_RE = /^\S+@\S+\.\S+$/;
const EMPTY = { name: "", phone: "", email: "", topic: TOPICS[0], message: "" };

export default function Contact() {
  const [f, setF] = useState(EMPTY);
  const [tried, setTried] = useState(false); // đã bấm gửi thì mới hiện lỗi
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));
  const phone = f.phone.replace(/[\s.]/g, "");
  const errs = {
    name: f.name.trim() ? "" : "Vui lòng nhập họ và tên",
    phone: !phone ? "Vui lòng nhập số điện thoại" : PHONE_RE.test(phone) ? "" : "Số điện thoại chưa đúng (ví dụ: 0907123456)",
    email: !f.email.trim() || EMAIL_RE.test(f.email.trim()) ? "" : "Email chưa đúng định dạng",
    message: f.message.trim().length >= 10 ? "" : "Vui lòng nhập nội dung (ít nhất 10 ký tự)",
  };
  const bad = (k: keyof typeof errs) => tried && errs[k];

  async function submit(e: FormEvent) {
    e.preventDefault();
    setTried(true); setError("");
    if (Object.values(errs).some(Boolean)) return;
    setBusy(true);
    try {
      await sendContact({ name: f.name.trim(), phone, email: f.email.trim() || undefined, topic: f.topic, message: f.message.trim() });
      setDone(true);
    } catch (err) {
      setError((err as Error).message || "Không gửi được, vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  const tel = config.phone.replace(/\s/g, "");

  return (<>
    {/* ===== Banner ===== */}
    <section className="ct-hero">
      <p className="eyebrow sm">LIÊN HỆ</p>
      <h1>Chúng tôi luôn sẵn sàng hỗ trợ bạn</h1>
      <p>Để lại thông tin hoặc gọi trực tiếp, đội ngũ {config.name} sẽ phản hồi trong thời gian sớm nhất.</p>
    </section>

    {/* ===== 4 thẻ liên hệ nhanh ===== */}
    <section className="ct-quick">
      <a href={`tel:${tel}`} className="ct-q"><span>📞</span><div><small>Hotline</small><b>{config.phone}</b></div></a>
      <a href={`mailto:${config.email}`} className="ct-q"><span>✉️</span><div><small>Email</small><b>{config.email}</b></div></a>
      <div className="ct-q"><span>🕒</span><div><small>Giờ làm việc</small><b>{HOURS}</b></div></div>
      <a href={config.zalo} target="_blank" rel="noreferrer" className="ct-q"><span>💬</span><div><small>Chat Zalo</small><b>Nhắn tin tư vấn ngay</b></div></a>
    </section>

    <div className="ct-grid">
      {/* ===== Form ===== */}
      <section className="ct-card">
        {done ? (
          <div className="ct-done">
            <div className="ct-check">✓</div>
            <h2>Đã gửi thông tin</h2>
            <p>Cảm ơn {f.name.trim()}. Chúng tôi sẽ gọi đến số <b>{phone}</b> trong thời gian sớm nhất.</p>
            <button className="btn" onClick={() => { setDone(false); setTried(false); setF(EMPTY); }}>Gửi yêu cầu khác</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <h2>Bạn cần hỗ trợ?</h2>
            <p className="muted"><b>{config.name}</b> rất hân hạnh được hỗ trợ bạn. Hãy để lại thông tin, yêu cầu của bạn sẽ được xử lý và phản hồi sớm nhất.</p>

            <div className="ct-row">
              <div className={bad("name") ? "ct-f err" : "ct-f"}>
                <input className="ct-in" placeholder="Họ và tên *" aria-label="Họ và tên" value={f.name} onChange={(e) => set("name", e.target.value)} />
                {bad("name") && <small>{errs.name}</small>}
              </div>
              <div className={bad("phone") ? "ct-f err" : "ct-f"}>
                <input className="ct-in" type="tel" inputMode="tel" placeholder="Số điện thoại *" aria-label="Số điện thoại" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
                {bad("phone") && <small>{errs.phone}</small>}
              </div>
            </div>

            <div className="ct-row">
              <div className={bad("email") ? "ct-f err" : "ct-f"}>
                <input className="ct-in" type="email" placeholder="Email (không bắt buộc)" aria-label="Email" value={f.email} onChange={(e) => set("email", e.target.value)} />
                {bad("email") && <small>{errs.email}</small>}
              </div>
              <div className="ct-f">
                <select className="ct-in" aria-label="Chủ đề" value={f.topic} onChange={(e) => set("topic", e.target.value)}>
                  {TOPICS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className={bad("message") ? "ct-f err" : "ct-f"}>
              <textarea className="ct-in" rows={5} placeholder="Nội dung *" aria-label="Nội dung" value={f.message} onChange={(e) => set("message", e.target.value)} />
              {bad("message") && <small>{errs.message}</small>}
            </div>

            {error && <p className="error">⚠️ {error}</p>}
            <button className="btn big ct-submit" disabled={busy}>{busy ? "Đang gửi..." : "Gửi thông tin"}</button>
          </form>
        )}
      </section>

      {/* ===== Thông tin công ty ===== */}
      <aside className="ct-card ct-info">
        <h2>{config.company.name}</h2>

        <h3>Địa chỉ công ty</h3>
        {config.branches.map((b) => (
          <div key={b.title} className="ct-branch">
            <b>📍 {b.title}</b>
            <p>{b.address}</p>
            <a href={`tel:${b.phone.replace(/\s/g, "")}`}>📞 {b.phone}</a>
          </div>
        ))}

        <h3>Liên hệ với chúng tôi</h3>
        <ul className="ct-list">
          <li><span>Email</span><a href={`mailto:${config.email}`}>{config.email}</a></li>
          <li><span>Hotline</span><a href={`tel:${tel}`}>{config.phone}</a></li>
          <li><span>Giờ làm việc</span>{HOURS}</li>
          <li><span>Fanpage</span><a href={FANPAGE.url} target="_blank" rel="noreferrer">{FANPAGE.name}</a></li>
        </ul>
      </aside>
    </div>

    {/* ===== Bản đồ ===== */}
    <section className="ct-map">
      <iframe loading="lazy" title="Bản đồ" src={`https://www.google.com/maps?q=${encodeURIComponent(config.mapQuery)}&output=embed`} />
    </section>
  </>);
}
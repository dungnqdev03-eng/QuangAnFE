// Dải 4 điểm mạnh. Đổi chữ ở mảng ITEMS bên dưới.
const ITEMS = [
  { t: "Sản phẩm đa dạng", d: "Giá tốt từ nhà máy",
    icon: <><circle cx="12" cy="9" r="6" /><path d="M8.5 14L7 22l5-3 5 3-1.5-8" /></> },
  { t: "Cam kết chất lượng", d: "Đạt tiêu chuẩn kỹ thuật",
    icon: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" /> },
  { t: "Giao hàng toàn quốc", d: "Nhanh chóng, đúng hẹn",
    icon: <><rect x="2" y="7" width="12" height="9" rx="1" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></> },
  { t: "Uy tín hàng đầu", d: "Sản xuất trực tiếp",
    icon: <path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z" /> },
];

export default function FeatureStrip() {
  return (
    <section className="fstrip">
      <div className="container fstrip-in">
        {ITEMS.map((it) => (
          <div key={it.t} className="fitem">
            <span className="fic">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{it.icon}</svg>
            </span>
            <div><b>{it.t}</b><small>{it.d}</small></div>
          </div>
        ))}
      </div>
    </section>
  );
}
export const categories: Category[] = [
  { id: 1, name: "Trụ đèn chiếu sáng", icon: "💡" },
  { id: 2, name: "Trụ đèn trang trí", icon: "🏮" },
  { id: 3, name: "Cần đèn & phụ kiện", icon: "🔩" },
  { id: 4, name: "Gia công cơ khí", icon: "⚙️" },
];
const img = (t: string) => `https://placehold.co/600x450/1e3a5f/ffffff?text=${encodeURIComponent(t)}`;
export const products: Product[] = [
  { id: 1, name: "Trụ đèn bát giác côn 8m", price: 4200000, categoryId: 1, image: img("Tru den 8m"), description: "Thép mạ kẽm nhúng nóng, sơn tĩnh điện, dùng cho đường phố.", specs: { "Chiều cao": "8m", "Vật liệu": "Thép SS400", "Mạ": "Kẽm nhúng nóng" } },
  { id: 2, name: "Trụ đèn bát giác côn 10m", price: 5900000, categoryId: 1, image: img("Tru den 10m"), description: "Chịu gió bão cấp 12, phù hợp đường lớn.", specs: { "Chiều cao": "10m", "Vật liệu": "Thép SS400", "Mạ": "Kẽm nhúng nóng" } },
  { id: 3, name: "Trụ đèn sân vườn cổ điển", price: 1800000, categoryId: 2, image: img("San vuon"), description: "Gang đúc kiểu châu Âu, cao 3m.", specs: { "Chiều cao": "3m", "Vật liệu": "Gang đúc" } },
  { id: 4, name: "Trụ đèn trang trí 4 nhánh", price: 3500000, categoryId: 2, image: img("4 nhanh"), description: "Trang trí công viên, quảng trường.", specs: { "Chiều cao": "4m", "Số nhánh": "4" } },
  { id: 5, name: "Cần đèn đơn 2.5m", price: 650000, categoryId: 3, image: img("Can den"), description: "Cần đèn mạ kẽm, lắp trụ tròn/bát giác." },
  { id: 6, name: "Bu lông móng M24", price: 120000, categoryId: 3, image: img("Bu long M24"), description: "Bộ bu lông móng trụ đèn, thép cường độ cao." },
  { id: 7, name: "Gia công khung thép theo bản vẽ", price: 0, categoryId: 4, image: img("Khung thep"), description: "Cắt, chấn, hàn, mạ theo yêu cầu. Liên hệ báo giá." },
  { id: 8, name: "Gia công tủ điện, giá đỡ", price: 0, categoryId: 4, image: img("Tu dien"), description: "Tôn sơn tĩnh điện, đúng tiêu chuẩn." },
];

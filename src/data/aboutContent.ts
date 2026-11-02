// ===== NỘI DUNG TRANG GIỚI THIỆU: SỬA TẠI ĐÂY =====
// Cách viết trong chữ:
//   {company}        -> tên công ty (lấy từ app-config.json)
//   {brand}          -> tên thương hiệu
//   **chữ đậm**      -> in đậm
//   [chữ](/catalog)  -> liên kết (đường dẫn trong web bắt đầu bằng /, ngoài web bắt đầu bằng https)

export type Block =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "gallery"; caption?: string; images: { src?: string; alt: string }[] }
  | { type: "cta"; title: string; text: string };

export const ABOUT_TITLE = "Chào mừng Quý khách đến với {brand}!";

export const BLOCKS: Block[] = [
  { type: "h2", text: "Chúng tôi là ai?" },
  { type: "p", text: "**{company}** chuyên cung cấp trụ đèn chiếu sáng, cần đèn, hộ lan, lan can, bu lông móng và các sản phẩm cơ khí phục vụ công trình chiếu sáng công cộng, khu công nghiệp, khu đô thị và sân vườn." },
  { type: "p", text: "Với mong muốn mang đến sản phẩm bền, đẹp và giá hợp lý, chúng tôi chủ động từ khâu tư vấn, gia công, mạ kẽm, sơn hoàn thiện đến giao hàng và hỗ trợ lắp đặt." },
  { type: "p", text: "Đội ngũ kỹ thuật và thợ gia công của chúng tôi luôn chú trọng chất lượng từng mối hàn, từng lớp mạ, để mỗi sản phẩm bàn giao đều vận hành ổn định trong thời gian dài." },

  { type: "h2", text: "Sản phẩm của chúng tôi" },
  { type: "p", text: "Chúng tôi cung cấp đa dạng các nhóm sản phẩm, đáp ứng từ công trình nhỏ đến dự án lớn:" },
  { type: "ul", items: [
    "**Trụ đèn chiếu sáng:** bát giác, tròn côn, đa giác, nhiều chiều cao khác nhau.",
    "**Trụ đèn trang trí, sân vườn:** nhiều kiểu dáng cho công viên, khu dân cư, resort.",
    "**Cần đèn và phụ kiện:** cần đơn, cần đôi, cần đèn kiểu, bu lông móng.",
    "**Hộ lan, lan can:** an toàn giao thông và công trình dân dụng.",
    "**Gia công cơ khí:** theo bản vẽ và yêu cầu riêng của khách hàng.",
  ] },

  // Dải 4 ảnh: để src trống thì hiện hình minh họa, dán link ảnh thật (Cloudinary...) vào src để thay
  { type: "gallery", caption: "{brand} – CHẤT LƯỢNG TẠO NIỀM TIN", images: [
    { src: "", alt: "Trụ đèn" },
    { src: "", alt: "Cần đèn" },
    { src: "", alt: "Hộ lan" },
    { src: "", alt: "Bu lông móng" },
  ] },

  { type: "h2", text: "Vì sao chọn chúng tôi?" },
  { type: "ul", items: [
    "Sản xuất trực tiếp, kiểm soát chất lượng từ nguyên liệu đến thành phẩm.",
    "Mạ kẽm nhúng nóng và sơn tĩnh điện giúp sản phẩm bền với thời tiết.",
    "Gia công theo bản vẽ, đáp ứng kích thước và kiểu dáng riêng.",
    "Tư vấn kỹ thuật và báo giá nhanh, rõ ràng.",
    "Giao hàng toàn quốc, hỗ trợ khách hàng trước và sau bán hàng.",
  ] },

  { type: "h2", text: "Cam kết của chúng tôi" },
  { type: "p", text: "Chúng tôi cam kết sản phẩm đúng mô tả, minh bạch về thông số và giá, hỗ trợ đổi trả theo chính sách và đồng hành cùng khách hàng trong suốt quá trình sử dụng. Sự hài lòng của Quý khách là thước đo để {brand} không ngừng hoàn thiện." },

  { type: "cta", title: "Cần tư vấn hoặc báo giá?", text: "Liên hệ ngay để được hỗ trợ trong thời gian sớm nhất." },
];

// Cột "Bài viết mới" bên trái. to = "#" là chưa có trang, thay bằng đường dẫn thật khi có bài
export const POSTS: { title: string; to: string }[] = [
  { title: "Hướng dẫn chọn trụ đèn phù hợp với công trình", to: "#" },
  { title: "Mạ kẽm nhúng nóng và sơn tĩnh điện: nên chọn loại nào?", to: "#" },
  { title: "Những lưu ý khi lắp đặt bu lông móng trụ đèn", to: "#" },
];
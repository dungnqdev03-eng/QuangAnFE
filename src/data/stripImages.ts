// ===== DẢI ẢNH CHẠY NGANG: SỬA TẠI ĐÂY =====
// Thứ tự trong mảng chính là thứ tự ảnh chạy từ phải sang trái.
// src: dán link ảnh (Cloudinary, hoặc "/ten-anh.jpg" nếu ảnh nằm trong thư mục public). Để "" thì hiện hình minh họa.
// to: (không bắt buộc) bấm vào ảnh sẽ đi tới trang này, ví dụ "/catalog" hoặc "/product/2".

export const STRIP_TITLE = ""; // ví dụ "HÌNH ẢNH NỔI BẬT". Để trống thì không hiện tiêu đề
export const STRIP_SPEED = 45; // tốc độ (px mỗi giây). Số nhỏ là chạy chậm, số lớn là chạy nhanh

export const STRIP_IMAGES: { src?: string; alt: string; to?: string }[] = [
  { src: "https://console.cloudinary.com/app/c-87bb7594221ea19702f862e233c155/assets/media_library/search/asset/3495fab095146abf2f261951568f0a14/manage/summary?q=&view_mode=mosaic&context=manage", alt: "Trụ đèn" },
  { src: "", alt: "Đèn năng lượng mặt trời" },
  { src: "", alt: "Hộ lan" },
  { src: "", alt: "Bu lông móng" },
  { src: "", alt: "Cần đèn" },
  { src: "", alt: "Gia công cơ khí" },
  { src: "", alt: "Lan can" },
  { src: "", alt: "Trụ đèn trang trí" },
];
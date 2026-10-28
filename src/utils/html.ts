import DOMPurify from "dompurify";

// Liên kết trong mô tả luôn mở tab mới, an toàn
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A") {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
  }
});

export const isHtml = (s: string) => /<[a-z][\s\S]*>/i.test(s);

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Chuẩn hoá mô tả (HTML hoặc chữ thường) thành HTML đã lọc, an toàn để hiển thị
export function toSafeHtml(raw: string): string {
  const html = isHtml(raw)
    ? raw
    : raw.split(/\n+/).filter(Boolean).map((l) => `<p>${esc(l)}</p>`).join("");
  return DOMPurify.sanitize(html);
}

// Lấy chữ thuần (dùng làm đoạn tóm tắt ở đầu trang)
export function toPlainText(raw: string): string {
  if (!isHtml(raw)) return raw;
  const doc = new DOMParser().parseFromString(raw, "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
}
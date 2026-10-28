import "react-quill/dist/quill.snow.css";
import { toSafeHtml } from "../utils/html";

// Hiển thị mô tả có định dạng. Dùng class của Quill nên canh lề, cỡ chữ, font... hiện đúng như lúc soạn
export default function RichText({ html }: { html: string }) {
  if (!html?.trim()) return <p className="muted">Chưa có mô tả cho sản phẩm này.</p>;
  return (
    <div className="ql-snow rich">
      <div className="ql-editor" dangerouslySetInnerHTML={{ __html: toSafeHtml(html) }} />
    </div>
  );
}
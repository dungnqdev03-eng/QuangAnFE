import { useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const WIDTHS = ["25%", "50%", "75%", "100%"];

interface Props { value: string; onChange: (v: string) => void; images: string[] }

export default function DescriptionEditor({ value, onChange, images }: Props) {
  const ref = useRef<ReactQuill>(null);
  const pos = useRef(0);               // vị trí con trỏ lúc bấm nút chèn ảnh
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState("100%");
  const [url, setUrl] = useState("");

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }, { font: [] }, { size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }, { list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["blockquote", "link", "image"],
        ["clean"],
      ],
      handlers: {
        image() {
          pos.current = ref.current?.getEditor().getSelection(true)?.index ?? 0;
          setUrl("");
          setOpen(true);
        },
      },
    },
  }), []);

  function insert(src: string) {
    const q = ref.current?.getEditor();
    if (!q || !src.trim()) return;
    q.insertEmbed(pos.current, "image", src.trim(), "user");
    q.formatText(pos.current, 1, "width", width, "user"); // chỉnh độ rộng ảnh
    q.setSelection(pos.current + 1, 0);
    setOpen(false);
  }

  return (
    <div className="editor">
      <ReactQuill ref={ref} theme="snow" value={value} onChange={onChange} modules={modules} />

      {open && (
        <div className="modal-bg" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Chèn ảnh</h3>

            <p className="muted">1. Chọn độ rộng ảnh</p>
            <div className="wopts">
              {WIDTHS.map((w) => (
                <button key={w} className={w === width ? "wopt active" : "wopt"} onClick={() => setWidth(w)}>{w}</button>
              ))}
            </div>

            <p className="muted">2. Bấm vào ảnh của sản phẩm</p>
            {images.length ? (
              <div className="pickgrid">
                {images.map((s) => <button key={s} onClick={() => insert(s)}><img src={s} alt="" /></button>)}
              </div>
            ) : <p className="muted">Sản phẩm chưa có ảnh. Upload ảnh trước hoặc dán link bên dưới.</p>}

            <p className="muted">Hoặc dán link ảnh</p>
            <div className="form">
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
              <button className="btn" onClick={() => insert(url)}>Chèn ảnh từ link</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
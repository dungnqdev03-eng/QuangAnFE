import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct, updateProductDescription } from "../../api/product";
import { useAsync } from "../../hooks";
import DescriptionEditor from "../../components/DescriptionEditor";
import RichText from "../../components/RichText";
import { Loading } from "../../components/State";

export default function EditDescription() {
  const id = Number(useParams().id);
  const { data: p, loading } = useAsync(() => getProduct(id), [id]);
  const [html, setHtml] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (p) setHtml(p.description); }, [p]);

  async function save() {
    setBusy(true); setMsg("");
    try { await updateProductDescription(id, html); setMsg("✅ Đã lưu mô tả."); }
    catch (e) { setMsg("⚠️ " + (e as Error).message); }
    finally { setBusy(false); }
  }

  if (loading) return <Loading />;
  if (!p) return <p>Không tìm thấy sản phẩm.</p>;

  return (<>
    <h2>Soạn mô tả: {p.name}</h2>
    <DescriptionEditor value={html} onChange={setHtml} images={p.images ?? []} />
    <div className="admin-actions">
      <button className="btn big" onClick={save} disabled={busy}>{busy ? "Đang lưu..." : "Lưu mô tả"}</button>
      <Link to={`/product/${id}`} className="btn-outline">Xem trang sản phẩm</Link>
      {msg && <span>{msg}</span>}
    </div>
    <h3>Xem trước</h3>
    <div className="tabpanel"><RichText html={html} /></div>
  </>);
}
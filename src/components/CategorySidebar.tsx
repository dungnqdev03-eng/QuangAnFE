import { Link } from "react-router-dom";
import { getCategories } from "../api/category";
import { useAsync } from "../hooks";

// Cột danh mục dùng chung cho mọi trang.
// activeId: danh mục đang chọn. allActive: tô sáng mục "Tất cả sản phẩm".
export default function CategorySidebar({ activeId, allActive }: { activeId?: number; allActive?: boolean }){
  const { data } = useAsync(getCategories, []);
  return (
    <aside className="sidecat">
      <h3 className="sidecat-h">Danh mục sản phẩm</h3>
      <ul>
        <li><Link to="/catalog" className={allActive ? "active" : ""}>Tất cả sản phẩm</Link></li>
        {data?.map((c) => (
          <li key={c.id}>
            <Link to={`/catalog?category=${c.id}`} className={c.id === activeId ? "active" : ""}>{c.name}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
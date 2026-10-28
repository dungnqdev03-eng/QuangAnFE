import { Link } from "react-router-dom";
import { getCategories } from "../api/category";
import { useAsync } from "../hooks";

// Cột danh mục bên phải. activeId = danh mục đang được tô sáng
export default function CategorySidebar({ activeId }: { activeId?: number }) {
  const { data } = useAsync(getCategories, []);
  return (
    <aside className="sidecat">
      <h3 className="sidecat-h">Danh mục sản phẩm</h3>
      <ul>
        <li><Link to="/catalog">Tất cả sản phẩm</Link></li>
        {data?.map((c) => (
          <li key={c.id}>
            <Link to={`/catalog?category=${c.id}`} className={c.id === activeId ? "active" : ""}>{c.name}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
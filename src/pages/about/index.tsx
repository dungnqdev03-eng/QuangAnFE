import { Fragment } from "react";
import { Link } from "react-router-dom";
import config from "../../../app-config.json";
import CategorySidebar from "../../components/CategorySidebar";
import { mockCatImage } from "../../utils/mockImage";
import { ABOUT_TITLE, BLOCKS, POSTS, type Block } from "../../data/aboutContent";

const fill = (s: string) => s.replace(/\{company\}/g, config.company.name).replace(/\{brand\}/g, config.name);

// Hiển thị **đậm** và [liên kết](url) trong chữ
function Inline({ text }: { text: string }) {
  const parts = fill(text).split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((s, i) => {
        const b = s.match(/^\*\*(.+)\*\*$/);
        if (b) return <strong key={i}>{b[1]}</strong>;
        const l = s.match(/^\[(.+)\]\((.+)\)$/);
        if (l) {
          return l[2].startsWith("/")
            ? <Link key={i} to={l[2]}>{l[1]}</Link>
            : <a key={i} href={l[2]} target="_blank" rel="noreferrer">{l[1]}</a>;
        }
        return <Fragment key={i}>{s}</Fragment>;
      })}
    </>
  );
}

function BlockView({ b }: { b: Block }) {
  const tel = config.phone.replace(/\s/g, "");
  switch (b.type) {
    case "h2":
      return <h2><Inline text={b.text} /></h2>;
    case "p":
      return <p><Inline text={b.text} /></p>;
    case "ul":
      return <ul>{b.items.map((t, i) => <li key={i}><Inline text={t} /></li>)}</ul>;
    case "gallery":
      return (
        <figure className="ab-gal">
          <div className="ab-gal-g">
            {b.images.map((im) => (
              <img key={im.alt} src={im.src || mockCatImage(im.alt)} alt={im.alt} loading="lazy" />
            ))}
          </div>
          {b.caption && <figcaption>{fill(b.caption)}</figcaption>}
        </figure>
      );
    case "cta":
      return (
        <div className="ab-cta">
          <div><b>{fill(b.title)}</b><span>{fill(b.text)}</span></div>
          <div className="ab-cta-btns">
            <a className="btn" href={`tel:${tel}`}>Gọi {config.phone}</a>
            <Link className="ab-ghost" to="/contact">Gửi yêu cầu</Link>
          </div>
        </div>
      );
  }
}

export default function About() {
  return (
    <div className="about">
      <div className="about-side">
        <CategorySidebar />
        <div className="sidecat">
          <h3 className="sidecat-h">Bài viết mới</h3>
          <ul className="postlist">
            {POSTS.map((p) => (
              <li key={p.title}>
                {p.to.startsWith("/")
                  ? <Link to={p.to}>{p.title}</Link>
                  : <a href={p.to} onClick={(e) => p.to === "#" && e.preventDefault()}>{p.title}</a>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <article className="about-main">
        <p className="eyebrow sm">GIỚI THIỆU</p>
        <h1>{fill(ABOUT_TITLE)}</h1>
        {BLOCKS.map((b, i) => <BlockView key={i} b={b} />)}
      </article>
    </div>
  );
}
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { STRIP_IMAGES, STRIP_SPEED, STRIP_TITLE } from "../data/stripImages";
import { mockCatImage } from "../utils/mockImage";

export default function ImageStrip() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0); // quãng đường phải chạy: chiều rộng dải ảnh trừ chiều rộng khung

  useEffect(() => {
    const w = wrap.current, t = track.current;
    if (!w || !t) return;
    const measure = () => setShift(Math.max(0, Math.round(t.offsetWidth - w.clientWidth)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(w);
    ro.observe(t);
    return () => ro.disconnect();
  }, []);

  if (!STRIP_IMAGES.length) return null;

  // Ít ảnh đến mức vừa khung thì shift = 0: không chạy
  const moving = shift > 0;
  const dur = Math.max(6, shift / STRIP_SPEED);

  return (
    <section className="strip">
      <div className="container">
        {STRIP_TITLE && <h2 className="strip-title">{STRIP_TITLE}</h2>}
        <div className="strip-wrap" ref={wrap}>
          <div
            ref={track}
            className={moving ? "strip-track moving" : "strip-track"}
            style={{ "--shift": `-${shift}px`, "--dur": `${dur}s` } as CSSProperties}
          >
            {STRIP_IMAGES.map((im, i) => {
              const img = <img src={im.src || mockCatImage(im.alt)} alt={im.alt} draggable={false} decoding="async" />;
              return im.to
                ? <Link key={i} to={im.to} className="strip-item">{img}</Link>
                : <div key={i} className="strip-item">{img}</div>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
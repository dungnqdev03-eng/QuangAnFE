import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { mockCatImage } from "../utils/mockImage";

// ===== GÁN ẢNH TẠI ĐÂY =====
// Thứ tự trong mảng là thứ tự trình chiếu.
// src: dán link ảnh (Cloudinary, hoặc "/ten-anh.jpg" nếu ảnh nằm trong thư mục public). Để "" thì hiện hình minh họa.
// to: (không bắt buộc) bấm vào ảnh sẽ đi tới trang này, ví dụ "/catalog" hoặc "/product/2".
const IMAGES: { src?: string; alt: string; to?: string }[] = [
  { src: "https://res.cloudinary.com/odufc811/image/upload/v1793593909/1793593709712_125562276064224294_4257786273992177294_649dd53c4ce313c3b1c39d1951b5b2f5.jpg", alt: "Trụ đèn" },
  { src: "https://res.cloudinary.com/odufc811/image/upload/v1793593909/1793593730293_125562276064224294_4257786273992177294_c275832776e4fb3f4a7458322716e3e8.jpg", alt: "Đèn năng lượng mặt trời" },
  { src: "https://res.cloudinary.com/odufc811/image/upload/v1793612746/1793612686708_125562276064224294_4257786273992177294_5814588cf12937eac01968321bb222db.jpg", alt: "Hộ lan" },
  { src: "https://res.cloudinary.com/odufc811/image/upload/v1793593909/1793593811666_125562276064224294_4257786273992177294_eba22e36bb557d79dc57af5ea3f28d96.jpg", alt: "Bu lông móng" },
  { src: "https://res.cloudinary.com/odufc811/image/upload/v1793612746/1793612686681_125562276064224294_4257786273992177294_df9ea23f53f6bc69f23333bd04fa2c19.jpg", alt: "Gia công cơ khí" },
];  
const INTERVAL = 4500; // thời gian dừng ở mỗi ảnh (mili giây)

export default function ImageStrip() {
  const n = IMAGES.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);

  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n]);

  // Tự chuyển ảnh. Mỗi lần đổi ảnh (kể cả bấm tay) thì tính lại thời gian chờ
  useEffect(() => {
    if (n < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((v) => (v + 1) % n), INTERVAL);
    return () => clearTimeout(t);
  }, [i, paused, n]);

  if (!n) return null;

  return (
    <section className="sl">
      <div className="container">
        <div
          className="sl-box"
          role="region"
          aria-roledescription="carousel"
          aria-label="Hình ảnh nổi bật"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={(e) => { setPaused(true); startX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (startX.current !== null) {
              const dx = e.changedTouches[0].clientX - startX.current;
              if (Math.abs(dx) > 50) go(dx < 0 ? i + 1 : i - 1); // vuốt trái = ảnh sau
            }
            startX.current = null;
            setPaused(false);
          }}
        >
          {IMAGES.map((im, k) => {
            const img = (
              <img
                src={im.src || mockCatImage(im.alt)}
                alt={im.alt}
                draggable={false}
                loading={k === 0 ? "eager" : "lazy"}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = mockCatImage(im.alt); }}
              />
            );
            return (
              <div key={k} className={k === i ? "sl-slide on" : "sl-slide"} aria-hidden={k !== i}>
                {im.to ? <Link to={im.to} tabIndex={k === i ? 0 : -1}>{img}</Link> : img}
              </div>
            );
          })}

          {n > 1 && (<>
            <button className="sl-arrow left" onClick={() => go(i - 1)} aria-label="Ảnh trước">‹</button>
            <button className="sl-arrow right" onClick={() => go(i + 1)} aria-label="Ảnh sau">›</button>
            <div className="sl-dots">
              {IMAGES.map((im, k) => (
                <button key={k} className={k === i ? "on" : ""} onClick={() => go(k)} aria-label={`Ảnh ${k + 1}: ${im.alt}`} />
              ))}
            </div>
          </>)}
        </div>
      </div>
    </section>
  );
}
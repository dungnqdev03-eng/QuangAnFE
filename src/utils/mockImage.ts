// Ảnh minh họa (mock) cho danh mục, vẽ bằng SVG theo tên danh mục. Không cần file ảnh.
const strip = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();

const DEFS = `<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1d3f6e"/><stop offset="1" stop-color="#0b2545"/></linearGradient>
<radialGradient id="h"><stop offset="0" stop-color="#ff9f1c" stop-opacity=".85"/><stop offset="1" stop-color="#ff9f1c" stop-opacity="0"/></radialGradient>
</defs><rect width="480" height="270" fill="url(#g)"/>`;

// Trụ đèn, cần đèn
const LAMP = `<circle cx="300" cy="75" r="95" fill="url(#h)"/>
<rect x="186" y="70" width="10" height="190" rx="3" fill="#e2e8f0"/>
<path d="M191 80 Q191 50 225 50 L290 50" stroke="#e2e8f0" stroke-width="8" fill="none" stroke-linecap="round"/>
<rect x="276" y="45" width="56" height="15" rx="7" fill="#ff6b35"/>
<rect x="158" y="252" width="66" height="8" rx="3" fill="#94a3b8"/>`;

// Đèn năng lượng mặt trời
const SOLAR = `<circle cx="360" cy="70" r="90" fill="url(#h)"/>
<circle cx="360" cy="70" r="26" fill="#ff9f1c"/>
<circle cx="360" cy="70" r="40" fill="none" stroke="#ff9f1c" stroke-width="6" stroke-dasharray="4 14" stroke-linecap="round"/>
<polygon points="110,205 280,205 320,140 150,140" fill="#16345d" stroke="#e2e8f0" stroke-width="4"/>
<path d="M130,172 L300,172 M205,140 L195,205 M262,140 L240,205" stroke="#94a3b8" stroke-width="3"/>
<rect x="190" y="205" width="10" height="50" fill="#e2e8f0"/><rect x="160" y="252" width="70" height="8" rx="3" fill="#94a3b8"/>`;

// Hộ lan, lan can
const RAIL = `<rect x="40" y="118" width="400" height="28" rx="6" fill="#cbd5e1"/>
<rect x="40" y="158" width="400" height="28" rx="6" fill="#e2e8f0"/>
<rect x="90" y="100" width="16" height="140" rx="3" fill="#94a3b8"/>
<rect x="232" y="100" width="16" height="140" rx="3" fill="#94a3b8"/>
<rect x="374" y="100" width="16" height="140" rx="3" fill="#94a3b8"/>
<rect x="120" y="126" width="22" height="12" rx="2" fill="#ff6b35"/><rect x="262" y="126" width="22" height="12" rx="2" fill="#ff6b35"/><rect x="404" y="126" width="22" height="12" rx="2" fill="#ff6b35"/>`;

// Bu lông
const BOLT = `<circle cx="250" cy="135" r="110" fill="url(#h)" opacity=".5"/>
<polygon points="215,135 192,175 148,175 125,135 148,95 192,95" fill="#ff6b35"/>
<rect x="205" y="115" width="175" height="40" fill="#cbd5e1"/>
${Array.from({ length: 11 }, (_, i) => `<line x1="${225 + i * 14}" y1="115" x2="${215 + i * 14}" y2="155" stroke="#64748b" stroke-width="3"/>`).join("")}`;

// Mặc định: bánh răng cơ khí
const GEAR = `<circle cx="240" cy="135" r="110" fill="url(#h)" opacity=".5"/>
<circle cx="240" cy="135" r="68" fill="none" stroke="#cbd5e1" stroke-width="22" stroke-dasharray="15 15"/>
<circle cx="240" cy="135" r="56" fill="#cbd5e1"/>
<circle cx="240" cy="135" r="24" fill="#0b2545" stroke="#ff6b35" stroke-width="8"/>`;

export function mockCatImage(name: string): string {
  const k = strip(name);
  let art = GEAR;
  if (/mat troi|nang luong/.test(k)) art = SOLAR;
  else if (/ho can|lan can|ho lan/.test(k)) art = RAIL;
  else if (/bu ?long|mong/.test(k)) art = BOLT;
  else if (/den|tru/.test(k)) art = LAMP;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 270">${DEFS}${art}</svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
import config from "../../app-config.json";

// Nút nào chưa điền link trong app-config.json thì tự ẩn
const cfg = config as { phone: string; zalo?: string; messenger?: string };

export default function FloatingContact() {
  const tel = cfg.phone.replace(/\s/g, "");
  return (
    <div className="fc">
      {cfg.messenger && (
        <a className="fc-btn fc-mess" href={cfg.messenger} target="_blank" rel="noreferrer" aria-label="Chat Messenger">
          <span className="fc-ic">
            <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#fff" d="M12 2C6.48 2 2 6.14 2 11.25c0 2.9 1.45 5.48 3.72 7.17V22l3.4-1.87c.9.25 1.86.39 2.88.39 5.52 0 10-4.14 10-9.27S17.52 2 12 2z" />
              <polygon fill="#0078ff" points="5.7,14.5 9.9,10 12.5,12.5 18.3,9.8 14,14.4 11.4,11.9" />
            </svg>
          </span>
        </a>
      )}

      {cfg.zalo && (
        <a className="fc-btn fc-zalo" href={cfg.zalo} target="_blank" rel="noreferrer" aria-label="Chat Zalo">
          <span className="fc-ic">
            <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
              <path fill="#fff" d="M16 4C9.4 4 4 8.6 4 14.3c0 3.1 1.6 5.9 4.2 7.8-.1 1.4-.6 2.9-1.6 4.1 2.2-.2 4-1 5.3-2 1.3.4 2.7.6 4.1.6 6.6 0 12-4.6 12-10.3S22.6 4 16 4z" />
              <text x="16" y="17.5" textAnchor="middle" fontSize="9" fontWeight="800" fill="#0068ff" fontFamily="Arial, sans-serif">Zalo</text>
            </svg>
          </span>
        </a>
      )}

      <a className="fc-btn fc-tel" href={`tel:${tel}`} aria-label={`Gọi ${cfg.phone}`}>
        <span className="fc-ic">
          <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#fff" d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
          </svg>
        </span>
        <span className="fc-num">{cfg.phone}</span>
      </a>
    </div>
  );
}
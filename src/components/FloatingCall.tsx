import config from "../../app-config.json";

export default function FloatingCall() {
  const tel = config.phone.replace(/\s/g, "");
  return (
    <a href={`tel:${tel}`} className="fcall" aria-label="Gọi hotline">
      <span className="fcall-ic">📞</span>
      <b>{config.phone}</b>
    </a>
  );
}
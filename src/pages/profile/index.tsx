import config from "../../../app-config.json";
export default function Profile() {
  return (<div><h2>Liên hệ</h2><p>📍 {config.address}</p><p>📞 {config.phone}</p><p>✉️ {config.email}</p>
    <a className="btn" href={config.zalo} target="_blank">Chat Zalo</a></div>);
}

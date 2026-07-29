import "./switch.css";

export function Switch({ isOn, onToggle, label }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={isOn} onChange={onToggle} />
      <span className="slider" />
      <span className="text">{label}</span>
    </label>
  );
}

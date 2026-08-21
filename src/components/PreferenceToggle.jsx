export default function PreferenceToggle({ label, description, enabled, onChange, disabled }) {
  return (
    <label className={`podc-pref-toggle ${disabled ? 'is-disabled' : ''}`}>
      <div className="podc-pref-toggle-info">
        <span className="podc-pref-toggle-label">{label}</span>
        {description && <span className="podc-pref-toggle-desc">{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        disabled={disabled}
        className={`podc-toggle-switch ${enabled ? 'is-on' : ''}`}
        onClick={() => !disabled && onChange(!enabled)}
      >
        <span className="podc-toggle-knob" />
      </button>
    </label>
  );
}

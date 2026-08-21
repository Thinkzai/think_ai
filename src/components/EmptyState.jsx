export default function EmptyState({ icon, title, hint, actionLabel, onAction, resetLabel, onReset }) {
  return (
    <div className="podc-empty-state" role="status">
      {icon || (
        <svg className="podc-empty-icon" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <p className="podc-empty-title">{title}</p>
      {hint && <p className="podc-empty-hint">{hint}</p>}
      <div className="podc-empty-actions">
        {onReset && resetLabel && (
          <button className="podc-btn podc-btn-ghost" type="button" onClick={onReset}>
            {resetLabel}
          </button>
        )}
        {onAction && actionLabel && (
          <button className="podc-btn podc-btn-primary" type="button" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

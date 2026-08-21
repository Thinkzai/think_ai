export default function LoadingState({ message = 'Loading\u2026' }) {
  return (
    <div className="podc-loading" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

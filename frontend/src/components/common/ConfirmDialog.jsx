export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        <h3 style={styles.title}>{title}</h3>
        {message && <p style={styles.message}>{message}</p>}
        <div style={styles.actions}>
          <button onClick={onCancel} style={styles.cancelBtn}>
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={danger ? styles.dangerBtn : styles.confirmBtn}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
  },
  box: {
    background: "#fff", borderRadius: 8, padding: "20px 24px",
    width: "90%", maxWidth: 360, boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
  },
  title: { margin: 0, marginBottom: 8, fontSize: 18 },
  message: { margin: "8px 0 20px", color: "#444", fontSize: 14 },
  actions: { display: "flex", justifyContent: "flex-end", gap: 10 },
  cancelBtn: {
    padding: "8px 14px", border: "1px solid #ccc", borderRadius: 6,
    background: "#fff", cursor: "pointer",
  },
  confirmBtn: {
    padding: "8px 14px", border: "none", borderRadius: 6,
    background: "#2563eb", color: "#fff", cursor: "pointer",
  },
  dangerBtn: {
    padding: "8px 14px", border: "none", borderRadius: 6,
    background: "#dc2626", color: "#fff", cursor: "pointer",
  },
};
// Confirmation dialog rendered as Bootstrap modal
export default function ConfirmDialog({ show, title, message, onConfirm, onCancel, confirmText = 'Delete', confirmVariant = 'danger' }) {
  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title fw-semibold">
              <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
              {title || 'Confirm Action'}
            </h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body text-muted">{message || 'Are you sure you want to proceed?'}</div>
          <div className="modal-footer border-0">
            <button className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
            <button className={`btn btn-${confirmVariant} btn-sm`} onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// frontend/src/components/donor/ConfirmDeleteModal.jsx
import React from 'react';
import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content confirm-delete" onClick={(e) => e.stopPropagation()}>
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this donation?</p>
        <p className="warning">This action cannot be undone. All associated claims will also be removed.</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
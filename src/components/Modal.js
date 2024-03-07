// Modal.js
import React from 'react';
import '../Modal.css';

const Modal = ({ isOpen, onClose, onConfirm }) => {
  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal">
          <p>Sigur dorești să ștergi această rețetă?</p>
          <button onClick={onConfirm}>Da</button>
          <button onClick={onClose}>Nu</button>
        </div>
      </div>
    )
  );
};

export default Modal;

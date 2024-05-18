// Modal.js
import React from 'react';
import '../Stilizare/Modal.css';

const Modal = ({ isOpen, onClose, onConfirm }) => {
  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal">
          <p>Sigur dorești să ștergi?</p>
          <button className='buton-modal' onClick={onConfirm}>Da</button>
          <button className='buton-modal' onClick={onClose}>Nu</button>
        </div>
      </div>
    )
  );
};

export default Modal;

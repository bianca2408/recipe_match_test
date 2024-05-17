import React from 'react';
import '../ImageModal.css';

const ImageModal = ({ imageUrl, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>
                <img src={imageUrl} alt="Full View" className="modal-image" />
            </div>
        </div>
    );
};

export default ImageModal;

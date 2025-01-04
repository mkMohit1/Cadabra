import React, { useState, useEffect } from 'react';
import "../styles/ConsultationPopup.scss";

const ConsultationPopup = ({ isOpen, onClose }) => {
  // State to store the current value of the input field
  const [currentValue, setCurrentValue] = useState(''); // Initialize as an empty string

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle arrow button click (add your logic here)
  const handleArrowClick = () => {
    console.log('Arrow clicked with value:', currentValue);
    // You can add any logic you want here, e.g., submitting the value
  };
  // Don't render the popup if it is not open
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-paper-container">
        {/* Close button */}
        <button 
          className="close-btn" 
          onClick={onClose} 
          aria-label="Close popup">
          ×
        </button>
        <div className="paper-content">            
          <div className="input-group">
            {/* Input field */}
            <input 
              type="text" 
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="number-input"
              // Background color changes based on whether input is empty
              style={{ backgroundColor: currentValue.trim().length > 0 ? "#f6f3ec" : "transparent" }}
              aria-label="Enter a value"
            />
            {/* Arrow button */}
            <button 
              className="submit-arrow" 
              onClick={handleArrowClick} 
              aria-label="Submit">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPopup;

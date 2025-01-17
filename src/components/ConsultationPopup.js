import React, { useState, useEffect } from 'react';
import "../styles/ConsultationPopup.scss";

const ConsultationPopup = ({ isOpen, onClose }) => {
  const [currentValue, setCurrentValue] = useState('');

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

  const handleArrowClick = () => {
    console.log('Arrow clicked with value:', currentValue);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 popup-overlay bg-black bg-opacity-50 flex items-center justify-center z-50 md:mt-[80px] p-4">
      <div className="relative bg-center bg-no-repeat bg-cover w-full max-w-md md:max-w-sm h-96 rounded-lg popup-paper-container">
        {/* Close Button */}
        <button
          className="absolute top-[-15px] right-[-15px] w-8 h-8 rounded-full bg-black text-white text-lg flex items-center justify-center cursor-pointer hover:bg-gray-800 transition"
          onClick={onClose}
          aria-label="Close popup"
        >
          ×
        </button>
        <div className="p-8 sm:p-6 h-full flex flex-col justify-end">
          <div className="relative w-full h-12 mt-4 flex items-center">
            <input
              type="text"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className={`w-full h-full px-4 py-2 border-none text-sm font-medium uppercase outline-none ${currentValue.trim() ? 'bg-[#f6f3ec]' : 'bg-transparent'}`}
              aria-label="Enter a value"
            />
            <button
              className="absolute right-4 md:-top-[33px] 
                  md:right-[31px]
                  xs:right-[14px] xs:top-[-8px] 
                  xxs:right-[-2px] xxs:top-[-24px] 
                  xxxs:right-[-30px] xxxs:top-[-24px] 
                  h-[2.2rem] w-[2rem] bg-[#fbcadd] border border-gray-700 text-gray-700 
                  flex items-center justify-center text-lg font-semibold hover:bg-[#f9b0c4] transition
              "
              onClick={handleArrowClick}
              aria-label="Submit"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPopup;

import React, { useState, useEffect } from 'react';
import "../styles/ConsultationPopup.scss";
import { event } from 'jquery';
import { errorToast, successToast } from '../DecryptoAndOther/ToastUpdate';

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

  const handleArrowClick = async(event) => {
    event.preventDefault();
    if (!currentValue.trim() && currentValue.length !== 10) {
      errorToast('Please enter a valid mobile number.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobileNumber: currentValue }),
      });
      const data = await response.json();
      if (!response.ok) {
        errorToast( data.message || 'Failed to submit. Please try again later.');
        onClose();
        return;
      }
      if(response.ok){
        successToast(data.message || 'Submitted successfully!');
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
    }

    console.log('Arrow clicked with value:', currentValue);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 popup-overlay bg-black bg-opacity-50 flex items-center justify-center z-50 md:mt-[80px] p-4">
      <div className="relative bg-center bg-no-repeat bg-cover w-full max-w-md md:max-w-sm h-96 rounded-lg popup-paper-container">
        {/* Close Button */}
        <button
          className="absolute top-[-15px] right-[-15px] w-8 h-8
          xs:-top-[10px]
          xxs:top-[10px]
          xxxs:top-[40px]
          rounded-full bg-black text-white text-lg flex items-center justify-center cursor-pointer hover:bg-gray-800 transition"
          onClick={onClose}
          aria-label="Close popup"
        >
          ×
        </button>
        <div className="p-8 sm:p-6 h-full flex flex-col justify-end">
          <div className="relative w-full h-12 mt-4 flex items-center">
            <input
              type="tel"
              value={currentValue}
              pattern="[0-9]{10}"   //Only allow 10-digit numbers
              maxlength="10"
              onChange={(e) => setCurrentValue(e.target.value)}
              className={`w-[75%] absolute z-10 md:h-[90%]
                 md:-top-[38px] md:w-[75%] md:left-[20px]
                xs:-top-[30px] xs:left-[15px] xs:w-[78%] xs:h-[90%]
                xxs:-top-[40px] xxs:left-[7px] xxs:w-[82%] xxs:h-[80%]
                xxxs:-top-[52px] xxxs:-left-[0] xxxs:w-[85%] xxxs:h-[66%]
                 
                  
                 
                 left-[20px]  px-4 py-2 border-none text-sm font-medium uppercase outline-none ${currentValue.trim() ? 'bg-[#f6f3ec]' : 'bg-transparent'}`}
              aria-label="Enter a value"
            />
            <button
              className="absolute right-4 md:-top-[33px] 
                  md:right-[31px]
                  xs:right-[22px] xs:top-[-25px] xs:w-[33px] xs:h-[35px]
                  xxs:right-[15px] xxs:top-[-35px] xxs:w-[27px] xxs:h-[30px]
                  xxxs:right-[6px] xxxs:top-[-48px] xxxs:w-[25px] xxxs:h-[25px]
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

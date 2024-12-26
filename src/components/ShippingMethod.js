import React, { useState } from 'react';
import Calendar from 'react-calendar'; // Import react-calendar
import 'react-calendar/dist/Calendar.css'; // Import styles
import { CalendarIcon, ChevronRight } from 'lucide-react';
import '../styles/ShippingMethod.scss';

const formatDate = (date) => {
  if (!date) return '';
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

const ShippingMethod = () => {
  const [selectedMethod, setSelectedMethod] = useState('free');
  const [date, setDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const shippingMethods = [
    {
      id: 'free',
      name: 'Regular Shipment',
      price: 'Free',
      date: '01 Feb, 2023'
    },
    {
      id: 'priority',
      name: 'Priority Shipping',
      price: '$8.50',
      date: '28 Jan, 2023'
    },
    {
      id: 'schedule',
      name: 'Choose a date that works for you',
      price: 'Schedule',
      customDate: true
    }
  ];

  return (
    <div className="shipping-container">
      <div className="progress-bar">
        <span className="progress-bar__step">Address</span>
        <ChevronRight className="progress-bar__arrow" />
        <span className="progress-bar_step progress-bar_step--active">Shipping</span>
        <ChevronRight className="progress-bar__arrow" />
        <span className="progress-bar__step">Payment</span>
      </div>

      <div className="shipping-methods">
        <h2 className="shipping-methods__title">Shipment Method</h2>
        
        <div className="shipping-methods__list">
          {shippingMethods.map((method) => (
            <div
              key={method.id}
              className={`shipping-methods__option ${
                selectedMethod === method.id ? 'shipping-methods__option--selected' : ''
              }`}
            >
              <div className="option-content">
                <input
                  type="radio"
                  id={method.id}
                  name="shipping"
                  checked={selectedMethod === method.id}
                  onChange={() => setSelectedMethod(method.id)}
                />
                <div className="option-content__info">
                  <span className="price">{method.price}</span>
                  <span className="name">{method.name}</span>
                </div>
              </div>

              {method.customDate ? (
                <div className="date-select">
                  <button 
                    className={`date-select__button ${
                      !date ? 'date-select__button--placeholder' : ''
                    }`}
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  >
                    <CalendarIcon />
                    {date ? formatDate(date) : "Select Date"}
                  </button>
                  {isCalendarOpen && (
                    <div className="calendar-popover">
                      <div className="calendar-popover__content">
                        <Calendar
                          onChange={(selectedDate) => {
                            setDate(selectedDate);
                            setIsCalendarOpen(false);
                          }}
                          value={date}
                          minDate={new Date()} // Disable past dates
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <span className="date-select__text">{method.date}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShippingMethod;

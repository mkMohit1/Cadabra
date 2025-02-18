import React, { useState, useRef, useEffect } from 'react';
import { CalendarIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import { updateCurrentContainer } from '../../redux/cartSlice';
import { useDispatch } from 'react-redux';

// Calendar component remains the same as before, just updating the container styles
const Calendar = ({ onSelect, selectedDate, onClose }) => {
  // ... Previous Calendar code remains exactly the same ...
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateDays = () => {
    const days = [];
    const totalDays = daysInMonth(viewDate);
    const firstDay = firstDayOfMonth(viewDate);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

      days.push(
        <button
          key={day}
          onClick={() => !isPast && onSelect(date)}
          disabled={isPast}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
            ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-100'}
            ${isToday ? 'border border-blue-500' : ''}
            ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));
  };

  const prevMonth = () => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1);
    if (newDate >= new Date(new Date().getFullYear(), new Date().getMonth())) {
      setViewDate(newDate);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-64">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={prevMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-medium">
          {months[viewDate.getMonth()]} {viewDate.getFullYear()}
        </span>
        <button 
          onClick={nextMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="w-8 h-8 flex items-center justify-center text-xs text-gray-500">
            {day}
          </div>
        ))}
        {generateDays()}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

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
  const dispatch = useDispatch();
  const [selectedMethod, setSelectedMethod] = useState('free');
  const [date, setDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    setIsCalendarOpen(false);
  };

  const handleUpdateContainer = (currentMode)=>{
    dispatch(updateCurrentContainer(currentMode));
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 relative">
      {/* Progress Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-sm md:text-base">
      <span className="text-gray-500" onClick={()=>handleUpdateContainer("CartItem")}>Carts</span>
      <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-500" onClick={()=>handleUpdateContainer("AddressContainer")}>Address</span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="font-medium text-blue-600">Shipping</span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-500">Payment</span>
      </div>

      {/* Shipping Methods Container */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-6">Shipment Method</h2>
        
        <div className="space-y-4">
          {shippingMethods.map((method) => (
            <div
              key={method.id}
              className={`border rounded-lg p-4 transition-colors cursor-pointer hover:border-blue-500 ${
                selectedMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="radio"
                    id={method.id}
                    name="shipping"
                    checked={selectedMethod === method.id}
                    onChange={() => setSelectedMethod(method.id)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <span className="font-medium text-blue-600">{method.price}</span>
                    <span className="text-gray-700">{method.name}</span>
                  </div>
                </div>

                {method.customDate ? (
                  <div className="w-full sm:w-auto mt-2 sm:mt-0">
                    <button 
                      className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 ${
                        !date ? 'text-gray-500' : 'text-gray-700'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCalendarOpen(!isCalendarOpen);
                      }}
                    >
                      <CalendarIcon className="w-4 h-4" />
                      <span>{date ? formatDate(date) : "Select Date"}</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-600 w-full sm:w-auto text-right">
                    {method.date}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Centered Calendar Modal */}
      {isCalendarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={calendarRef} className="relative">
            <Calendar 
              selectedDate={date}
              onSelect={handleDateSelect}
              onClose={() => setIsCalendarOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingMethod;
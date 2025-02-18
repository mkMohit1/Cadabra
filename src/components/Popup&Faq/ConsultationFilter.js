import React, { useState } from 'react';
import { FaPlusMinus } from '../../svgComponents/Offer';

const ConsultationFilter = () => {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filterCategories = {
    delivery: { title: 'Delivery', options: ['Same Day Delivery', '2 Days Delivery', '7 Days Delivery'] },
    reviews: { title: 'Customer Reviews', options: ['3 Star', '4 Star', '5 Star'] },
    features: { title: 'Special Features', options: ['Home Camera', 'Night Vision', 'Pan/Tilt', 'Portable', 'Audio Detection'] },
    resolution: { title: 'Resolution', options: ['4K', '2MP', '3MP', '4MP'] },
    connectivity: { title: 'Connectivity', options: ['Wired', 'Wireless'] },
    usage: { title: 'Indoor Outdoor Usage', options: ['Indoor', 'Outdoor'] },
    brand: { title: 'Brand', options: ['Philips', 'Cadabra', 'iMou', 'EZVIZ', 'Dahua', 'Hikvision', 'CP Plus'] },
    discounts: { title: 'Discounts', options: ['All Discounts', 'Deals'] },
    mounting: { title: 'Mounting Type', options: ['Wall Mount', 'Ceiling Mount', 'Door Mount'] },
  };

  const toggleAccordion = (key) => {
    setActiveAccordion(activeAccordion === key ? null : key);
  };

  const FilterGroup = ({ title, options, categoryKey }) => (
    <div className="border rounded-md shadow-sm">
      <button 
        className={`w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 transition ${activeAccordion === categoryKey ? 'bg-gray-200' : ''}`}
        onClick={() => toggleAccordion(categoryKey)}
      >
        {title}
        <span className="float-right">{activeAccordion === categoryKey ? '-' : '+'}</span>
      </button>
      <div className={`px-4 py-2 ${activeAccordion === categoryKey ? 'block' : 'hidden'}`}>
        {options.map((option) => (
          <div key={option} className="flex items-center py-1">
            <input type="checkbox" className="mr-2" />
            <span>{option}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative w-full max-h-xl p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center lg:mb-4 ">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">Filters</h2>
        <button 
          className="lg:hidden text-white px-4 py-2 transition-transform duration-500" 
          onClick={() => setShowFilters(!showFilters)}
          style={{ transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          {<FaPlusMinus mode="circle-chevron-down" className='text-[30px]'/>}
        </button>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-4 ${showFilters ? 'block xxxs:max-h-[210px] xxxs:scrollbar-none xxxs:overflow-y-scroll' : 'hidden'} lg:grid lg:max-h-[460px] lg:scrollbar-none lg:overflow-y-scroll md:grid-cols-2`}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {Object.entries(filterCategories).map(([key, { title, options }]) => (
          <FilterGroup 
            key={key} 
            title={title} 
            options={options} 
            categoryKey={key}
          />
        ))}
        <div className="border rounded-md shadow-sm">
          <button 
            className={`w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 transition ${activeAccordion === 'price' ? 'bg-gray-200' : ''}`}
            onClick={() => toggleAccordion('price')}
          >
            Price Range
            <span className="float-right">{activeAccordion === 'price' ? '-' : '+'}</span>
          </button>
          <div className={`px-4 py-2 ${activeAccordion === 'price' ? 'block' : 'hidden'}`}>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="range"
                min="0"
                max="10000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full sm:w-auto"
              />
              <input
                type="range"
                min="0"
                max="10000"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="w-full sm:w-auto"
              />
            </div>
            <div className="flex justify-between mt-2 text-sm sm:text-base">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationFilter;

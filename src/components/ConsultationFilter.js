import React, { useState } from 'react';
import '../styles/ConsultationFilter.scss';

const ConsultationFilter = () => {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [activeAccordion, setActiveAccordion] = useState(null);

  const  filterCategories= {
    delivery: {
      title: 'Delivery',
      options: ['Same Day Delivery', '2 Days Delivery', '7 Days Delivery']
    },
    reviews: {
      title: 'Customer Reviews',
      options: ['3 Star', '4 Star', '5 Star']
    },
    features: {
      title: 'Special Features',
      options: ['Home Camera', 'Night Vision', 'Pan/Tilt', 'Portable', 'Audio Detection']
    },
    resolution: {
      title: 'Resolution',
      options: ['4K', '2MP', '3MP', '4MP']
    },
    connectivity: {
      title: 'Connectivity',
      options: ['Wired', 'Wireless']
    },
    usage: {
      title: 'Indoor Outdoor Usage',
      options: ['Indoor', 'Outdoor']
    },
    brand: {
      title: 'Brand',
      options: ['Philips', 'Cadabra', 'iMou', 'EZVIZ', 'Dahua', 'Hikvision', 'CP Plus']
    },
    discounts: {
      title: 'Discounts',
      options: ['All Discounts', 'Deals']
    },
    mounting: {
      title: 'Mounting Type',
      options: ['Wall Mount', 'Ceiling Mount', 'Door Mount']
    }
  };

  const toggleAccordion = (key) => {
    setActiveAccordion(activeAccordion === key ? null : key);
  };

  const FilterGroup = ({ title, options, categoryKey }) => (
    <div className="filter-group">
      <button 
        className={`accordion-trigger ${activeAccordion === categoryKey ? 'active' : ''}`}
        onClick={() => toggleAccordion(categoryKey)}
      >
        {title}
        <span className="accordion-icon"></span>
      </button>
      <div className={`accordion-content ${activeAccordion === categoryKey ? 'active' : ''}`}>
        {options.map((option) => (
          <div key={option} className="checkbox-wrapper">
            <label className="checkbox-label">
              <input type="checkbox" className="checkbox-input" />
              <span className="checkbox-custom"></span>
              <span className="option-text">{option}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="consultant-filters">
      <h2 className="filters-title">Filters</h2>
      
      <div className="filters-container">
        {Object.entries(filterCategories).map(([key, { title, options }]) => (
          <FilterGroup 
            key={key} 
            title={title} 
            options={options} 
            categoryKey={key}
          />
        ))}
        
        <div className="filter-group">
          <button 
            className={`accordion-trigger ${activeAccordion === 'price' ? 'active' : ''}`}
            onClick={() => toggleAccordion('price')}
          >
            Price Range
            <span className="accordion-icon"></span>
          </button>
          <div className={`accordion-content ${activeAccordion === 'price' ? 'active' : ''}`}>
            <div className="price-range-container">
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="range-slider"
                />
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="range-slider"
                />
              </div>
              <div className="price-display">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationFilter;
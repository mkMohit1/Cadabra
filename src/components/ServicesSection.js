import React from 'react';
import '../styles/ServicesSection.scss';
import serviceImg from '../ImagePath';

const services = [
  {
    title: 'CCTV Surveillance',
    subText: 'For Homes & Businesses',
    description: 'Explore page',
  },
  {
    title: 'Alarm Systems',
    subText: 'For Homes & Businesses',
    description: 'Explore page',
  },
  {
    title: 'Displays & TVs',
    subText: 'For Homes & Businesses',
    description: 'Explore page',
  },
];

const ServicesSection = () => {
  return (
    <div className="services-section">
      <p>Products</p>
      <h2>Thousands of options Ready to Rent!</h2>
      <div className="services-container">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <img src={serviceImg[index]} alt={service.title} className="service-img" />
            <h3>{service.title}</h3>
            <p>{service.subText}</p>
            <a href="/" className="service-link">
              {service.description} →
            </a>
            <hr/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;

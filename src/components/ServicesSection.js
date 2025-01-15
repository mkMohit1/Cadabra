import React from 'react';
import '../styles/ServicesSection.scss';
import serviceImg from '../ImagePath';

const services = [
    {
    title: 'Alarm Systems',
    subText: 'For Homes & Businesses',
    description: '->',
  },
  {
    title: 'CCTV Surve.',
    subText: 'For Homes & Businesses',
    description: '->',
  },
  {
    title: 'Displays & TVs',
    subText: 'For Homes & Businesses',
    description: '->',
  },
];

const ServicesSection = () => {
  return (
    <div className="services-section font-mulish">
      <h2>Thousands of options Ready to Rent!</h2>
      <div className="services-container">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <img src={serviceImg[index]} alt={service.title} className="service-img" />
            <h3>{service.title}</h3>
            <p>{service.subText}</p>
            <a href="/" className="service-link">
              {service.description}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;

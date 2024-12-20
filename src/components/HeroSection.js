import React from 'react';
import '../styles/HeroSection.scss';
import { normalImages } from '../ImagePath';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="hero-section">
      <div className='hero-content'>
      <h1>
        India’s <span>#1</span> SaaP based Security System Company
      </h1>
      <p>
        Get Security System booked in just 2 minutes hassle free. 
        Easy Monthly Rental, No Credit Card required.
      </p>
      <div className="hero-buttons">
        <button className="buy-btn"><Link to={'/Rent'} className='linkRent'>Rent Today</Link></button>
        <button className="explore-btn">Why Rent?</button>
      </div>
      </div>
      <div className="charts">
        <div className="chart-box"><img src={normalImages.chartHero1}/></div>
        <div className="chart-box" style={{backgroundImage: `url(${normalImages.chartHero3Bg})`}}><img src={normalImages.chartHero3}/></div>
        <div className="chart-box"><img src={normalImages.chartHero2}/></div>
      </div>
      <div className='topBgCircle'></div>
    </div>
  );
};

export default HeroSection;

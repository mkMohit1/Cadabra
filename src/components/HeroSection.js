import React from "react";
import "../styles/HeroSection.scss";
import { normalImages } from "../ImagePath";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="font-extrabold font-mulish md:text-lg sm:text-sm">Protect your Property</h1>
        <p className="font-bold font-mulish">now on <span className="monthly">Monthly Rental</span> </p>
        <div className="hero-buttons">
          <button className="buy-btn font-mulish">
            <Link to={"/Rent"} className="linkRent">
              <span className="font-mulish button-text">Rent Today</span>
            </Link>
          </button>
          {/* <button className="explore-btn">Why Rent?</button> */}
        </div>
      </div>
      {/* <div className="charts">
        <div className="chart-box"><img src={normalImages.chartHero1}/></div>
        <div className="chart-box" style={{backgroundImage: `url(${normalImages.chartHero3Bg})`}}><img src={normalImages.chartHero3}/></div>
        <div className="chart-box"><img src={normalImages.chartHero2}/></div>
      </div> */}
      <div className="topBgCircle"></div>
    </div>
  );
};

export default HeroSection;

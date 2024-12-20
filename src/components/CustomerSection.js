import React from 'react';
import '../styles/CustomerSection.scss';
import {normalImages} from "../ImagePath";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faPenNib } from '@fortawesome/free-solid-svg-icons';
import {faEye, faSun} from "@fortawesome/free-regular-svg-icons";

const CustomerSection = () => {
  return (
    <div className="customer-section">
      <div className="customer-container">
        {/* Top Section */}
        <div className="customer-row">
          <div className="customer-card">
            <img
              src={normalImages.onPhoneCall2} // Replace with actual image path
              alt="Customer Engagement"
              className="customer-img"
            />
            <div className="chart-overlay">
                <div className='chart-overlay-img'>
                <img src={normalImages.chart} alt='chart-image' />
                </div>                
              <div className="chart">
                <p>30%</p>
                <p>More income in June</p>
              </div>
            </div>
          </div>
          <div className="customer-text">
            <h2>We make security affordable by offering simple and flexible rental options for you</h2>
            <ul>
              <li><FontAwesomeIcon icon={faCheckCircle} style={{color:"#0a2640"}} className='faicon'/>Select product(s) from Cadabra Marketplace.</li>
              <li><FontAwesomeIcon icon={faCheckCircle} style={{color:"#0a2640"}} className='faicon'/>Accept Rental, Tenure & Agreement.</li>
              <li><FontAwesomeIcon icon={faCheckCircle} style={{color:"#0a2640"}} className='faicon'/>Work Order processed at our hub.</li>
            </ul>
            <button className="start-btn">Try now</button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="customer-row">
          <div className="customer-text">
            <h2>We connect our customers with expert security advisors to help them design tailored security solutions</h2>
            <ul>
              <li><FontAwesomeIcon icon={faPenNib} style={{color:"white"}} className='faicon'/>We connect our customers with Security Experts.</li>
              <li><FontAwesomeIcon icon={faEye} style={{color:"#0a2640"}} className='faicon'/>Consultant-led projects for your dream space.</li>
              <li><FontAwesomeIcon icon={faSun} style={{color:"#0a2640"}} className='faicon'/>Enterprise End-to-End Security Solutions</li>
            </ul>
          </div>
          <div className="customer-card">
            <img
              src={normalImages.onPhoneCall} // Replace with actual image path
              alt="Customer Collaboration"
              className="customer-img"
            />
            <div className="chart-overlay">
            <div className='chart-overlay-img'>
                <img src={normalImages.chart2} alt='chart-image' />
                </div>
              <div className="chart">
                <ul>
                <li className='dot1'>Residential Security Planning</li>
                <li className='dot2'>Security Advisor contribution</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSection;

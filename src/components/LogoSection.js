import React from 'react';
import '../styles/LogoSection.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartPie} from '@fortawesome/free-solid-svg-icons';
import {logoSection} from '../ImagePath';
const LogosSection = () => {
  const logos = logoSection;
  const Icons = ['',faChartPie,'',faChartPie,'',faChartPie];
  return (
    <div className="logos-section">
      {logos.map((logo, index) => (
        <div key={index} className="logo-item">          
          {<img src={logo} alt={`logo${index}`} className='logo'/>}
        </div>
      ))}
    </div>
  );
};

export default LogosSection;

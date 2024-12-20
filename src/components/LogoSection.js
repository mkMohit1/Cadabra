import React from 'react';
import '../styles/LogoSection.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartPie} from '@fortawesome/free-solid-svg-icons';
const LogosSection = () => {
  const logos = ['Boldo', 'Presto', 'Boldo', 'Presto', 'Boldo', 'Pres'];
  const Icons = ['',faChartPie,'',faChartPie,'',faChartPie];
  return (
    <div className="logos-section">
      {logos.map((logo, index) => (
        <div key={index} className="logo-item">
          {Icons[index]!=''?<FontAwesomeIcon icon={Icons[index]} />:null}          
          {logo}
        </div>
      ))}
    </div>
  );
};

export default LogosSection;

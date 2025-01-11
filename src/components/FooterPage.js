import React from "react";
import "../styles/FooterPage.scss";
import {mainLogo} from '../ImagePath';
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <div className="footer-logo"><img src={mainLogo.mainLogo2} alt="footerLogo"/></div>
        <p className="footer-text">
        Cadabra Secure offers a wide range of security solutions for sale and rent across India. We provide affordable, reliable protection for homes and businesses.
        </p>
        <p className="footer-copyright">Cadabra Secure 2024. All rights reserved.</p>
      </div>

      <div className="footer-links">
        <div className="footer-column">
          <h3 className="footer-heading">Services</h3>
          <ul>
            <li><NavLink to="/rent">Rent</NavLink></li>
            <li><NavLink to='/rent'>Buy</NavLink></li>
            <li><NavLink to='/CadabraFix'>Cadabra Fix</NavLink></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="footer-heading">Company</h3>
          <ul>
            <li><NavLink to='/about'>About</NavLink></li>
            <li>
            <NavLink to='/Job'>Careers <span className="hiring-badge">Hiring!</span></NavLink>
            </li>
            <li><NavLink to='/blogs'>Blogs</NavLink></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="footer-heading">Resources</h3>
          <ul>
            <li><NavLink to='/experts'>Experts</NavLink></li>
            <li><NavLink to='/media'>Media</NavLink></li>
            <li><NavLink to='/docs'>Docs</NavLink></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

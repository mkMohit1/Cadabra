import React from "react";
import "../styles/FooterPage.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h1 className="footer-logo">B Cadabra</h1>
        <p className="footer-text">
        Cadabra Secure offers a wide range of security solutions for sale and rent across India. We provide affordable, reliable protection for homes and businesses.
        </p>
        <p className="footer-copyright">Cadabra Secure 2024. All rights reserved.</p>
      </div>

      <div className="footer-links">
        <div className="footer-column">
          <h3 className="footer-heading">Services</h3>
          <ul>
            <li>Rent</li>
            <li>Buy</li>
            <li>Cadabra Fix</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="footer-heading">Company</h3>
          <ul>
            <li>About</li>
            <li>
              Careers <span className="hiring-badge">Hiring!</span>
            </li>
            <li>Blogs</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="footer-heading">Resources</h3>
          <ul>
            <li>Experts</li>
            <li>Media</li>
            <li>Docs</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

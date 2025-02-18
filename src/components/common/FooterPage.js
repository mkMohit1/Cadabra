import React,{useRef, useEffect} from "react";
// import "../styles/FooterPage.scss";
import {mainLogo} from '../../ImagePath';
import { NavLink } from "react-router-dom";

const Footer = () => {
  const footerRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (footerRef.current) {
        const footerTop = footerRef.current.getBoundingClientRect().top;

        // Check if footer is in the viewport and value is NOT already stored
        if (footerTop < window.innerHeight && !localStorage.getItem("footerScrollY")) {
          localStorage.setItem("footerScrollY", window.scrollY);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <footer  ref={footerRef} className="py-10 px-6 md:px-16 bg-white text-black font-mulish mx-auto max-w-7xl">
      <div className="flex lg:justify-between flex-col md:flex-row items-center mx-auto max-w-7xl gap-8 md:justify-center">
      <div className=" max-w-md">
        <div className="footer-logo mb-2">
          <img src={mainLogo.mainLogo5} alt="footerLogo" className="w-28"/>
          </div>
        <p className="text-sm text-gray-600 mb-4 xxxs:text-left">
        Cadabra Secure offers a wide range of security solutions for sale and rent across India. We provide affordable, reliable protection for homes and businesses.
        </p>
        <p className="text-sm text-gray-400">Cadabra Secure 2024. All rights reserved.</p>
      </div>

      <div className="grid grid-cols-3  text-center md:grid-cols-3 gap-8 w-full md:max-w-full">
        <div>
          <h3 className="footer-heading font-extrabold text-lg mb-2">Services</h3>
          <ul className="space-y-2">
            <li><NavLink to="/rent" className="tex-sm text-gray-600 hover:text-gray-700">Rent</NavLink></li>
            <li><NavLink to='/rent' className="tex-sm text-gray-600 hover:text-gray-700">Buy</NavLink></li>
            <li><NavLink to='/CadabraFix' className="tex-sm text-gray-600 hover:text-gray-700">Cadabra Fix</NavLink></li>
          </ul>
        </div>
        <div>
          <h3 className="footer-heading font-extrabold text-lg mb-2">Company</h3>
          <ul className="space-y-2">
            <li><NavLink to='/about' className="tex-sm text-gray-600 hover:text-gray-700">About</NavLink></li>
            <li>
            <NavLink to='/Job' className="tex-sm text-gray-600 hover:text-gray-700">Careers <span className="hiring-badge bg-[#65e4a3] text-xs text-white px-2 py-1 rounded-full ml-2 ">Hiring!</span></NavLink>
            </li>
            <li><NavLink to='/blogs' className="tex-sm text-gray-600 hover:text-gray-700">Blogs</NavLink></li>
          </ul>
        </div>
        <div>
          <h3 className="footer-heading font-extrabold text-lg mb-2">Resources</h3>
          <ul className="space-y-2">
            <li><NavLink to='/experts' className="tex-sm text-gray-600 hover:text-gray-700">Experts</NavLink></li>
            <li><NavLink to='/media' className="tex-sm text-gray-600 hover:text-gray-700">Media</NavLink></li>
            <li><NavLink to='/docs' className="tex-sm text-gray-600 hover:text-gray-700">Docs</NavLink></li>
          </ul>
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;

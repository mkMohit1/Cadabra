import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/Navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const Navbar = () => {
  const location = useLocation();
  const activeLink = location.pathname.slice(1) || "Home"; // Determine the current path
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useSelector((state) => state.cart?.totalCartCount || 0);  // Use optional chaining

  // Initialize useNavigate hook for the login button
  const navigate = useNavigate();

  // Function to toggle menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Function to handle log in button click
  const handleLoginClick = () => {
    navigate("/login"); // Correct navigation method for login
  };

  return (
    <nav className="navbar">
      <div className="logo">B Cadabra</div>
      <div className={`nav-links ${menuOpen ? 'close' : 'open'}`}>
        <ul>
          <li>
            <NavLink to="/" className={activeLink === "Home" ? "active" : ""}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/Rent" className={activeLink === "Rent" ? "active" : ""}>
              Rent
            </NavLink>
          </li>
          <li>
            <NavLink to="/Cart" className={activeLink === "Cart" ? "active" : ""}>
              <FontAwesomeIcon
                icon={faCartShopping}
                style={{
                  color: activeLink === "Cart" ? "white" : "orangered",
                  fontSize: 20,
                }}
              />
              {cartCount > 0 ? (
                <div className="totalCounter">{cartCount}</div>
              ) : null}
            </NavLink>
          </li>
          <li>
            <NavLink to="/About" className={activeLink === "About" ? "active" : ""}>
              About
            </NavLink>
          </li>
        </ul>
        <button className="login-btn" onClick={handleLoginClick}>Log In</button> {/* Use handleLoginClick */}
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faBars} />}
      </div>
    </nav>
  );
};

export default Navbar;

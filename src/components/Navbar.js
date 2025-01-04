import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../styles/Navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { mainLogo } from "../ImagePath";

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navbarBackground, setNavbarBackground] = useState("white");
  const [currentMainLogo, setCurrentMainLogo] = useState(mainLogo.mainLogo2);
  const [isFlipping, setIsFlipping] = useState(false);
  const cartCount = useSelector((state) => state.cart?.totalCartCount || 0);
  const [intervalId, setIntervalId] = useState(null);
  const [currentColor, setCurrentColor] = useState("black");

  // Enhanced scroll handler
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY >= 100) {
      setCurrentColor("white");
      setNavbarBackground("hsla(0deg, 0%, 7%, 46%)");
      setCurrentMainLogo(mainLogo.mainLogo1);
      
      // if(currentScrollY>=250 && currentMainLogo !== mainLogo.mainLogo3 && currentMainLogo !== mainLogo.mainLogo4){
      //   setCurrentMainLogo(mainLogo.mainLogo3);
      // }
      // Start interval if not already running
      if (!intervalId) {
        const newIntervalId = setInterval(() => {
          setIsFlipping(true);
          setCurrentMainLogo((prev) =>
            prev === mainLogo.mainLogo2 ? mainLogo.mainLogo1 : mainLogo.mainLogo2
          );
          setTimeout(() => setIsFlipping(false), 500);
        }, 10000);  // Flip logo every 10 seconds

        setIntervalId(newIntervalId);
      }
    } else {
      setNavbarBackground("white");
      setCurrentColor("black");
      setCurrentMainLogo(mainLogo.mainLogo2);
      // Clear interval if scroll position is less than 150
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  };

  // Set up scroll listener
  useEffect(() => {
    const throttledScroll = () => {
      window.requestAnimationFrame(() => {
        handleScroll();
      });
    };

    window.addEventListener("scroll", throttledScroll);
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (intervalId) {
        clearInterval(intervalId); // Clean up interval on unmount
      }
    };
  }, [intervalId]);

  const NavigatetoHome = () => {
    if (location.pathname !== "/") {
      window.location.href = "/";
    }
  };  
  return (
    <nav
      className="navbar"
      style={{ backgroundColor: navbarBackground, transition: "background-color 0.3s ease" }}
    >
      <div className="logo" onClick={NavigatetoHome}>
        <img 
          src={currentMainLogo}
          alt="Logo"
          className={`main-logo ${isFlipping ? "flip-animation" : ""}`}
        />
      </div>

      <div className={`nav-links ${menuOpen ? "open" : "close"}`}>
        <ul>
          <li>
            <NavLink to="/" style={{ color: currentColor }}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/About" style={{ color: currentColor }}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/Contact" style={{ color: currentColor }}>
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink to="/Rent" style={{ color: currentColor }}>
              Rent
            </NavLink>
          </li>
          <li>
            <NavLink to="/Cart" style={{ color: currentColor }}>
              <FontAwesomeIcon
                icon={faCartShopping}
                style={{
                  color:  currentColor,
                  fontSize: 20,
                  fontWeight: 300,
                }}
              />
              {cartCount > 0 && <div className="totalCounter">{cartCount}</div>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/Login" style={{ color: currentColor }}>
              Login
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faBars} />}
      </div>
    </nav>
  );
};

export default Navbar;

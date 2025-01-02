import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";  // Make sure to implement this in your authSlice

const Navbar = () => {
  const location = useLocation();
  const activeLink = location.pathname.slice(1) || "Home"; // Determine the current path
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // For user dropdown
  const cartCount = useSelector((state) => state.cart?.totalCartCount || 0);  // Use optional chaining
  const user = useSelector((state) => state.auth.user); // Assuming user info is in Redux
  const dispatch = useDispatch(); // For dispatching logout action
  const navigate = useNavigate();

  // Toggle the menu for mobile view
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Toggle user dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Handle log in button click
  const handleLoginClick = () => {
    navigate("/login"); // Correct navigation method for login
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action from Redux
    setDropdownOpen(false); // Close dropdown
    navigate("/"); // Navigate to homepage or login page
  };

  // Render the navbar based on user login status
  const renderUserMenu = () => {
    if (user) {
      return (
        <div className="user-info" onClick={toggleDropdown}>
          <img
            src={user.profileImage || "/images/default-avatar.png"}
            alt="User Avatar"
            className="avatar-img"
          />
          <span className="username">{user.name}</span>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item">
                <strong>Email:</strong> {user.email}
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return <button className="login-btn" onClick={handleLoginClick}>Log In</button>;
    }
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
        {/* Render login/logout or user info */}
        {renderUserMenu()}
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faBars} />}
      </div>
    </nav>
  );
};

export default Navbar;

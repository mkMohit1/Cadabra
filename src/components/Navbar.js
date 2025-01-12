import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../styles/Navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars, faCartShopping, faCircleChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { mainLogo, normalImages } from "../ImagePath";
import { logout } from "../redux/authSlice"; // Add your logout action
import { infoToast,errorToast, successToast } from "../DecryptoAndOther/ToastUpdate";

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [navbarBackground, setNavbarBackground] = useState("white");
  const [currentMainLogo, setCurrentMainLogo] = useState(mainLogo.mainLogo2);
  const [isFlipping, setIsFlipping] = useState(false);
  const cartCount = useSelector((state) => state.cart?.totalCartCount || 0);
  const [intervalId, setIntervalId] = useState(null);
  const [currentColor, setCurrentColor] = useState("black");
  const [dropdownOpen, setDropdownOpen] = useState(false); // Track dropdown state
  const [userDetail, setUserDetail]=useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 786) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    const fetchresponse = async()=>{
      try {
        const response = await(await fetch("http://localhost:5000/users")).json();
        const currentuser = response.filter((temp, index)=>temp._id === user.userID);
        // console.log(currentuser); 
        setUserDetail(...currentuser) ;
      } catch (error) {
        console.log('Failed to fetch user');
      }
    } 

    fetchresponse();
    return () => {
      window.removeEventListener("resize", handleResize);
    };

    
  }, []);


  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY >= 100) {
      setCurrentColor("white");
      setNavbarBackground("hsla(0deg, 0%, 7%, 46%)");
      setCurrentMainLogo(mainLogo.mainLogo1);
      
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
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  };

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

  // Handle logout
  const handleLogout = async() => {
    try {
      const response = await fetch('http://localhost:5000/auth/logout');
      console.log(response)
    if(response.ok){
      const data = await response.json();
      successToast(data.message);
      dispatch(logout()); // Dispatch your logout action to clear user session
      setDropdownOpen(false); // Close dropdown on logout
      //window.location.href = "/";
      
    }
    } catch (error) {
      errorToast('Failed to logout');
    }
   
  };
  console.log("navbar",user);
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
        <ul className={menuOpen?"flex flex-col w-full bg-purple-50 mr-3":'flex flex-row'}>
          <li>
            <NavLink to="/" style={{ color: menuOpen?"black":currentColor }} >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/About" style={{ color: menuOpen?"black":currentColor }}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/Contact" style={{ color: menuOpen?"black":currentColor }}>
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink to="/Rent" style={{ color: menuOpen?"black":currentColor }}>
              Rent
            </NavLink>
          </li>
          <li>
            <NavLink to="/Suscription" style={{ color: menuOpen?"black":currentColor }}>
              Suscription
            </NavLink>
          </li>
          <li>
            <NavLink to="/Cart" style={{ color: menuOpen?"black":currentColor }} className="relative">
              <FontAwesomeIcon
                icon={faCartShopping}
                style={{
                  color:  menuOpen?"black":currentColor,
                  fontSize: 20,
                  fontWeight: 300,
                }}
              />
              {cartCount > 0 && <div className={`absolute -top-[18px] -right-[2px] w-[19px] h-[18px] bg-black text-center rounded-full text-white`}>{cartCount}</div>}
            </NavLink>
          </li>
          <li>
            {user ? (
              <div className="userDetail" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="userImage"><img src={userDetail.userImage } alt="userImage" className="rounded-full" /></div>
              <FontAwesomeIcon icon={faCircleChevronDown} className="userDropdown" />
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="user-email">{userDetail.email}</div>
                  <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
            ) :  (
              <NavLink to="/Login" style={{ color: menuOpen?"black":currentColor }}>
                Login
              </NavLink>
              
            )}
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

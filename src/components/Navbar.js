import React, { useState, useEffect, useRef } from "react";
import { Navigate, NavLink, useLocation } from "react-router-dom";
import "../styles/Navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars, faCartShopping, faCircleChevronDown, faSearch, faLocationDot, faLock  } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { mainLogo, normalImages } from "../ImagePath";
import { logout } from "../redux/authSlice"; // Add your logout action
import { infoToast,errorToast, successToast } from "../DecryptoAndOther/ToastUpdate";
import { FaAddress } from "../svgComponents/Offer";


const cities = [
  { name: "Bangalore", icon: "🏛️" },
  { name: "Mumbai", icon: "🕌" },
  { name: "Pune", icon: "🏛️" },
  { name: "Delhi", icon: "🏛️" },
  { name: "Noida", icon: "🏛️" },
  { name: "Gurgaon", icon: "🏢" },
  { name: "Hyderabad", icon: "🏛️" },
  { name: "Chennai", icon: "🏛️" },
  { name: "Ahmedabad", icon: "🕌" },
  { name: "Mysore", icon: "🏰" },
  { name: "Jaipur", icon: "🏛️" },
  { name: "Faridabad", icon: "🏛️" },
  { name: "Ghaziabad", icon: "🕌" },
  { name: "Gandhinagar", icon: "🏛️" },
  { name: "Chandigarh", icon: "🗽" },
  { name: "Lucknow", icon: "🕌" },
  { name: "Kolkata", icon: "🏛️" },
  { name: "Indore", icon: "🏛️" },
  { name: "Kochi", icon: "⛪" },
  { name: "Hosur", icon: "🏛️" },
  { name: "Pondicherry", icon: "🏛️" }
];



const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [navbarBackground, setNavbarBackground] = useState("white");
  const [currentMainLogo, setCurrentMainLogo] = useState(mainLogo.mainLogo5);
  const [isFlipping, setIsFlipping] = useState(false);
  let cartCount = useSelector((state) => state.cart?.totalCartCount || 0);
  const totalNCartCount = useSelector((state) => state.cart?.totalNCartCount || 0);
  const [intervalId, setIntervalId] = useState(null);
  const [currentColor, setCurrentColor] = useState("black");
  const [dropdownOpen, setDropdownOpen] = useState(false); // Track dropdown state
  const dispatch = useDispatch();
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const serviceProvideIn = useSelector((state) => state.product.serviceProvideIn);
  const dropdownRef = useRef(null); // Create a ref for tracking dropdown clicks

  // console.log(serviceProvideIn);
  cartCount = user?cartCount:totalNCartCount;

  useEffect(() => {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchCityFromCoordinates(latitude, longitude);
      }, () => {
        console.warn("Geolocation request denied, defaulting to Delhi.");
        setSelectedCity("Delhi"); // Default to Delhi if permission is denied
      });
    }else {
      console.warn("Geolocation not supported, defaulting to Delhi.");
      setSelectedCity("Delhi"); // Default to Delhi if geolocation is unavailable
    }
  }, []);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      event.target.getAttribute("data-ignore-close") !== "true" // Ignore elements that shouldn't trigger close
    ) {
      setDropdownOpen(null); // Close all dropdowns
      setMenuOpen(false);
    }
  };

  setInterval(()=>{
    let temp = document.getElementById("stateselect");
    if(temp){
      setMenuOpen(false);
    }
  },0);

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  const fetchCityFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();

      // Match the city from the response with the `cities` array
      const matchedCity = cities.find((city) => city.name === data.city);
      if (matchedCity) {
        setSelectedCity(matchedCity.name); // Update to the matched city
      } else {
        setSelectedCity("Delhi"); // Fallback to Delhi if no match is found
      }
    } catch (error) {
      console.error("Failed to fetch city, defaulting to Delhi:", error);
      setSelectedCity("Delhi");
    }
  };

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
      setCurrentMainLogo(mainLogo.mainLogo5);
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
  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}/auth/logout`, {
        method: 'GET',
        credentials: 'include', // Ensure cookies are sent
      });
  
      if (response.ok) {
        const data = await response.json();
        successToast(data.message);
  
        // Dispatch Redux logout action
        dispatch(logout());
  
        // Clear user data from localStorage
        localStorage.removeItem("loggedInUser");
  
        setDropdownOpen(false); // Close dropdown
        NavigatetoHome();
      } else {
        errorToast('Failed to logout');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      errorToast('Failed to logout');
    }
  };
  
  const handleUpdateMenu =()=>{
    setMenuOpen(false);
  }

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };
  return (
    <nav
      className="navbar"
      ref={dropdownRef}
      style={{ backgroundColor: navbarBackground, transition: "background-color 0.3s ease" }}
    >
      <div className="logo flex flex-row" onClick={NavigatetoHome}>
        <img 
          src={currentMainLogo}
          alt="Logo"
          className={`main-logo ${isFlipping ? "flip-animation" : ""}`}
        />
        <CitySelector 
        onCitySelect={handleCitySelect} 
        selectedCity={selectedCity}
        currentColor={currentColor}
        handleUpdateMenu={handleUpdateMenu}
        serviceProvideIn={serviceProvideIn}
      />
      </div>
      
      <div className={`nav-links ${menuOpen ? "open max-w-md bg-purple-50" : "close"}`}>
        <ul className={menuOpen?"flex flex-col xs:gap-[0.5rem] ":null}>
          <li>
            <NavLink to="/" style={{ color: menuOpen?"black":currentColor }} className="font-semibold">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/About" style={{ color: menuOpen?"black":currentColor }} className="font-semibold">
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/Contact" style={{ color: menuOpen?"black":currentColor }} className="font-semibold">
              Contact
            </NavLink>
          </li>
          <li className="block lg:hidden">
            <NavLink to="/Rent" style={{ color: menuOpen?"black":currentColor }} className="font-semibold">
              Rent
            </NavLink>
          </li>
          <li>
            <NavLink to="/Pricing" style={{ color: menuOpen?"black":currentColor }} className="font-semibold">
              Pricing
            </NavLink>
          </li>
          <li>
            <NavLink to="/Cart" style={{ color: menuOpen?"black":currentColor }} className="font-semibold">
              <FontAwesomeIcon
                icon={faCartShopping}
                style={{
                  color:  menuOpen?"black":currentColor,
                  fontSize: 20,
                  fontWeight: 300,
                }}
              />
              {cartCount > 0 && <div className="totalCounter">{cartCount}</div>}
            </NavLink>
          </li>
          <li className={`rounded-none ${menuOpen?"text-center":""}`}>
            {user ? (
              <div className="userDetail" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="userImage"><img src={normalImages.google} alt="userImage" /></div>
              <FontAwesomeIcon icon={faCircleChevronDown} className="userDropdown" />
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="user-email">{user.email}</div>
                  <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
            ) :  (
              <NavLink to="/Login" style={{ color: menuOpen?"black":currentColor }} className= "hello-btn font-semibold">
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



const CitySelector = ({ onCitySelect, selectedCity, currentColor, serviceProvideIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full md:w-fit xxxs:w-fit m-auto ml-[7px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 
        flex items-center space-x-0 px-4 py-2 rounded-lg ml-7  w-full font-mulish  justify-between md:justify-start xxxs:justify-evenly xxxs:ml-0"
      >
        <FaAddress className={`transform transition-transform duration-200 text-[1rem] ${window.scrollY>=100?currentColor:""}`} currentColor={currentColor} />
        <span className="font-extrabold" style={{ color: window.scrollY >= 100 ? currentColor : "" }}
        >{serviceProvideIn.includes(selectedCity)?selectedCity:'Delhi'}</span>
        
      </button>

      {isOpen && (
        <div id="stateselect" className="absolute z-50 mt-2 w-[90vw] md:w-[450px] xxxs:w-[250px] bg-white rounded-lg shadow-lg border border-gray-200 left-1/2 transform -translate-x-1/2 md:left-0 md:translate-x-[0] xs:translate-x-[-70px] xxxs:translate-x-[-125px] xxs:translate-x-[-100px]">
          <div className="p-2 md:p-4">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-8 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 text-sm md:text-base"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 max-h-[60vh] md:max-h-96 overflow-y-auto hide-scrollbar scroll-smooth">
              {filteredCities.map((city) => {
                const isDisabled = !serviceProvideIn.includes(city.name);
                return <div
                  key={city.name}
                  style={{
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    backgroundColor: isDisabled ? '#f0f5f1' : '',
                    pointerEvents: isDisabled ? 'none' : 'auto', // Completely disables interaction
                  }}
                  onClick={!isDisabled ? () => {
                    onCitySelect(city.name);
                    setIsOpen(false);
                    setSearchTerm("");
                  } : undefined} // Remove onClick handler if disabled
                  className={`relative flex flex-col items-center p-2 cursor-pointer hover:bg-gray-50 rounded-lg
                    ${selectedCity === city.name ? 'bg-gray-50 border border-red-200' : ''}`}
                >
                  <div className={`w-8 h-8 md:w-12 md:h-12 flex items-center justify-center ${isDisabled?"":"border border-red-500"} rounded-full`}>
                    <span className="text-base md:text-xl">{city.icon}</span>
                  </div>
                  <span className={`mt-1 md:mt-2 text-xs md:text-sm text-center ${isDisabled?"text-black font-bold md:text-[10px]":"text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"}`}>{city.name}</span>
                  {city.name === "Lucknow" && (
                    <span className="text-[10px] md:text-xs text-red-500">New</span>
                  )}
                  {isDisabled && (
                    <div
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg"
                      style={{ pointerEvents: "none" }} // Prevents interaction with the overlay
                    >
                      <img src={normalImages.commingSoon} className="w-[32%] object-contain" alt="comming soon"/>
                    </div>
                  )}
                </div>
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;

import React, { useState, useEffect } from "react";
import { rentImage, normalImages } from "../ImagePath";
import ProductCard from "../components/ProductCard";
import FilterProduct from "../components/FilterProduct";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/rentProductSlice";
import { removeOldCartItems, validateCart, updateCartItem, syncCartWithServer } from "../redux/cartSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareArrowUpRight } from "@fortawesome/free-solid-svg-icons";
import ConsultationFilter from "../components/ConsultationFilter";
import { infoToast } from "../DecryptoAndOther/ToastUpdate";

export default function RentPage() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.rentProduct);
  const cartItem = useSelector((state) => state.cart.cartItem) || [];
  const locationNames = useSelector((state) => state.product.indiaStatesAndUTs);
  const [filterData, setFilterData] = useState({});
  const [filterDataPopup, setFilterDataPopup] = useState({});
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [tenure, setTenure] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Responsive configuration
  const [screenConfig, setScreenConfig] = useState({
    visibleProducts: 3,
    slideWidth: 33.333,
    gapSize: 'md:gap-6',
    padding: 'md:p-6'
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {  // Mobile
        setScreenConfig({
          visibleProducts: 1,
          slideWidth: 100,
          gapSize: 'gap-3',
          padding: 'p-3'
        });
      } else if (width < 768) {  // Small tablet
        setScreenConfig({
          visibleProducts: 2,
          slideWidth: 50,
          gapSize: 'sm:gap-4',
          padding: 'sm:p-4'
        });
      } else if (width < 1024) {  // Large tablet
        setScreenConfig({
          visibleProducts: 2,
          slideWidth: 50,
          gapSize: 'md:gap-5',
          padding: 'md:p-5'
        });
      } else {  // Desktop and larger
        setScreenConfig({
          visibleProducts: 3,
          slideWidth: 33.333,
          gapSize: 'lg:gap-6',
          padding: 'lg:p-6'
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // useEffect(() => {
  //   const storedCart = localStorage.getItem("cart");
  //   const cartItems = storedCart ? JSON.parse(storedCart) : [];
  
  //   if (Array.isArray(cartItems) && cartItems.length > 0) {
  //     cartItems.forEach((item) => {
  //       dispatch(updateCartItem(item));
  //     });
  //   }
  //   dispatch(removeOldCartItems());
  
  //   const user = JSON.parse(localStorage.getItem("loggedInUser"));
  //   if (user) {
  //     dispatch(syncCartWithServer({ userId: user._id, cartItems: cartItems}));
  //   }
  // }, [dispatch]);
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleNext = () => {
    const maxIndex = Math.max(0, products.length - screenConfig.visibleProducts);
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    const maxIndex = Math.max(0, products.length - screenConfig.visibleProducts);
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (category === "" && type === "" && location === "" && tenure === "") {
      alert("Please fill at least one filter!");
      return;
    }
    const filter = { location, category, type, tenure };
    const filteredProducts = products.filter((product) =>
      Object.keys(filter).every((key) =>
        filter[key] ? product[key] === filter[key] : true
      )
    );
    setFilterData(filteredProducts);
  };

  const renderProductCards = (data) =>
    data.map((product) => (
      <div 
        key={product.id} 
        style={{ 
          flex: `0 0 ${screenConfig.slideWidth}%`,
          maxWidth: `${screenConfig.slideWidth}%`,
          transition: 'transform 0.3s ease'
        }}
        className="px-2 sm:px-3 md:px-4"
      >
        <ProductCard 
          product={product}
          isInCart={Array.isArray(cartItem) && cartItem.some((item) => item._id === product._id)}
        />
      </div>
    ));

  return (
    <div className="font-inter min-h-screen bg-white">
      {/* Header Section */}
      <div 
        className="relative text-center bg-cover bg-center py-[6rem] sm:py-6 md:py-24 lg:py-28 px-3 sm:px-4 md:px-6 lg:px-8"
        style={{background: `url(${normalImages.patern})`}}
      >
        <h1 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold leading-tight">
          Select the Right Product
        </h1>
        <p className="text-sm sm:text-base md:text-xl lg:text-2xl mt-2 sm:mt-3">
          Using <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 font-semibold">CadabraAI</span>
        </p>
        <button
          onClick={() => setShowQuiz(true)}
          className="mt-3 sm:mt-4 bg-black text-green-400 py-1.5 sm:py-2 md:py-3 px-3 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base font-bold hover:bg-gray-800 transition"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Rent Now
          </span>
        </button>
      </div>

      {/* Filter Section - Mobile Accordion */}
      <div className="md:hidden bg-gray-100 py-3 px-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex justify-between items-center px-4 py-2 bg-white rounded-lg shadow"
        >
          <span className="font-medium">Filters</span>
          <span className={`transform transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
        {isMobileMenuOpen && (
          <form onSubmit={handleSearch} className="mt-3 space-y-3">
            {[
              { value: location, setter: setLocation, placeholder: "Select Location", options: locationNames },
              { value: category, setter: setCategory, placeholder: "Select Category", options: [] },
              { value: type, setter: setType, placeholder: "Select Type", options: [] },
              { value: tenure, setter: setTenure, placeholder: "Select Tenure", options: [] },
            ].map((field, index) => (
              <select
                key={index}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
              >
                <option value="">{field.placeholder}</option>
                {field.options.map((item, idx) => (
                  <option key={idx} value={typeof item === 'string' ? item : item.value}>
                    {typeof item === 'string' ? item : item.label}
                  </option>
                ))}
              </select>
            ))}
            <button
              type="submit"
              className="w-full bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 text-sm transition-colors duration-200"
            >
              Search
            </button>
          </form>
        )}
      </div>

      {/* Filter Section - Desktop */}
      <div className="hidden md:block bg-gray-100 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
        <form
          onSubmit={handleSearch}
          className="max-w-7xl mx-auto flex  flex-wrap md:flex-nowrap gap-3 sm:gap-4 items-stretch"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 flex-grow">
            {[
              { value: location, setter: setLocation, placeholder: "Select Location", options: locationNames },
              { value: category, setter: setCategory, placeholder: "Select Category", options: [] },
              { value: type, setter: setType, placeholder: "Select Type", options: [] },
              { value: tenure, setter: setTenure, placeholder: "Select Tenure", options: [] },
            ].map((field, index) => (
              <select
                key={index}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
              >
                <option value="">{field.placeholder}</option>
                {field.options.map((item, idx) => (
                  <option key={idx} value={typeof item === 'string' ? item : item.value}>
                    {typeof item === 'string' ? item : item.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-green-500 text-white px-4 sm:px-6 py-2 rounded-lg shadow-md hover:bg-green-600 text-sm md:text-base transition-colors duration-200"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Results */}
      {filterData.length > 0 && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${screenConfig.gapSize} ${screenConfig.padding}`}>
          {renderProductCards(filterData)}
        </div>
      )}

      {/* Featured Image Section */}
      <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 bg-white">
        <div className="max-w-7xl mx-auto rounded-lg overflow-hidden">
          <img
            src={normalImages.Finalimage}
            alt="Featured Products"
            className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Product Slider */}
<div className="bg-gray-50 py-4 sm:py-6 md:py-8">
  <h2 className="text-base sm:text-lg md:text-2xl font-bold text-center mb-4">
    Latest Arrivals
  </h2>
  
  {/* Outer Container for Padding and Centering */}
  <div className="px-4 sm:px-8 md:px-12 lg:px-16">
    {/* Carousel Container - Centered with improved responsive widths */}
    <div className="max-w-[95%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%] mx-auto relative">
      {/* Navigation Buttons with Adjusted Spacing */}
      <button
        className="hidden sm:block absolute -left-12 lg:-left-16 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-blue-400 to-purple-500 hover:bg-gray-400 text-black rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
        onClick={handlePrev}
        aria-label="Previous slide"
      >
        &#8249;
      </button>

      {/* Main Carousel Viewport */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-all duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * screenConfig.slideWidth}%)`,
          }}
        >
          {/* Updated Product Cards Container */}
          {products.map((product) => (
            <div 
              key={product.id} 
              style={{ 
                flex: `0 0 ${screenConfig.slideWidth}%`,
                maxWidth: `${screenConfig.slideWidth}%`,
                transition: 'transform 0.3s ease'
              }}
              className="px-2 sm:px-3 md:px-4 flex justify-center"
            >
              <ProductCard 
                product={product}
                isInCart={cartItem.some((item) => item._id === product._id)}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        className="hidden sm:block absolute -right-12 lg:-right-16 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-blue-400 to-purple-500 hover:bg-gray-400 text-black rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
        onClick={handleNext}
        aria-label="Next slide"
      >
        &#8250;
      </button>
    </div>
  </div>

  {/* Mobile-specific Controls */}
  <div className="sm:hidden">
    {/* Touch Swipe Instructions */}
    <p className="text-center text-sm text-gray-500 mt-4">
      Swipe left or right to browse products
    </p>

    {/* Pagination Dots */}
    <div className="flex justify-center mt-4 gap-2">
      {Array.from({ length: Math.ceil(products.length / screenConfig.visibleProducts) }).map((_, index) => (
        <button
          key={index}
          className={`h-2 rounded-full transition-all ${
            Math.floor(currentIndex / screenConfig.visibleProducts) === index 
              ? 'w-4 bg-blue-500' 
              : 'w-2 bg-gray-300'
          }`}
          onClick={() => setCurrentIndex(index * screenConfig.visibleProducts)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  </div>
</div>

      {/* Quiz Popup */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 md:p-6 z-50">
          <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg relative">
            <button
              onClick={() => setShowQuiz(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 text-xl p-1 rounded-full hover:bg-gray-100"
              aria-label="Close quiz"
            >
              &times;
            </button>
            <FilterProduct handleCloseQuiz={() => setShowQuiz(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

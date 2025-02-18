import React, { useState, useEffect, useRef } from "react";
import { rentImage, normalImages } from "../ImagePath";
import ProductCard from "../components/Product/ProductCard";
import FilterProduct from "../components/Popup&Faq/FilterProduct";
import "../styles/RentPage.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/rentProductSlice";
import {
  removeOldCartItems,
  validateCart,
  updateCartItem,
  syncCartWithServer,
} from "../redux/cartSlice";
import ConsultationFilter from "../components/Popup&Faq/ConsultationFilter";
import { errorToast, infoToast } from "../DecryptoAndOther/ToastUpdate";

export default function RentPage() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.rentProduct);
  let cartItem = useSelector((state) => state.cart.cartItem) || [];
  // console.log(cartItem);
  let cartNItem = useSelector((state) => state.cart.cartNItem) || [];
  const locationNames = useSelector((state) => state.product.indiaStatesAndUTs);
  const tenureOptions = useSelector((state) => state.product.tenureOptions);
  const typeofServiceProvide = useSelector(
    (state) => state.product.typeofServiceProvide
  );
  const categories = useSelector((state) => state.product.categories);
  const user = useSelector((state) => state.auth.user);
  const [filterData, setFilterData] = useState({});
  const [filterDataPopup, setFilterDataPopup] = useState([]);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [tenure, setTenure] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const clonedProduct = Array.isArray(products)
    ? [...products, ...products]
    : [];
  const [bottomLog, setbottomLog] = useState(0);
  const sliderRef = useRef({ startX: 0, endX: 0 });


  // useEffect(()=>{
  //   const cart = localStorage.getItem("cart");
  //   console.log("update inside cart");
  //   console.log(cart, cartItem, user);
  //   if(!cart && cartItem && cartItem.length>0 && user){
  //     dispatch(syncCartWithServer({userId: user._id,cartItems:[]}))
  //   }
  // },[])

  useEffect(() => {
    if (!user) {
      dispatch(updateCartItem(cartNItem));
    } else {
      dispatch(updateCartItem({ cart: user.cart, user }));
    }
  }, [user, dispatch]);

  // Responsive configuration
  const [screenConfig, setScreenConfig] = useState({
    visibleProducts: 3,
    slideWidth: 33.333,
    gapSize: "md:gap-6",
    padding: "md:p-8",
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // Mobile
        setScreenConfig({
          visibleProducts: 1,
          slideWidth: 100,
          gapSize: "gap-3",
          padding: "p-3",
        });
      } else if (width < 768) {
        // Small tablet
        setScreenConfig({
          visibleProducts: 2,
          slideWidth: 50,
          gapSize: "sm:gap-4",
          padding: "sm:p-4",
        });
      } else if (width < 1024) {
        // Large tablet
        setScreenConfig({
          visibleProducts: 2,
          slideWidth: 50,
          gapSize: "md:gap-5",
          padding: "md:p-5",
        });
      } else {
        // Desktop and larger
        setScreenConfig({
          visibleProducts: 3,
          slideWidth: 33.333,
          gapSize: "lg:gap-6",
          padding: "lg:p-6",
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  useEffect(() => {
    if (products.length > 0) {
      setCurrentIndex(Math.floor(products.length / 2)); // Start with the center product
    }
  }, [products]);

  const handleNext = () => {
    // setCurrentIndex((prev) => (prev + 1) % products.length);
    if (currentIndex < products.length + screenConfig.visibleProducts - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Reset to start after finishing one loop (seamless)
      setTimeout(() => {
        setCurrentIndex(screenConfig.visibleProducts);
      }, 300); // Match the transition duration
    }
  };

  const handlePrev = () => {
    // setCurrentIndex((prev) =>
    //   prev === 0 ? products.length - 1 : prev - 1
    // );
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Reset to end of first loop
      setTimeout(() => {
        setCurrentIndex(products.length - screenConfig.visibleProducts);
      }, 300); // Match the transition duration
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (category === "" && type === "" && location === "" && tenure === "") {
      errorToast("Please fill at least one filter!");
      setFilterData([]);
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
    data.map((product, index) => (
      <div
        key={product.id + index}
        style={{
          flex: `0 0 ${screenConfig.slideWidth}%`,
          maxWidth: `${screenConfig.slideWidth}%`,
          transition: "transform 0.3s ease",
        }}
        className="px-2 sm:px-3 md:px-4 justify-center"
      >
        <ProductCard
          product={product}
          isInCart={
            Array.isArray(cartItem) &&
            cartItem.some((item) => item.productId._id === product._id)
          }
        />
      </div>
    ));
  // console.log("cartItem",cartItem);
  const handleData = (data) => {
    const dataArray = Object.values(data); // Convert object values to array
    setFilterDataPopup(dataArray);
    if (Object.keys(data).length > 0) {
      setShowQuiz(true);
    }
    console.log(filterDataPopup);
  };

  const handleCloseFilter = () => {
    setShowQuiz(false);
    setFilterDataPopup([]);
  };
  const handleTouchStart = (e) => {
    sliderRef.current.startX = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    sliderRef.current.endX = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!sliderRef.current) return;
  
    const diffX = sliderRef.current.startX - sliderRef.current.endX;
  
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        setCurrentIndex((prev) => Math.min(prev + 1, products.length - 1));
      } else {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };
  

  useEffect(() => {
    if (user) {
      dispatch(syncCartWithServer({ userId: user._id, cartItems: [] }));
    }
  }, []);

  useEffect(() => {
    const updateBottomLog = () => {
      if (window.innerWidth >= 768) {
        setbottomLog(
          window.innerWidth >= 768 && window.scrollY <= 600 ? 0 : 160
        );
      }
      if (window.innerWidth < 768) {
        setbottomLog(window.scrollY < 668 ? 0 : 180);
      }
    };

    // Run on mount
    updateBottomLog();

    // Listen to scroll & resize events
    window.addEventListener("scroll", updateBottomLog);
    window.addEventListener("resize", updateBottomLog);

    return () => {
      window.removeEventListener("scroll", updateBottomLog);
      window.removeEventListener("resize", updateBottomLog);
    };
  }, []);

  useEffect(() => {
    // console.log("filterDataPopup updated:", filterDataPopup);
    // console.log("filterDataPopup length:", filterDataPopup.length);
    if (filterDataPopup.length > 0) {
      setShowQuiz(true);
    }
  }, [filterDataPopup]);

  return (
    <div className="font-inter min-h-screen bg-white relative font-mulish">
      {/* Header Section */}
      <div
        className="relative text-center bg-cover bg-center py-[6rem] sm:py-6 md:py-24 lg:py-28 px-3 sm:px-4 md:px-6 lg:px-8"
        style={{ background: `url(${normalImages.patern})` }}
      >
        <h1 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold leading-tight">
          Select the Right Product
        </h1>
        <p className="text-sm sm:text-base md:text-xl lg:text-2xl mt-2 sm:mt-3">
          Using{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 font-semibold">
            CadabraAI
          </span>
        </p>
        <button
          onClick={() => setShowQuiz(true)}
          className="mt-3 sm:mt-4 bg-black py-1.5 sm:py-2 md:py-3 px-3 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base font-bold hover:bg-gray-800 transition "
        >
          <span className=" text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
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
          <span
            className={`transform transition-transform ${
              isMobileMenuOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {isMobileMenuOpen && (
          <form onSubmit={handleSearch} className="mt-3 space-y-3">
            {[
              {
                value: location,
                setter: setLocation,
                placeholder: "Select Location",
                options: locationNames,
              },
              {
                value: category,
                setter: setCategory,
                placeholder: "Select Category",
                options: categories,
              },
              {
                value: type,
                setter: setType,
                placeholder: "Select Type",
                options: typeofServiceProvide,
              },
              {
                value: tenure,
                setter: setTenure,
                placeholder: "Select Tenure",
                options: tenureOptions,
              },
            ].map((field, index) => (
              <div key={index} className="w-full">
                {/* Input Field with Datalist */}
                <input
                  list={`datalist-${index}`} // Unique `list` ID for each field
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                />
                {/* Datalist for Suggestions */}
                <datalist id={`datalist-${index}`}>
                  {field.options.map((item, idx) => (
                    <option
                      key={idx}
                      value={typeof item === "string" ? item : item.value}
                    >
                      {typeof item === "string" ? item : item.label}
                    </option>
                  ))}
                </datalist>
              </div>
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
              {
                value: location,
                setter: setLocation,
                placeholder: "Select Location",
                options: locationNames,
              },
              {
                value: category,
                setter: setCategory,
                placeholder: "Select Category",
                options: categories,
              },
              {
                value: type,
                setter: setType,
                placeholder: "Select Type",
                options: typeofServiceProvide,
              },
              {
                value: tenure,
                setter: setTenure,
                placeholder: "Select Tenure",
                options: tenureOptions,
              },
            ].map((field, index) => (
              <div key={index} className="w-full">
                {/* Input Field with Datalist */}
                <input
                  list={`datalist-${index}`} // Unique `list` ID for each field
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                />
                {/* Datalist for Suggestions */}
                <datalist id={`datalist-${index}`}>
                  {field.options.map((item, idx) => (
                    <option
                      key={idx}
                      value={typeof item === "string" ? item : item.value}
                    >
                      {typeof item === "string" ? item : item.label}
                    </option>
                  ))}
                </datalist>
              </div>
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
      <div className="bg-gray-100">
        {filterData.length > 0 && (
          <div
            className={`grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-7xl md:max-w-[38rem] lg:mx-auto md:mb-4 ${screenConfig.gapSize} ${screenConfig.padding} md:max-h-[680px] overflow-y-auto hide-scrollbar  md:mx-auto xs:max-w-[16rem] mx-auto xs:max-h-[650px] scroll-smooth`}
          >
            {renderProductCards(filterData)}
          </div>
        )}
      </div>
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
          <div className="max-w-[95%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[60%] mx-auto relative">
            {/* Navigation Buttons with Adjusted Spacing */}
            {/* focus:outline-none focus:ring-2 focus:ring-gray-400 hover:bg-gray-400*/}
            <button
              className="hidden sm:block absolute -left-12 lg:-left-[11rem] top-[50%] -translate-y-1/2 z-10  text-black rounded-full w-[7rem] h-[7rem] flex items-center justify-center transition-colors duration-200 "
              onClick={handlePrev}
              aria-label="Previous slide"
            >
              <span
                className="text-[4rem] text-black"
                style={{
                  lineHeight: "1", // Ensures the line height matches the font size
                }}
              >
                &#8249;
              </span>
            </button>

            {/* Main Carousel Viewport */}
            <div className="overflow-hidden pt-[60px] pb-[40px]">
              <div className="flex transition-all duration-300 ease-in-out"
                ref={sliderRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  transform: `translateX(-${
                    currentIndex * screenConfig.slideWidth
                  }%)`,
                }}
              >
                {/* Updated Product Cards Container */}
                {clonedProduct.map((product, index) => {
                  let position =
                    (index - 1 - currentIndex + products.length) %
                    products.length;

                  // Shift the position to handle left-side wrapping
                  if (position > Math.floor(screenConfig.visibleProducts / 2)) {
                    position -= products.length;
                  }
                  // Debugging
                  //console.log("Index:", index, "Position:", position, "CurrentIndex:", currentIndex);

                  const scale =
                    position === 0 ? 1.2 : Math.abs(position) === 1 ? 0.9 : 0.8;
                  // Determine the scale and opacity based on the position
                  const opacity =
                    position === 0 ? 1 : Math.abs(position) === 1 ? 0.8 : 0.5;

                  // Apply conditional styles for screens >768px
                  const conditionalStyles =
                    window.innerWidth > 768
                      ? {
                          transform: `scale(${scale})`,
                          opacity: `${opacity}`,
                          maxWidth: `${screenConfig.slideWidth}%`,
                        }
                      : {};
                  return (
                    <div
                      key={`${product.id}${index}`}
                      style={{
                        flex: `0 0 ${screenConfig.slideWidth}%`,
                        maxWidth: `${screenConfig.slideWidth}%`,
                        ...conditionalStyles, // Spread conditional styles here
                        transition: "transform 0.3s ease, opacity 0.3s ease",
                      }}
                      className="px-2 sm:px-3 md:px-4 flex justify-center"
                    >
                      <ProductCard
                        product={product}
                        isInCart={cartItem.some(
                          (item) => (item.productId || item._id) == product._id
                        )}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            {/* focus:outline-none focus:ring-2 focus:ring-gray-400 hover:bg-gray-400*/}
            <button
              className="hidden sm:block absolute -right-12 lg:-right-[11rem] top-[50%] -translate-y-1/2 z-10  text-black rounded-full w-[7rem] h-[7rem] flex items-center justify-center transition-colors duration-200 "
              onClick={handleNext}
              aria-label="Next slide"
            >
              <span
                className="text-[4rem] text-black"
                style={{
                  lineHeight: "1", // Ensures the line height matches the font size
                }}
              >
                &rsaquo;
              </span>{" "}
              {/* Properly aligned arrow */}
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
            {Array.from({
              length: Math.ceil(products.length / screenConfig.visibleProducts),
            }).map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  Math.floor(currentIndex / screenConfig.visibleProducts) ===
                  index
                    ? "w-4 bg-blue-500"
                    : "w-2 bg-gray-300"
                }`}
                onClick={() =>
                  setCurrentIndex(index * screenConfig.visibleProducts)
                }
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Popup */}
      {showQuiz && filterDataPopup.length === 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 md:p-6 z-50">
          <div className="bg-white shadow-[8px_8px_1px_rgba(1,1,1,0.6)] border-black border-[2px] p-3 sm:p-4 md:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-2xl 2xl:max-w-3xl relative">
            <button
              onClick={() => setShowQuiz(false)}
              className="absolute top-2 right-2 z-10 text-gray-500 hover:text-gray-700 transition-colors duration-200 text-2xl p-1 rounded-full"
              aria-label="Close quiz"
            >
              &times;
            </button>
            <FilterProduct
              handleCloseQuiz={() => setShowQuiz(false)}
              handleData={handleData}
            />
          </div>
        </div>
      )}
      {showQuiz && filterDataPopup.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 md:p-6 z-50">
          <div
            className="bg-white p-3 flex flex-col lg:flex-row shadow-[8px_8px_1px_rgba(1,1,1,0.6)] border-black border-[2px] w-full max-w-xs sm:max-w-sm md:max-w-[36rem] lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl relative max-h-screen overflow-y-scroll
          md:max-h-[35.5rem] md:mt-[6.5rem] scrollbar-hide
          xxxs:mt-[4rem] xxxs:max-h-[39rem] xxxs:pt-[1.2rem] xxxs:scrollbar-none
          "
          >
            <button
              onClick={handleCloseFilter}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl p-1 rounded-full
              xxxs:top-[-0.4rem] xxxs:right-[0.4rem]
              "
              aria-label="Close quiz"
            >
              &times;
            </button>
            <div className="w-full md:w-full lg:w-1/3 p-2">
              <ConsultationFilter />
            </div>
            <div className="w-full lg:w-2/3 p-2 py-[18px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto">
              {products.map((product, index) => (
                <div
                  key={product.id + index}
                  className="px-2 xxxs:flex justify-center"
                >
                  <ProductCard
                    product={product}
                    isInCart={
                      Array.isArray(cartItem) &&
                      cartItem.some(
                        (item) => item.productId._id === product._id
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* {console.log(cartItem, cartNItem)} */}
      {(cartItem && cartItem.length > 0) || (cartNItem && cartNItem.length > 0)
        ? ""
        : // <a className="tk-btn fixed right-0 xxxs:right-[70px] flex justify-end lg:mr-[20px] md:mr-[10px]"
          // style={{ bottom: bottomLog, transition:'bottom 0.5s ease-in' }}
          // href="/cart">
          //   <div className="flex  flex-end w-fit">
          //     <h3 className="font-bold mx-2">
          //       <span className="lg:text-3xl">GO</span> <br /> <span className="lg:text-2xl text-gray">TO</span> <br /> <span className="lg:text-xl  bg: bg-gradient-to-r from-blue-400 to-purple-500">CART</span>
          //     </h3>
          //     <img src={normalImages.Cart} alt="Cart Icon" className="cart-icon lg:w-[6rem] lg:h-[6rem] md:w-[4rem] md:h-[4rem]"/> {/* Make sure CART is a valid variable or component */}
          //   </div>
          // </a>
          null}
    </div>
  );
}

import React, { useState,useEffect } from "react";
import "../styles/RentPage.scss";
import { rentImage, normalImages } from "../ImagePath";
import ProductCard from '../components/ProductCard';
import FilterProduct from "../components/FilterProduct";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import { fetchProducts } from "../redux/rentProductSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareArrowUpRight } from "@fortawesome/free-solid-svg-icons";

export default function RentPage() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.rentProduct);
  const cartItem = useSelector((state) => state.cart.cartItem);
  const locationNames = useSelector((state) => state.product.indiaStatesAndUTs);
  const [filterData, setFilterData] = useState({});
  const [filterDataPopup, setFilterDataPopup] = useState({});
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [tenure, setTenure] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (category === '' && type === '' && location === '' && tenure === '') {
      toast.error("Please fill minimum two required fields!");
      return;
    }
    const filter = { location, category, type, tenure };
    console.log(filter);
    const FilterProduct = products.filter((product) => {
      //console.log(product);
      return Object.keys(filter).every((key) => {
        if (!filter[key]) return true;
        return product[key] === filter[key];
      });
    });
    setCategory("");
    setType("");
    setLocation("");
    setTenure("");
    if(filterData.length === 0) {
      toast.error("No products found!");
      setFilterData({});
      return
    }
    console.log(FilterProduct);
    setFilterData(FilterProduct);
    return;
  };

  const handleShowQuiz = () => {
    setShowQuiz(true);
    console.log("showQuiz", showQuiz);
    document.body.style.overflow = "hidden";
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
    document.body.style.overflow = "auto";
  };

  const handleData = (data) => {
    console.log(data);
    if (Object.keys(data).length === 0) {  // Check if data object is empty
      return;
    }
    handleShowQuiz();
    setFilterDataPopup({ ...data });
  };

  const renderProductCards = (products) => {
    return products.map((product) => {
      const isInCart = cartItem.some((item) => item._id === product._id);
      //console.log(cartItem);
      return <ProductCard key={product.id} product={product} isInCart={isInCart} />;
    });
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  console.log(filterDataPopup);
  return (
    <div className="rentPage">
      <section className={`mainContent ${showQuiz ? "blurred" : ""}`}>
        <section className="rentHeader">
          <div className="rentHeader-content">
            <h2>Rent out clothes you no longer need</h2>
            <p>Save and earn money with the most Earth-friendly form of style. Guaranteed freshly dry-cleaned.</p>
          </div>
          <button className="rent-btn" onClick={handleShowQuiz}>Rent Now <FontAwesomeIcon className="fontIcon" icon={faSquareArrowUpRight}/></button>
        </section>

        <section className="filterContainer">
          <form onSubmit={handleSearch}>
            <div className="allFilterList">
              <div className="filterItem">
                <select id="location" value={location} onChange={(e) => setLocation(e.target.value)}>
                  <option value="">Select your Location</option>
                  {locationNames.map((item, index) => (
                    <option value={item} key={`${item}-${index + 1}`}>{item}</option>
                  ))}
                </select>
              </div>
              <div className="filterItem">
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Select a category</option>
                  <option value="type1">type1</option>
                  <option value="type2">type2</option>
                  <option value="type3">type3</option>
                  <option value="type4">type4</option>
                </select>
              </div>
              <div className="filterItem">
                <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">Select a type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div className="filterItem">
                <select id="tenure" value={tenure} onChange={(e) => setTenure(e.target.value)}>
                  <option value="">Select a tenure</option>
                  <option value="under_1_year">Under 1 year</option>
                  <option value="1_year">1 Year</option>
                  <option value="more_than_1_year">More than 1 year</option>
                  <option value="Not_Sure">Not Sure</option>
                </select>
              </div>
            </div>
            <button type="submit" className="search-btn">Search</button>
          </form>
          {filterData.length > 0 ?
          <div className="product-container">
            {renderProductCards(filterData)}
          </div>
          :null}
        </section>

        <section className="howItContainer">
          <div className="howTop">
            <h2>How it works</h2>
            <p>Save and earn money with the most Earth-friendly form of style. Guaranteed freshly dry-cleaned.</p>
          </div>
          <div className="howBottom">
            <div className="howBottomItem">
              <div className="Image">
                <img src={rentImage.sell} alt="sell image" />
              </div>
              <div className="detail">
                <h3 className="detailHead">List clothes</h3>
                <p className="detailText">List hundreds of closets, brands, occasions, and all sizes</p>
              </div>
            </div>
            <img src={rentImage.path} className="path" alt="path" />
            <div className="howBottomItem">
              <div className="Image">
                <img src={rentImage.cash} alt="cash image" />
              </div>
              <div className="detail">
                <h3 className="detailHead">Sell them</h3>
                <p className="detailText">Get it delivered or pick it up at a nearby Wardrobe Hub</p>
              </div>
            </div>
            <img src={rentImage.path1} className="path" alt="path1" />
            <div className="howBottomItem">
              <div className="Image">
                <img src={rentImage.celebrate} alt="celebrate image" />
              </div>
              <div className="detail">
                <h3 className="detailHead">Get Paid</h3>
                <p className="detailText">Get it delivered or pick it up at a nearby Wardrobe Hub</p>
              </div>
            </div>
          </div>
        </section>

        <div className="BannerContainer">
          <div className="bannerImage">
            <img src={normalImages.customer} alt="Rent banner" />
          </div>
          <button className="banner-btn" >Go--{">"}</button>
        </div>

        <section className="latest-arrivals">
          <h2 className="latest-title">Latest Arrivals</h2>
          <div className="product-container">
            {renderProductCards(products)}
          </div>
        </section>
      </section>

      {/* Quiz Popup */}
      {showQuiz && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-btn" onClick={handleCloseQuiz}>
              &times;
            </button>
            <FilterProduct handleCloseQuiz={handleCloseQuiz} handleData={handleData} />
          </div>
        </div>
      )}
      {/* Popup filter */}
      {Object.keys(filterDataPopup).length > 0 && (
        <div className="popup">
          <div className="popup-content filter-popup">
            <button className="close-btn" onClick={() => setFilterDataPopup([])}>
              &times;
            </button>
            {/* Add content to show inside the filterDataPopup */}
            <div>{/* You can display the filtered data here */}</div>
          </div>
        </div>
      )}
    </div>
  );
}

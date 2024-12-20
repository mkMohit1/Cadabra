import React, { useState } from "react";
import "../styles/RentPage.scss";
import { rentImage, normalImages } from "../ImagePath";
import ProductCard from '../components/ProductCard';
import FilterProduct from "../components/FilterProduct";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';

export default function RentPage() {
  const products = useSelector((state) => state.product.rentProduct);
  const cartItem = useSelector((state) => state.cart.cartItem);
  const locationNames = useSelector((state) => state.product.indiaStatesAndUTs);

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
    const filterData = { location, category, type, tenure };
    console.log(filterData);
  };

  const handleShowQuiz = () => {
    setShowQuiz(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
    document.body.style.overflow = "auto";
  };

  const renderProductCards = (products) => {
    return products.map((product) => {
      const isInCart = cartItem.some((item) => item.id === product.id);
      return <ProductCard key={product.id} product={product} isInCart={isInCart} />;
    });
  };

  return (
    <div className="rentPage">
      <section className={`mainContent ${showQuiz ? "blurred" : ""}`}>
        <section className="rentHeader">
          <div className="rentHeader-content">
            <h2>Rent out clothes you no longer need</h2>
            <p>Save and earn money with the most Earth-friendly form of style. Guaranteed freshly dry-cleaned.</p>
          </div>
          <button className="rent-btn">Browse the latest collections</button>
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

          <div className="product-container">
            {renderProductCards(products)}
          </div>
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
          <button className="banner-btn" onClick={handleShowQuiz}>Go--{">"}</button>
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
            <FilterProduct handleCloseQuiz={handleCloseQuiz} />
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

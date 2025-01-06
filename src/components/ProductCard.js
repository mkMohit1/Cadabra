import React, { useEffect, useState } from "react";
import "../styles/ProductCard.scss"; // Styling specific to ProductCard
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { removeCartItem, removeSellCartItem, updateCartItem, updateSellCartCount } from "../redux/cartSlice";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import SVGComponent from "../svgComponents/Offer"; // Import the SVG component

const ProductCard = ({ product, isInCart }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectProduct, setSelectProduct] = useState(isInCart);  // Track whether the product is in the cart
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Synchronize selectProduct state with the isInCart prop
  useEffect(() => {
    setSelectProduct(isInCart);  // Update the state if the product's cart status changes externally
  }, [isInCart]);

  // Handle adding/removing from the cart
  const handleUpdateCount = () => {
    if (selectProduct) {
      // If the product is already in the cart, remove it
      dispatch(removeCartItem(product));
      dispatch(removeSellCartItem(product));
      toast.info("Product removed from the cart");
    } else {
      // If the product is not in the cart, add it
      dispatch(updateCartItem(product));
      dispatch(updateSellCartCount(product));
      toast.success("Product added to the cart");
    }
    setSelectProduct((prev) => !prev);  // Toggle the product state after action
  };

  const handleProductPage = ()=>{
    navigate(`/products/product-${product._id}`);
  }

  // Process the description
  const processedDescription = product.description.replace(/<\/?p>/g, '')  // Remove the <p> tags;

  return (
    <div className="product-card">
      <img onClick={handleProductPage}
        src={`http://localhost:5000${product.productImage}`}
        alt={product.title}
        className="product-image"
      />
      <h3 className="product-name" onClick={handleProductPage}>{product.title}</h3>
      <p className="product-description">
        {product.subTitle}  
      </p>
      <p className="product-usp">
      {product.productUsp}
      </p>
      <p className="product-price">
      <del>{product.mrp}</del> -{/* Crossed out original price */}
      {Math.floor(product.mrp - (product.mrp * (product.discount / 100)))} 
      </p>
      <button className={`product-cart ${selectProduct?"check":""}`} onClick={handleUpdateCount}>
        {selectProduct ? <FontAwesomeIcon icon={faCheck}/> :<FontAwesomeIcon icon={faPlus}/>}
      </button>
      <span className="offer-svg">
        <SVGComponent discount={product.discount} />
      </span>
      {/* {selectProduct && (
        <div className="counter">
          <FontAwesomeIcon icon={faPlus} />
          {/* You can add a counter here if you want to display the number of items in the cart
        </div>)
      */}
    </div>
  );
};

export default ProductCard;

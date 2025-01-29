import React, { useEffect, useState } from "react";
import "../styles/ProductCard.scss"; // Styling specific to ProductCard
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { removeCartItem, removeSellCartItem, syncCartWithServer, updateCartItem } from "../redux/cartSlice";
import { ToastContainer } from 'react-toastify';
import { infoToast,errorToast, successToast } from "../DecryptoAndOther/ToastUpdate";
import { useNavigate } from "react-router-dom";
import SVGComponent from "../svgComponents/Offer"; // Import the SVG component

const ProductCard = ({ product, isInCart }) => {
  const MAX_USP_LENGTH = 70; // Set the maximum length of the productUsp
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [selectProduct, setSelectProduct] = useState(isInCart);  // Track whether the product is in the cart
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Synchronize selectProduct state with the isInCart prop
  useEffect(() => {
    setSelectProduct(isInCart);  // Update the state if the product's cart status changes externally
  }, [isInCart]);

    const deleteCartItem = async (userId, productId) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/cart/item`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, productId }),
        });
  
        if (response.ok) {
          //successToast('Cart item deleted successfully');
          dispatch(removeCartItem({ _id: productId, user }));
          console.log(productId);
        } else {
          errorToast('Error deleting cart item');
        }
      } catch (error) {
        console.error('Error deleting cart item:', error);
        errorToast('Failed to delete cart item');
      }
    };
  // Handle adding/removing from the cart
  const handleUpdateCount = () => {
    if (selectProduct) {
      // If the product is already in the cart, remove it
      dispatch(removeCartItem({product, user}));
      dispatch(removeSellCartItem(product));
      if (user){
        deleteCartItem(user._id, product._id);
      }
      infoToast("Product removed from the cart");
    } else {
      // If the product is not in the cart, add it
      if(!user){
        const cartItem = {productId:product, quantity:1, mohit:"mnk"};
        console.log(cartItem);
        dispatch(updateCartItem(cartItem));
      }
      if (user){
        const cartItem = {productId:product, quantity:1};
        dispatch(syncCartWithServer({ userId: user._id, cartItems: [cartItem] }));
      }
      // dispatch(updateSellCartCount(product));
      successToast("Product added to the cart");
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
      {product.productUsp.length>MAX_USP_LENGTH?`${product.productUsp.slice(0,MAX_USP_LENGTH)}...`:product.productUsp}
      </p>
      <p className="product-price">
      <del>{product.mrp}</del> -{/* Crossed out original price */}
      {Math.floor(product.mrp - (product.mrp * (product.discount / 100)))} 
      </p>
      <button className={`product-cart ${selectProduct?"check":""}`} onClick={handleUpdateCount}>
        {selectProduct ? <FontAwesomeIcon icon={faCheck}/> :<FontAwesomeIcon icon={faPlus}/>}
      </button>
      <span className="offer-svg">
        <SVGComponent discount={parseInt(product.discount)} />
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

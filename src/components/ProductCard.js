import React, { useEffect, useState } from "react";
import "../styles/ProductCard.scss"; // Styling specific to ProductCard
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { removeCartItem, removeSellCartItem, updateCartItem, updateSellCartCount } from "../redux/cartSlice";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="product-card">
      <img onClick={handleProductPage}
        src={product.productImage}
        alt={product.title}
        className="product-image"
      />
      <h3 className="product-name" onClick={handleProductPage}>{product.title}</h3>
      <p className="product-price">
        {product.mrp}
      </p>
      <button className="product-cart" onClick={handleUpdateCount}>
        {selectProduct ? "Remove from Cart" : "Add to Cart"}
      </button>
      {selectProduct && (
        <div className="counter">
          <FontAwesomeIcon icon={faPlus} />
          {/* You can add a counter here if you want to display the number of items in the cart */}
        </div>
      )}
    </div>
  );
};

export default ProductCard;

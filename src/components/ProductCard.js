import React, { useEffect, useState } from "react";
import "../styles/ProductCard.scss"; // Styling specific to ProductCard
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { removeCartItem, removeSellCartItem, updateCartItem, updateSellCartCount } from "../redux/cartSlice";
import { ToastContainer, toast } from 'react-toastify';

const ProductCard = ({ product, isInCart }) => {
  const dispatch = useDispatch();
  const [selectProduct, setSelectProduct] = useState(isInCart);

  // Synchronize selectProduct state with the isInCart prop
  useEffect(() => {
    setSelectProduct(isInCart);
  }, [isInCart]);

  // Handle adding/removing from the cart
  const handleUpdateCount = () => {
    if (selectProduct) {
      dispatch(removeCartItem(product));
      dispatch(removeSellCartItem(product));
      toast.info("Product removed from the cart");
    } else {
      dispatch(updateCartItem(product));
      dispatch(updateSellCartCount(product));
      toast.success("Product added to the cart");
    }
    setSelectProduct((prev) => !prev);
  };

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">
        {product.price} <br /> <span>It is about description and sub description</span>
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

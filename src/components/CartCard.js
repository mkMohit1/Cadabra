import React, { useState } from 'react';
import "../styles/CartCard.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { removeCartItem, removeSellCartItem } from '../redux/cartSlice';

const CartCard = ({ item, handleQuantityChange, currentMode }) => {
  const dispatch = useDispatch();
  const [openMore, setOpenMore] = useState(false);

  const toggleMore = () => {
    setOpenMore((prevState) => !prevState);
  };

  // Ensure price is displayed with a currency symbol, for example ₹ or $.
  const price = currentMode === 'rent' ? item.rentprice : item.sellprice;
  const quantity = currentMode === "rent" ? item.rentquantity : item.sellQuantity;
  return (
    <div className="cart-item">
      <div className="cart-item-content">
        <div className="item-details">
          <img src={item.image} alt={item.name} className="item-image" />
          <div>
            <h4>{item.name}</h4>
            <p>{item.description}</p>
          </div>
        </div>
        <div className="quantity-controls">
          <button onClick={() => handleQuantityChange(item.id, -1)}>◄</button>
          <span>{quantity}</span>
          <button onClick={() => handleQuantityChange(item.id, 1)}>►</button>
        </div>
        <div className="item-actions">
          <span className="price">{price}</span>
          <button
            onClick={
              currentMode === 'rent'
                ? () => dispatch(removeCartItem(item))
                : () => dispatch(removeSellCartItem(item))
            }
            className="remove-button"
          >
            🗑️
          </button>
          <div
            className="more-item"
            onClick={toggleMore}
            aria-expanded={openMore}
            aria-controls={`more-content-${item.id}`}
          >
            <span className="icon">
              {openMore ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faPlus} />}
            </span>
          </div>
        </div>
      </div>
      {openMore && (
        <div id={`more-content-${item.id}`} className="more-content">
          {/* Placeholder for additional content */}
          <span>Additional Information</span>
        </div>
      )}
    </div>
  );
};

export default CartCard;

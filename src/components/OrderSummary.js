import React, { useState } from "react";
import "../styles/OrderSummary.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark, faTags } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const OrderSummary = ({currentCart,currentMode}) => {
  const [openMoreMap, setOpenMoreMap] = useState({}); // Track open state for each item
  const isAuthenticated = useSelector((state)=>state.auth.isAuthenticated); 

  const toggleMore = (id) => {
    setOpenMoreMap((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Toggle the state for the specific item
    }));
  };

  const calculateTotal = () => {
    if (!Array.isArray(currentCart)) {
      console.error("currentCart is not an array:", currentCart);
      return 0;
    }

    return currentCart.reduce((total, item) => {
      const priceString = currentMode === "rent" ? item.rentprice : item.sellprice;
      const price = parseFloat(priceString.replace(/[^0-9.]/g, "")) || 0;
      const quantity = currentMode === "rent" ? item.rentquantity : item.sellQuantity;
      return total + quantity * price;
    }, 0);
  };

  const handleCheckout = ()=>{
    if(!isAuthenticated){
      navigator('/login');
    }else{
      navigator('/checkout');
    }
  }

  const total = calculateTotal();

  return (
    <div className="order-summary">
      <h3 className="order-summary__title">Order Summary</h3>
      <div className="order-summary__items">
        {currentCart && currentCart.length > 0 ? (
          currentCart.map((item) => {
            const priceString = currentMode === "rent" ? item.rentprice : item.sellprice;
            const price = parseFloat(priceString.replace(/[^0-9.]/g, "")) || 0;
            const isOpen = openMoreMap[item.id] || false; // Check if this item's "more info" is open
            const quantity = currentMode === "rent" ? item.rentquantity : item.sellQuantity;
            console.log(price);
            return (
              <div className="order-summary__items__item" key={item.id}>
                <div className="order-summary__item__details">
                  <span className="item-label">{item.name}</span>
                  <span className="item-quantity">{quantity}x</span>
                  <span className="item-value">${(quantity * price).toFixed(2)}</span>
                  <div
                    className="more-item"
                    aria-expanded={isOpen}
                    onClick={() => toggleMore(item.id)}
                    aria-controls={`more-content-${item.id}`}
                  >
                    <span className="icon">
                      {isOpen ? (
                        <FontAwesomeIcon icon={faXmark} />
                      ) : (
                        <FontAwesomeIcon icon={faPlus} />
                      )}
                    </span>
                  </div>
                </div>
                {isOpen && (
                  <div id={`more-content-${item.id}`} className="more-content">
                    <span>Additional Information</span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>No items in your cart.</p>
        )}
      </div>
      <div className="order-summary__total">
        <span className="total-label">TOTAL</span>
        <span className="total-value">${total.toFixed(2)}</span>
      </div>
      <div className="order-summary__delivery">
        Estimated Delivery by <strong>01 Feb, 2023</strong>
      </div>
      <div className="order-summary__coupon">
        <input type="text" className="coupon-input" placeholder="Coupon Code" />
        <button className="apply-coupon-btn">
          <FontAwesomeIcon icon={faTags}/>
        </button>
      </div>
      <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
    </div>
  );
};

export default OrderSummary;
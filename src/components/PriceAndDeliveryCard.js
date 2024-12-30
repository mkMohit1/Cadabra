import React, { useState } from "react";
import "../styles/PriceAndDeliveryCard.scss";

const PriceAndDeliveryCard = () => {
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [serviceability, setServiceability] = useState(null);

  const checkPincode = () => {
    // Simulated pincode check
    if (pincode === "110092") {
      setServiceability({
        isEligible: false,
        deliveryTime: "4 day(s)",
        shippingCost: "₹49",
        prepaid: true,
      });
    } else {
      setServiceability(null);
    }
  };
  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity(quantity + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handlePincodeCheck = () => {
    if (pincode === "110092") {
      setDeliveryMessage("Delivery available at 110092 in 4 day(s)");
    } else {
      setDeliveryMessage("Pincode is not eligible for 24 hours delivery");
    }
  };

  return (
    <>
    <div className="price-delivery-card">
      <div className="price-section">
        <p className="final-price">
          ₹804 <span>(Incl. of all taxes)</span>
        </p>
        <p className="gst">+ ₹144 GST</p>
        <p className="mrp">
          MRP <span>₹2,998</span> <span className="discount">68% OFF</span>
        </p>
      </div>

      <div className="quantity-section">
        <p>Update Qty</p>
        <div className="quantity-controls">
          <button onClick={() => handleQuantityChange("decrement")}>-</button>
          <input type="text" value={quantity} readOnly />
          <button onClick={() => handleQuantityChange("increment")}>+</button>
        </div>
      </div>

      <div className="action-buttons">
        <button className="add-to-cart">Add to Cart</button>
        <button className="buy-now">Rent Now</button>
        <button className="rent-now">Buy Now</button>
      </div>
    </div>
    <div className="delivery-card">
      <h3 className="title">Delivery Details</h3>
      <div className="pincode-section">
        <input
          type="text"
          placeholder="Enter Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="pincode-input"
        />
        <button className="check-button" onClick={checkPincode}>
          CHECK
        </button>
      </div>
      <p className="check-note">Check serviceability at your location</p>

      {serviceability ? (
        <div className="serviceability-info">
          <p className="not-eligible">
            <span role="img" aria-label="warning">
              ⚡
            </span>{" "}
            Pincode is not eligible for 24 hours delivery
          </p>
          <p className="shipping">
            <span role="img" aria-label="truck">
              🚚
            </span>{" "}
            Shipping applicable - {serviceability.shippingCost}
          </p>
          <p className="delivery-time">
            <span role="img" aria-label="calendar">
              📅
            </span>{" "}
            Delivery available at {pincode} in {serviceability.deliveryTime}
          </p>
          {serviceability.prepaid && (
            <p className="prepaid">
              <span role="img" aria-label="payment">
                💳
              </span>{" "}
              Prepaid payment only
            </p>
          )}
        </div>
      ) : (
        <p className="no-info">Enter a valid pincode to check details</p>
      )}
    </div>
    </>
  );
};

export default PriceAndDeliveryCard;

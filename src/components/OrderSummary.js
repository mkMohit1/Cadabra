import React, { useEffect, useState } from "react";
import "../styles/OrderSummary.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark, faTags } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentContainer } from "../redux/cartSlice";
import { toast } from "react-toastify";
import axios from "axios"; // Make sure you import axios
import LoginPage from "../Pages/LoginPage";
import { login } from "../redux/authSlice";

const OrderSummary = ({ currentCart, currentMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openMoreMap, setOpenMoreMap] = useState({}); // Track open state for each item
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const currentContainer = useSelector((state) => state.cart.currentContainer);
  const [showAskNumber, setShowAskNumber] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [isOtpFieldVisible, setIsOtpFieldVisible] = useState(false);
  const [formData, setFormData] = useState({
    mobileNumber: "",
    enteredOtp: "",
    otp: "",
    userID: null,
    name: '',
    email:'',
    isUser: false,
    otpFieldVisible: false,
    otpSent: false,
    loginWith: "whatsapp", // Default login method
  });

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
      const price = currentMode === "rent" ? item.mrp : item.mrp;
      const quantity = currentMode === "rent" ? item.rentQuantity : item.saleQuantity;
      return total + quantity * price;
    }, 0);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowAskNumber(true);
      toast.info("please logged in");
      return;
    }
    if (currentContainer == "CartItem") {
      dispatch(updateCurrentContainer("AddressContainer"));
    }
    if (currentContainer == "AddressContainer") {
      dispatch(updateCurrentContainer("Shipping"));
    }
  };

  const handleClose = () => {
    setShowAskNumber(false);
  };

  const generateOtp = () => {
    let otp = "";
    for (let i = 0; i < 4; i++) {
      otp += Math.floor(Math.random() * 9) + 1;
    }
    return otp;
  };

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Handle sending OTP
  const handleSendOtp = async (event) => {
    event.preventDefault();
    const { mobileNumber, loginWith } = formData;
    // Validate mobile number format
    if (!/^\d{10}$/.test(mobileNumber)) {
      toast.error("Please enter a valid mobile number.");
      return;
    }
    // Check if the user exists
    const allUsers = await (await fetch("http://localhost:5000/users")).json();
    const existingUser = allUsers.find((user) => user.mobileNumber === mobileNumber);

    const otp = generateOtp();
    updateFormData({ otp });

    try {
      const response = await axios.post(`http://localhost:5000/send-otp`, {
        mobileNumber,
        otp,
        type: loginWith,
        newUser:true
      });

      if (response.status === 200) {
        updateFormData({
          otpFieldVisible: true,
          otpSent: true, // Update OTP sent status
        });
        toast.success(`OTP sent successfully via ${loginWith}.`);
        setIsOtpFieldVisible(true);
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const handleSubmitOTP = async (event) => {
    event.preventDefault();
    const { enteredOtp, otp, mobileNumber } = formData;
    let existingUser;
    const allUsers = await (await fetch("http://localhost:5000/users")).json();
    const userfound = allUsers.find((user) => user.mobileNumber === mobileNumber);
    if(!newUser){
      existingUser = await (await fetch(`http://localhost:5000/user/${mobileNumber}`)).json();
    }
    if(!userfound){
      setNewUser(true);
    }
    
    if (enteredOtp === otp) {
      toast.success("Login successful!");

      if(!newUser){
        console.log(existingUser);
        dispatch(login({ mobileNumber, userID: formData.userID, isAdmin: existingUser.type }));
      }
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleUpdateUser = async(event)=>{
    try {
        const addUser = await fetch("",{
          method:'POST',
          headers:{
            
          }
        });
    } catch (error) {
      toast.error(error.message);
    }
  }

  const temp = useSelector((state) => state.cart.currentContainer);
  console.log(temp);
  const total = calculateTotal();

  useEffect(()=>{
    if(document.getElementsByClassName('popup').length > 0){
      document.body.style.overflow = "hidden";
    }else{
      document.body.style.overflow='initial';
    }
  },[showAskNumber])

  return (
    <div className="order-summary">
      <h3 className="order-summary__title">Order Summary</h3>
      <div className="order-summary__items">
        {currentCart && currentCart.length > 0 ? (
          currentCart.map((item) => {
            console.log(item);

            const price = currentMode === "rent" ? item.mrp : item.mrp;
            const isOpen = openMoreMap[item.id] || false; // Check if this item's "more info" is open
            const quantity = currentMode === "rent" ? item.rentQuantity : item.saleQuantity;
            console.log(price);
            return (
              <div className="order-summary__items__item" key={item.id}>
                <div className="order-summary__item__details">
                  <span className="item-label">{item.title}</span>
                  <span className="item-quantity">{1}x</span>
                  <span className="item-value">${(quantity * price).toFixed(2)}</span>
                  <div
                    className="more-item"
                    aria-expanded={isOpen}
                    onClick={() => toggleMore(item.id)}
                    aria-controls={`more-content-${item.id}`}
                  >
                    <span className="icon">
                      {isOpen ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faPlus} />}
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
          <FontAwesomeIcon icon={faTags} />
        </button>
      </div>
      <button className="checkout-btn" onClick={handleCheckout}>
        Proceed to Checkout
      </button>
      {showAskNumber && (
        <div className="popup" style={newUser?{height:"100%", top:0}:null}>
          <div className="askNumber">
            <button className="closePopup" onClick={handleClose}>
              x
            </button>
            <form onSubmit={!isOtpFieldVisible ? handleSendOtp : (isOtpFieldVisible && !newUser)? handleSubmitOTP: handleUpdateUser} >
              {/* Mobile Number Input */}
              {(!isOtpFieldVisible && !newUser) && (
                <input
                  type="text"
                  placeholder="mobile number"
                  onChange={(e) => updateFormData({ mobileNumber: e.target.value })}
                  value={formData.mobileNumber}
                />
              )}

              {/* OTP Input */}
              {(isOtpFieldVisible && !newUser) && (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  onChange={(e) => updateFormData({ enteredOtp: e.target.value })}
                  value={formData.enteredOtp}
                />
              )}
              {newUser && (
                <>
                  <div className="form-group">
                  <label>Name:</label>
                  <input type="text" name="name" value={formData.name} onChange={(e)=>updateFormData({name:e.target.value})} />
                </div>
      
                <div className="form-group">
                  <label>Email:</label>
                  <input type="email" name="email" value={formData.email} onChange={(e)=>updateFormData({email:e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phone:</label>
                  <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={(e)=>updateFormData({mobileNumber:e.target.value})} />
                </div>
              </>
              )}

              {/* Submit Button */}
              <button type="submit">
                {!isOtpFieldVisible ? "Send OTP" : (isOtpFieldVisible && !newUser)? "Submit OTP":'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;

import React, { useEffect, useState } from "react";
import "../styles/OrderSummary.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark, faTags } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentContainer } from "../redux/cartSlice";
import { infoToast,errorToast, successToast } from "../DecryptoAndOther/ToastUpdate";
import axios from "axios"; // Make sure you import axios
import LoginPage from "../Pages/LoginPage";
import { login } from "../redux/authSlice";
import { normalImages } from "../ImagePath";

const OrderSummary = ({ currentCart, currentMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openMoreMap, setOpenMoreMap] = useState({}); // Track open state for each item
  const user = useSelector((state) => state.auth.user);
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
    if (!user) {
      setShowAskNumber(true);
      infoToast("please logged in");
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
      errorToast("Please enter a valid mobile number.");
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
        successToast(`OTP sent successfully via ${loginWith}.`);
        setIsOtpFieldVisible(true);
      } else {
        errorToast("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      errorToast("Failed to send OTP. Please try again.");
    }
  };

  const handleSubmitOTP = async (event) => {
    event.preventDefault();
    const { enteredOtp, otp, mobileNumber } = formData;
    let existingUser;
    if(enteredOtp ===''){
      return;
    }
    if (enteredOtp === otp) {
    const allUsers = await (await fetch("http://localhost:5000/users")).json();
    const userfound = allUsers.find((user) => user.mobileNumber === mobileNumber);
    if(!newUser){
      existingUser = await (await fetch(`http://localhost:5000/user/${mobileNumber}`)).json();
    }
    if(!userfound){
      setNewUser(true);
    }
      successToast("Login successful!");

      if(!newUser){
        console.log(existingUser);
        dispatch(login({ mobileNumber, userID: formData.userID, isAdmin: existingUser.role }));
      }
      if(userfound){
        setShowAskNumber(false);
      }
    } else {
      errorToast("Invalid OTP. Please try again.");
    }
  };

  const handleUpdateUser = async(event)=>{
    event.preventDefault();
    try {
      console.log(formData);
      const customerData= {name:formData.name, email: formData.email,mobileNumber: formData.mobileNumber, role:'commonUser', loginWith:formData.loginWith};
        // // Sending separate data for the user and the address
        const response = await fetch('http://localhost:5000/register/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({customerData}),
        });
  
        if (response.ok) {
          const result = await response.json();
          successToast(result.message);
          handleClose(); // Hide the form after submission
        }
    } catch (error) {
      errorToast(error.message);
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
    return ()=>{
      document.body.style.overflow='initial';
    }
  },[showAskNumber])

  return (
    <div className="bg-white rounded-lg shadow-md p-6 ">
      <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
      
      <div className="space-y-4">
        {currentCart && currentCart.length > 0 ? (
          currentCart.map((item) => {
            const price = currentMode === "rent" ? item.mrp : item.mrp;
            const isOpen = openMoreMap[item.id] || false;
            const quantity = currentMode === "rent" ? item.rentQuantity : item.saleQuantity;
            
            return (
              <div key={item.id} className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <span className="font-medium">{item.title}</span>
                    <div className="text-sm text-gray-600">
                      <span>Quantity: {quantity}</span>
                      <span className="ml-4">${(quantity * price).toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleMore(item.id)}
                    className="ml-4 text-gray-500 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={isOpen ? faXmark : faPlus} />
                  </button>
                </div>
                
                {isOpen && (
                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <span>Additional Information</span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No items in your cart.</p>
        )}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between items-center mb-6">
          <span className="font-semibold">TOTAL</span>
          <span className="text-xl font-bold">${total.toFixed(2)}</span>
        </div>

        <div className="text-sm text-gray-600 mb-6">
          Estimated Delivery by <strong>01 Feb, 2023</strong>
        </div>

        <div className="flex space-x-2 mb-6">
          <input
            type="text"
            className="flex-1 p-2 border rounded"
            placeholder="Coupon Code"
          />
          <button className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            <FontAwesomeIcon icon={faTags} />
          </button>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>

      {showAskNumber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
  <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
    <div className="flex flex-col md:flex-row h-full">
      {/* Left side - Image */}
      <div className="w-full md:w-1/2 relative">
        <img 
          src={normalImages.loginPage} 
          alt="Login" 
          className="w-full h-full min-h-[400px] object-cover"
        />
      </div>

      {/* Divider between left and right */}
      <div className="hidden md:block w-1 bg-gray-300"></div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 p-8 relative">
        <button 
          className="absolute right-4 top-4 text-gray-600 hover:text-gray-800 text-xl font-bold z-10"
          onClick={handleClose}
        >
          ×
        </button>

        <div className="h-full flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Welcome Back</h2>
          
          <form 
            className="space-y-6"
            onSubmit={!isOtpFieldVisible ? handleSendOtp : (isOtpFieldVisible && !newUser) ? handleSubmitOTP : handleUpdateUser}
          >
            {(!isOtpFieldVisible && !newUser) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your mobile number"
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => updateFormData({ mobileNumber: e.target.value })}
                  value={formData.mobileNumber}
                />
              </div>
            )}

            {(isOtpFieldVisible && !newUser) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => updateFormData({ enteredOtp: e.target.value })}
                  value={formData.enteredOtp}
                />
              </div>
            )}

            {newUser && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input 
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.email}
                    onChange={(e) => updateFormData({ email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input 
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.mobileNumber}
                    onChange={(e) => updateFormData({ mobileNumber: e.target.value })}
                  />
                </div>
              </>
            )}

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              {!isOtpFieldVisible ? "Send OTP" : (isOtpFieldVisible && !newUser) ? "Submit OTP" : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

      )}
    </div>
  );
};

export default OrderSummary;

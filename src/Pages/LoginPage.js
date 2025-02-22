import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "../styles/LoginPage.scss";
import {normalImages} from "../ImagePath";
import { login } from "../redux/authSlice";
import { successToast, errorToast, infoToast } from "../DecryptoAndOther/ToastUpdate";
import { updateCartItem } from "../redux/cartSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    mobileNumber: "",
    enteredOtp: "",
    otp:"",
    otpSent: false,
    otpFieldVisible: false,
    loginWith: "whatsapp", // Default login method
    newUser: false, // Tracks if the user is new
  });
  // Fallback for OTP generation
  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit OTP
  };
  const { mobileNumber, enteredOtp, otpSent, otpFieldVisible, loginWith, newUser } = formData;

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Function to request OTP
  const handleSendOtp = async (event) => {
    event.preventDefault();

    if (!/^\d{10}$/.test(mobileNumber)) {
      errorToast("Please enter a valid 10-digit mobile number.");
      return;
    }
    const otp = generateOtp();
    updateFormData({otp:otp});
    console.log(formData);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/send-otp`, {
        mobileNumber,
        otp,
        type: loginWith,
        newUser, // Send newUser flag
      });

      if (response.status === 200) {
        successToast(`OTP sent via ${loginWith}.`);
        if(mobileNumber ==='1234567890' || mobileNumber ==='1234567891' || mobileNumber ==='1234567892' || mobileNumber ==='1234567893' || mobileNumber ==='1234567894'){
          console.log( `MobileNumber: ${mobileNumber} and it's otp: ${otp}`);
        }
        updateFormData({ otpSent: true, otpFieldVisible: true });
      }
    } catch (error) {
      errorToast(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    }
  };

  // Function to submit OTP and (login or register)
  const handleSubmitOtp = async (event) => {
    event.preventDefault();
    console.log({
      mobileNumber,
      enteredOtp,
      actualOtp: formData.otp,
      newUser: formData.newUser,
  });
    if (!enteredOtp) {
      errorToast("Please enter the OTP.");
      return;
    }
    try {
      // Determine the API endpoint based on newUser flag
      const endpoint = newUser
        ? `${process.env.REACT_APP_BACK_URL}/register/verify` // Registration OTP verification
        : `${process.env.REACT_APP_BACK_URL}/login`;        // Login OTP verification
  
      const response = await axios.post(endpoint, {
        mobileNumber,
        enteredOtp,
        actualOtp: formData.otp,
        newUser:formData.newUser,
        loginWith
      });
      
      if (response.status === 200) {
        const { user } = response.data;
        console.log(response.data);
        // Success message
        if (newUser) {
          successToast("Registration successful!");
        } else {
          successToast("Login successful!");
        }
        // console.log("Login successful! after",user);
        // Dispatch user data to the store
        dispatch(login(user));
        // set the cartItems to the store
        if(user.cart.length>0){
          user.cart.map((item) => {
            dispatch(updateCartItem(item));
          });
        }
        // Navigate based on user role
        // if (user.role === "SuperAdmin" || user.role === "SaleAdmin" || user.role==='ProductAdmin' || user.role==='SaleManager') {
        //   navigate("/admin");
        // } else {
        //   navigate("/");
        // }
      }
    } catch (error) {
      errorToast(
        error.response?.data?.message ||
          (newUser
            ? "Failed to register. Please try again."
            : "Failed to login. Please try again.")
      );
    }
  };
  
  // Toggle between Login and Register views
  const handleLoginState = () => {
    updateFormData({
      mobileNumber: "",
      enteredOtp: "",
      opt:'',
      otpSent: false,
      otpFieldVisible: false,
      loginWith: "whatsapp",
      newUser: !newUser, // Toggle between login and registration
    });
  };

  // Handle switching between login methods (WhatsApp/Voice)
  const handleLoginMode = (method) => {
    updateFormData({
      loginWith: method,
      otpSent: false,
      otpFieldVisible: false,
    });
    infoToast(`Switched to ${method} login method.`);
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    const newUserParam = newUser ? 'true' : 'false';
    window.open(`${process.env.REACT_APP_BACK_URL}/auth/google?newUser=${newUserParam}`, "_self");
  };
  // console.log(newUser);
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border-2 border-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
        {!newUser ? 'Login' : 'Register'}
      </h2>
      
      <form onSubmit={!otpFieldVisible ? handleSendOtp : handleSubmitOtp} className="flex flex-col space-y-6">
        {!otpFieldVisible && (
          <div className="flex flex-col space-y-2">
            <label className="font-semibold text-gray-700 text-sm ml-2">
              Mobile Number
            </label>
            <input
              type="text"
              placeholder="Mobile Number *"
              value={mobileNumber}
              onChange={(e) => updateFormData({ mobileNumber: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded text-sm transition focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
              required
            />
          </div>
        )}

        {otpFieldVisible && (
          <div className="flex flex-col space-y-2">
            <label className="font-semibold text-gray-700 text-sm ml-2">
              Enter OTP
            </label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={enteredOtp}
              onChange={(e) => updateFormData({ enteredOtp: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded text-sm transition focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full px-4 py-3 bg-emerald-600 text-white font-medium rounded hover:bg-emerald-700 transition flex items-center justify-center"
        >
          {otpSent ? "Submit OTP" : "Request OTP"}
        </button>

        <div className="flex flex-col space-y-3">
          {loginWith === 'whatsapp' ? (
            <button 
              type="button"
              onClick={() => handleLoginMode('voice')}
              className="w-full px-4 py-3 border border-gray-200 rounded flex items-center justify-center space-x-3 hover:bg-gray-50 transition"
            >
              <img src={normalImages.whatsApp} alt="WhatsApp" className="w-6 h-6" />
              <span className="text-sm">Login with WhatsApp</span>
            </button>
          ) : (
            <button 
              type="button"
              onClick={() => handleLoginMode('whatsapp')}
              className="w-full px-4 py-3 border border-gray-200 rounded flex items-center justify-center space-x-3 hover:bg-gray-50 transition"
            >
              <img src={normalImages.loginCall} alt="Voice" className="w-6 h-6" />
              <span className="text-sm">Login with Voice OTP</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full px-4 py-3 border border-gray-200 rounded flex items-center justify-center space-x-3 hover:bg-gray-50 transition"
          >
            <img src={normalImages.google} alt="Google" className="w-6 h-6" />
            <span className="text-sm">{!newUser?"Login with Google":"Register with Google"}</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-700 mt-4">
          {!newUser ? 'Not a member? ' : 'Already a member? '}
          <button
            type="button"
            onClick={handleLoginState}
            className="font-bold text-gray-700 hover:text-emerald-600 transition"
          >
            {!newUser ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </div>
  </div>
  );
};

export default LoginPage;

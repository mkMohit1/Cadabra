import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/LoginPage.scss";
import { normalImages as images, normalImages } from "../ImagePath";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { infoToast,errorToast, successToast } from "../DecryptoAndOther/ToastUpdate";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    mobileNumber: "",
    enteredOtp: "",
    otp: "",
    userID: null,
    isUser: false,
    otpFieldVisible: false,
    otpSent: false,
    loginWith: "whatsapp", // Default login method
  });

  const user = useSelector((state) => state.auth.user);
  
  const [isLoginView, setIsLoginView] = useState(true); // Track if the view is Login or Register
  const [newUser, setNewUser] = useState(false);
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
    const allUsers = await (await fetch('http://localhost:5000/users')).json();
    const existingUser = allUsers.find((user) => user.mobileNumber === mobileNumber);

    if (!existingUser) {
      errorToast("User not found. Please register first.");
      return;
    }

    const otp = generateOtp();
    updateFormData({ otp });

    try {
      const response = await axios.post(`http://localhost:5000/send-otp`, {
        mobileNumber,
        otp,
        type: loginWith,
        newUser
      });

      if (response.status === 200) {
        updateFormData({
          otpFieldVisible: true,
          otpSent: true, // Update OTP sent status
        });
        successToast(`OTP sent successfully via ${loginWith}.`);
        updateFormData({ userID: existingUser._id });
      } else {
        errorToast("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      errorToast("Failed to send OTP. Please try again.");
    }
  };

  // Handle OTP submission
  const handleSubmitOtp = async (event) => {
    event.preventDefault();
    const { enteredOtp, otp, mobileNumber } = formData;
    const existingUser = await (await fetch(`http://localhost:5000/user/${mobileNumber}`)).json();

    if (enteredOtp === otp) {
      successToast("Login successful!");
      dispatch(login({ mobileNumber, userID: formData.userID, isAdmin: existingUser.type, type:formData.loginWith }));
      
      // Redirect the user based on their role after login
      if (existingUser.type === 'SupperAdmin' || existingUser.type === 'SaleAdmin' || existingUser.type === 'ProductAdmin' || existingUser.type === 'SaleManager') {   
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      errorToast("Invalid OTP. Please try again.");
    }
  };

  // Toggle between Login and Register views
  const handleLoginState = () => {
    setIsLoginView((prev) => !prev);
    newUser((prev)=>!prev);
    setFormData({
      mobileNumber: "",
      enteredOtp: "",
      otp: "",
      userID: null,
      isUser: false,
      otpFieldVisible: false,
      otpSent: false,
      loginWith: "whatsapp",
    });
  };

  // Handle switching between login methods (WhatsApp/Voice)
  const handleLoginMode = (method) => {
    updateFormData({
      loginWith: method,
      otpFieldVisible: false,
      otpSent: false,
    });
    infoToast(`Switched to ${method} login method`);
  };

  // Handle Google login (redirects to the backend)
  const handleGoogleLogin = async () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  const {
    mobileNumber,
    enteredOtp,
    otpFieldVisible,
    otpSent,
    loginWith,
  } = formData;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {isLoginView ? 'Login' : 'Register'}
        </h2>
        
        <form onSubmit={!otpFieldVisible ? handleSendOtp : handleSubmitOtp} className="auth-form">
          {/* Mobile Number Input Field */}
          {!otpFieldVisible && (
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input
                type="text"
                placeholder="Mobile Number *"
                value={mobileNumber}
                onChange={(e) => updateFormData({ mobileNumber: e.target.value })}
                className="form-input"
                required
              />
            </div>
          )}

          {/* OTP Input Field */}
          {otpFieldVisible && (
            <div className="form-group">
              <label className="form-label">Enter OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={enteredOtp}
                onChange={(e) => updateFormData({ enteredOtp: e.target.value })}
                className="form-input"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            {otpSent ? "Submit OTP" : "Request OTP"}
          </button>

          {/* Social Buttons for different login methods */}
          <div className="social-buttons">
            {loginWith === 'whatsapp' ? (
              <button 
                type="button"
                onClick={() => handleLoginMode('voice')}
                className="social-button whatsapp"
              >
                <img src={normalImages.whatsApp} alt="WhatsApp" className="social-icon" />
                <span>Login with WhatsApp</span>
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => handleLoginMode('whatsapp')}
                className="social-button voice"
              >
                <img src={normalImages.loginCall} alt="Voice" className="social-icon" />
                <span>Login with Voice OTP</span>
              </button>
            )}

            <button type="button" className="social-button google" onClick={handleGoogleLogin}>
              <img src={normalImages.google} alt="Google" className="social-icon" />
              <span>Login with Google</span>
            </button>
          </div>

          {/* Toggle between Login/Register view */}
          <p className="toggle-text">
            {isLoginView ? 'Not a member? ' : 'Already a member? '}
            <button
              type="button"
              onClick={handleLoginState}
              className="toggle-button"
            >
              {isLoginView ? 'Register' : 'Login'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

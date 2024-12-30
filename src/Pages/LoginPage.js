import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/LoginPage.scss";
import { normalImages as images } from "../ImagePath";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { toast } from "react-toastify";

const LoginPage = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    mobileNumber: "",
    enteredOtp: "",
    otp: "",
    userID: null,
    errorMessage: "",
    successMessage: "",
    isUser: false,
    otpFieldVisible: false,
    otpSent: false,
    loginWith: "whatsapp", // Default login method
  });
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleSendOtp = async (event) => {
    event.preventDefault();
    const { mobileNumber, loginWith } = formData;
    // Validate mobile number format
    if (!/^\d{10}$/.test(mobileNumber)) {
      updateFormData({ errorMessage: "Please enter a valid mobile number." });
      return;
    }
    // Check if the user exists
    const allUsers = await (await fetch('http://localhost:5000/users')).json();
    console.log(allUsers.length);
    const existingUser = allUsers.length !=undefined && allUsers.find((user) => user.mobileNumber === mobileNumber);
    console.log(existingUser);
     // Conditional message handling with Toastify
     if (location.pathname === '/admin-login' && existingUser && existingUser.type === 'commonUser') {
      toast.error("You are not an Admin. Please login as a user.");  // Use Toastify for error message
      return;
    } else if (location.pathname === '/login' && existingUser && existingUser.type !== 'commonUser') {
      toast.error("You are an Admin. Please login as an Admin.");  // Use Toastify for error message
      return;
    }
    if (!existingUser) {
      toast.error("User not found. Please register first.");  // Use Toastify for error message
      return;
    }
    // Generate OTP
    const otp = generateOtp();
    updateFormData({ otp });
    console.log("otp:", otp);
    // Send OTP based on selected method (WhatsApp or Voice)
    try {
      const response = await axios.post(`http://localhost:5000/send-otp`, {
        mobileNumber,
        otp,
        type: loginWith,  // Passing the selected login method
      });
      if (response.status === 200) {  
        updateFormData({
          successMessage: `OTP sent successfully via ${loginWith}.`,
          otpFieldVisible: true,
          otpSent: true,
        });
        setUser({ mobileNumber, isAdmin: existingUser.type, userID: existingUser._id });
        // Store OTP and user details in localStorage
        updateFormData({ userID: existingUser._id });
      } else {
        updateFormData({ errorMessage: "Failed to send OTP. Please try again." });
      }
    } catch (error) {
      updateFormData({ errorMessage: "Failed to send OTP. Please try again." });
    }
  };

  const handleSubmitOtp = (event) => {
    event.preventDefault();
    const { enteredOtp, otp, mobileNumber } = formData;

    if (enteredOtp === otp) {
      const formattedMobileNumber = mobileNumber.replace(/^(\+91|91|0)/, "");
      toast.success("Login successful!");  // Use Toastify for success message
      setFormData({ successMessage: "Login successful!", errorMessage: "" });
      dispatch(login(user));
      if(user.isAdmin !== 'commonUser') {
        navigate("/admin");  // Redirect after login
      }else{
        navigate("/");  // Redirect after login
      }
      
    } else {
      toast.error("Invalid OTP. Please try again.");
      updateFormData({ errorMessage: "Invalid OTP. Please try again.", successMessage: "" });
    }
  };

  const handleLoginMode = (method) => {
    // Toggle between WhatsApp and Voice OTP login methods
    updateFormData({
      loginWith: method,
      otpFieldVisible: false,
      otpSent: false,
      errorMessage: "",
      successMessage: "",
    });
  };

  const {
    mobileNumber,
    enteredOtp,
    otpFieldVisible,
    otpSent,
    errorMessage,
    successMessage,
    loginWith,
  } = formData;

  return (
    <div className="user-panel">
      <div className="user-panel__left">
        <div className="user-panel__content">
          <div className="user-panel__header">
            <img src={images.imageBlack} alt="login_text" className="logo" />
            <img src={images.loginSub} alt="login_subtext" className="subtext" />
          </div>
          <form onSubmit={enteredOtp ? handleSubmitOtp : handleSendOtp}>
            <div className="user-panel__message">
              {errorMessage && !loginWith && <p className="error">{errorMessage}</p>}
              {successMessage && <p className="success">{successMessage}</p>}
            </div>

            <div className="user-panel__input">
              {!otpFieldVisible && (
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    value={mobileNumber}
                    onChange={(e) => updateFormData({ mobileNumber: e.target.value })}
                    className="input-field"
                  />
                </div>
              )}
              {otpFieldVisible && (
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="OTP"
                    value={enteredOtp}
                    onChange={(e) => updateFormData({ enteredOtp: e.target.value })}
                    className="input-field"
                  />
                </div>
              )}
            </div>

            <div className="user-panel__actions">
              <button
                type="submit"
                className="button button--otp"
                disabled={otpSent && !enteredOtp}
              >
                {otpSent ? "Submit OTP" : "Request OTP"}
              </button>
            </div>

            <p className="user-panel__alternative">
              <strong>Login</strong> with Others
            </p>

            <div className="user-panel__other-login">
              {loginWith === 'whatsapp' ? (
                <button className="button button--whatsapp" onClick={() => handleLoginMode('voice')}>
                  <img src="https://cdn-icons-png.flaticon.com/128/3670/3670051.png" alt="Whatsapp Logo" className="icon" />
                  <span>Login with WhatsApp</span>
                </button>
              ) : (
                <button className="button button--voice" onClick={() => handleLoginMode('whatsapp')}>
                  <img src="https://cdn-icons-png.flaticon.com/128/3616/3616215.png" alt="Call Logo" className="icon" />
                  <span>Login with Voice OTP</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="user-panel__right" style={{ backgroundImage: `url(${images.loginImg})` }}>
        <div className="user-panel__image">
          <img src={images.loginPage} alt="Tab Image" className="login-image" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

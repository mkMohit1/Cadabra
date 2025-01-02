import React from "react";
import "../styles/SubscribeSection.scss"; // Assuming SCSS for styling
import { Bold } from "lucide-react";

const SubscribeSection = () => {
  return (
    <div className="subscribe-section">
      <div className="content">
        <h2><span style={{fontSize:35}}>Join Our Community{" "}</span>
        <span style={{fontSize:20, color:"lightgray", letterSpacing:-1, fontWeight:"bold"}}>Subscribe Today!</span></h2>
        <form className="subscribe-form">
          <input
            type="email"
            placeholder="Your email address"
            className="email-input"
          />
          <button type="submit" className="start-button">
            Start now
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubscribeSection;

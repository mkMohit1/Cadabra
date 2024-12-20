import React from "react";
import "../styles/SubscribeSection.scss"; // Assuming SCSS for styling

const SubscribeSection = () => {
  return (
    <div className="subscribe-section">
      <div className="content">
        <h2><span style={{fontSize:40}}>Join Our Community</span><br/>
        Subscribe Today!</h2>
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

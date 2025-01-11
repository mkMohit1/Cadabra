import React, { useState } from 'react';
import '../styles/ContactPage.scss';
import { contactImage, mainLogo } from '../ImagePath';
import { useSelector } from 'react-redux';
import { errorToast, successToast } from '../DecryptoAndOther/ToastUpdate';

const ContactForm = () => {
    const user = useSelector((state)=>state.auth.user);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    mobile:user.mobileNumber?user.mobileNumber:'',
    type: user.type
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle form submission
    if(!user){
        errorToast("Please signin.")
        return;
    }
    try {
        const response = await fetch('http://localhost:5000/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          successToast('Your message has been sent successfully!');
          setFormData({ name: '', email: '', message: '' }); // Reset form but keep mobile
        } else {
          const errorText = await response.text();
          errorToast(`Failed to send your message. Error: ${errorText}`);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        errorToast('An error occurred. Please try again later.');
      }
  };

  return (
    <div className="contact-container">
      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Left Side - Liberty Statue and Hands */}
          <div className="statue-section">
            <div className="yellow-circle">
                <div className='white-circle'></div>
            </div>
            <div className="statue-container">
              <img
                src={contactImage[0]}
                alt="Statue of Liberty"
                className="statue-image"
              />
              <div className="hand top-hand">
                <img src={contactImage[1]}
                alt='right hand'
                className='hand-image'/>
            </div>
            <div className="hand bottom-hand">
            <img src={contactImage[2]}
                alt='bottom hand'
                className='hand-image'/>
            </div>
            </div>
            
            <div className="curved-text">Get in touch & let's make something</div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="form-section">
            <div className="form-container">
                <div className='formlogo'>
                <img src={mainLogo.mainLogo4} alt='logo'/>
                </div>              

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name *"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address *"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="submit-button">
                  Let's talk! →
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactForm;
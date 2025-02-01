import React, { useState } from 'react';
import '../styles/ContactPage.scss';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { errorToast, successToast } from '../DecryptoAndOther/ToastUpdate';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/ContactPage.scss";
import L from "leaflet";

// Fix the missing marker icon issue in Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";
import { normalImages } from '../ImagePath';
import { NavLink } from 'react-router-dom';
import { event } from 'jquery';
import { faEnvelope, faMapPin, faMobileScreen } from '@fortawesome/free-solid-svg-icons';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerIconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const ContactForm = () => {
  const coordinates = [28.597758414720253, 77.03544492320528]; // NYC Coordinates (latitude, longitude)
  const user = useSelector((state)=>state.auth.user);
  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    mobileNumber:'', //user && user.mobileNumber?user.mobileNumber:
    type: user && user.type
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value  // ✅ This now correctly updates the form data
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle form submission
    if(!user){
        errorToast("Please signin.")
        return;
    }
    try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          successToast('Your message has been sent successfully!');
          setFormData({ name: '',mobileNumber:'' ,email: '', message: '' }); // Reset form but keep mobile
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
    <div className="flex min-h-5xl items-center justify-center bg-white pt-[50px] pb-[20px] relative font-mulish">
      {/* <div className='absolute md:w-[50%] custom-bg-black bg-black md:h-[100%] z-1 left-0 sm:w-full sm:h-[60%] sm:top-0'></div>
      <div className='absolute md:w-[50%] custom-bg-white bg-white md:h-[100%] z-1 right-0 sm:w-full sm:h-[40.7%] sm:bottom-0'></div> */}
      <div className="bg-white shadow-[8px_8px_1px_rgba(211,211,211,0.7)] border-gray-400 border-[2px] overflow-hidden md:flex w-4/5 max-w-4xl z-10 mt-[2rem] mb-[1rem]">
        {/* Left Form Section */}
        <div className="w-full md:w-1/2 p-8 py-4">
          <h2 className="text-3xl font-bold mb-4 text-black">
            <span className="border-b-2 border-black">Contact</span> us
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Your Name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="phone">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name='mobileNumber'
                required
                value={formData.mobileNumber}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Your mobile number"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                 name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Your Email (optional)"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                rows="2"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked onChange={()=>setDisabled(prev=>!prev)} className="form-checkbox h-5 w-5 " /> {/*peer hidden*/}
                {/* <div className="w-6 h-6 border-2 border-gray-400 rounded-md flex items-center justify-center peer-checked:bg-gradient-to-r peer-checked:from-blue-400 peer-checked:to-purple-600 transition-all duration-300">
                <svg
                  className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div> */}
                <span className="ml-2 text-sm text-gray-700">
                  I consent to the collection and processing of my personal data.
                </span>
              </label>
            </div>
            <button
              type="submit"
              disabled={disabled}
              className="w-full text-white py-2 px-4 mb-2 bg-gradient-to-r from-blue-400 to-purple-600 transition duration-200"
              style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.7 : 1, hover: disabled ? '' : 'bg-gray-700', backgroundColor: disabled ? 'gray' : '' }}
            >
              Submit
            </button>
          </form>
        </div>

        {/* Right Contact Info Section */}
        <div className="w-full md:w-1/2 border-t border-gray-400 md:border-t-0 md:border-l md:border-gray-400 bg-white text-black p-8 flex flex-col lg:justify-start lg:space-y-3 lg:py-10">
          <p className="mb-4 text-[13px]">
          Fill out the form and allow us to connect back with you.<br/> We are happy to assist you with any queries you might have.
          </p>
          <div className="mb-4">
          <MapContainer
              center={coordinates}
              zoom={13}
              style={{ height: "200px", width: "100%", borderRadius: "8px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution=''
              />
              <Marker position={coordinates}>
                <Popup>We are here!</Popup>
              </Marker>
            </MapContainer>
          </div>
          <ul className="space-y-2 text-[13px] lg:pt-[10px]">
            <li className="flex items-center ">
              <span className="mr-2"><FontAwesomeIcon icon={faMapPin} className='text-[22px]'/></span>
              3rd Floor, Plot no.94, Near Radisson Blu, Sector-13 Dwarka, Delhi,Delhi 110078
            </li>
            <li className="flex items-center">
              <span className="mr-2"><FontAwesomeIcon icon={faMobileScreen} className='text-[18px]' /></span>
              +919094894948
            </li>
            <li className="flex items-center">
              <span className="mr-2"><FontAwesomeIcon icon={faEnvelope} className='text-[18px]' /></span>
              connect@cadabra.world
            </li>
          </ul>
          {/* <div className="mt-4 flex space-x-4">
            <a href="#" className="hover:text-red-500">🌐</a>
            <a href="#" className="hover:text-red-500">🐦</a>
            <a href="#" className="hover:text-red-500">📷</a>
            <a href="#" className="hover:text-red-500">📺</a>
          </div> */}
        </div>
      </div>

      <div className={`tk-Rent fixed bottom-[40px] right-[5px] w-[200px] hidden md:hidden lg:block`}>
              <NavLink to="/Rent"><img src={normalImages.rentToday} alt="Rent Now image" /></NavLink>
      </div>
    </div>
  );
};

export default ContactForm;
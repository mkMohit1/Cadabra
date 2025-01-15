import React, { useState } from 'react';
import '../styles/ContactPage.scss';
import { useSelector } from 'react-redux';
import { errorToast, successToast } from '../DecryptoAndOther/ToastUpdate';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix the missing marker icon issue in Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerIconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const ContactForm = () => {
  const coordinates = [28.639232 , 77.299712]; // NYC Coordinates (latitude, longitude)
  const user = useSelector((state)=>state.auth.user);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    mobile:user && user.mobileNumber?user.mobileNumber:'',
    type: user && user.type
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
    <div className="flex min-h-screen items-center justify-center bg-gray-900 pt-[110px] pb-[20px]">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden md:flex w-4/5 max-w-4xl">
        {/* Left Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold mb-4 text-black">
            <span className="text-red-600">Contact</span> in touch
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Your Name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Your Email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input type="checkbox" defaultChecked className="form-checkbox h-5 w-5 text-red-600" />
                <span className="ml-2 text-sm text-gray-700">
                  I consent to the collection and processing of my personal data.
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Right Contact Info Section */}
        <div className="w-full md:w-1/2 bg-gray-800 text-white p-8 flex flex-col justify-center">
          <p className="mb-4">
          We provide innovative, reliable, and personalized solutions, ensuring excellent service and helping you achieve your business goals efficiently.
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
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="mr-2">📍</span>
              Preet Vihar, - 110051, Delhi, India
            </li>
            <li className="flex items-center">
              <span className="mr-2">📞</span>
              00011222333
            </li>
            <li className="flex items-center">
              <span className="mr-2">📧</span>
              somebody@gmail.com
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
    </div>
  );
};

export default ContactForm;
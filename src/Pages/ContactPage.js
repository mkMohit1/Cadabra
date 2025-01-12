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
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="bg-white shadow-lg h-screen overflow-hidden w-4/5 max-w-[43rem]">
        
      </div>
      <div className='bg-black shadow-lg w-4/5 max-w-2xl h-screen'>

      </div>
    </div>
  );
};

export default ContactForm;
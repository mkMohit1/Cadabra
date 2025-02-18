import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { decryptData } from '../DecryptoAndOther/DecryptEncrpt';
import { login } from '../redux/authSlice';
import HeroSection from '../components/Home/HeroSection';
import LogosSection from '../components/Home/LogoSection';
import ServicesSection from '../components/Home/ServicesSection';
import CustomerSection from '../components/Home/CustomerSection';
import Testimonials from '../components/Home/Testimonials';
import CustomerSection2 from '../components/Home/CustomerSection2';
import BlogSection from '../components/Home/BlogSection';
import SubscribeSection from '../components/Home/SubscribeSection';
import { errorToast } from '../DecryptoAndOther/ToastUpdate';
import { syncCartWithServer } from '../redux/cartSlice';
import { normalImages } from '../ImagePath';
import { NavLink } from 'react-router-dom';

const HomePage = ({ blogs }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [gettingError, setGettingError] = React.useState('');

  useEffect(() => {
    if (!user) {
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');
      if (error) {
         // Store the error in localStorage
        localStorage.setItem('authError', decodeURIComponent(error));
        // Clean the URL
        urlParams.delete('error');
            window.history.replaceState(null, '', `${window.location.pathname}`);
      }
      else{
        const encryptedUserData = urlParams.get('user');
        const iv = urlParams.get('iv');
        if (encryptedUserData && iv) {
          try {
            const decrypted = decryptData(decodeURIComponent(encryptedUserData), decodeURIComponent(iv));
            console.log('Decrypted Data:', decrypted);
            dispatch(login(decrypted));
  
            // Clean the URL
            urlParams.delete('user');
            urlParams.delete('iv');
            window.history.replaceState(null, '', `${window.location.pathname}`);
          } catch (error) {
            console.error('Decryption failed:', error);
          }
        }
      }
    
    }
  }, [dispatch, user]);

  useEffect(()=>{
    let breforeLoginCart = localStorage.getItem('cartNuser');
    breforeLoginCart = JSON.parse(breforeLoginCart);
    console.log('breforeLoginCart', breforeLoginCart);
    if(user && breforeLoginCart && breforeLoginCart.length > 0){
       dispatch(syncCartWithServer({ userId: user._id, cartItems: [...breforeLoginCart] }));
       localStorage.removeItem('cartNuser');
    }
  },[user]);
  useEffect(() => {
    const storedError = localStorage.getItem('authError');
  
    if (storedError) {
      // Show the error as a toast
      errorToast(storedError);
  
      // Clear the error from localStorage
      localStorage.removeItem('authError');
    }
  }, []);
  
  return (
    <div className="App relative">
      <HeroSection />{/* font-mulish */}
      <LogosSection />
      <ServicesSection />{/* font-mulish */}
      <CustomerSection />{/* font-mulish */}
      <Testimonials />{/* font-mulish */}
      <CustomerSection2 />{/* font-mulish */}
      <BlogSection blogs={blogs} /> {/* font-mulish */}
      <SubscribeSection />{/* font-mulish */}
      <div className={`tk-Rent fixed bottom-[40px] right-[5px] w-[200px] hidden md:hidden lg:block`}>
        <NavLink to="/Rent"><img src={normalImages.rentToday} alt="Rent Now image" /></NavLink>
      </div>
    </div>
  );
};

export default HomePage;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { decryptData } from '../DecryptoAndOther/DecryptEncrpt';
import { login } from '../redux/authSlice';
import HeroSection from '../components/HeroSection';
import LogosSection from '../components/LogoSection';
import ServicesSection from '../components/ServicesSection';
import CustomerSection from '../components/CustomerSection';
import Testimonials from '../components/Testimonials';
import CustomerSection2 from '../components/CustomerSection2';
import BlogSection from '../components/BlogSection';
import SubscribeSection from '../components/SubscribeSection';

const HomePage = ({ blogs }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      const urlParams = new URLSearchParams(window.location.search);
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
  }, [dispatch, user]);

  return (
    <div className="App">
      <HeroSection />
      <LogosSection />
      <ServicesSection />
      <CustomerSection />
      <Testimonials />
      <CustomerSection2 />
      <BlogSection blogs={blogs} />
      <SubscribeSection />
    </div>
  );
};

export default HomePage;

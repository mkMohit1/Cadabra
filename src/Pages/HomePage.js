import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import LogosSection from '../components/LogoSection';
import ServicesSection from '../components/ServicesSection';
import CustomerSection from '../components/CustomerSection';
import Testimonials from '../components/Testimonials';
import CustomerSection2 from '../components/CustomerSection2';
import BlogSection from '../components/BlogSection';
import SubscribeSection from '../components/SubscribeSection';
import { decryptData } from '../Decrypto/DecryptEncrpt';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
const HomePage = ({ blogs }) => {
    const [decryptedUser, setDecryptedUser] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
        // Get the encrypted data from the URL
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.size>0){
            const encryptedUserData = decodeURIComponent(urlParams.get('user'));
            const iv = decodeURIComponent(urlParams.get('iv'));
            let decrypted;
            // console.log('Decoded Encrypted Data:', encryptedUserData);
            // console.log('Decoded IV:', iv);
            if(encryptedUserData && iv){
                decrypted = decryptData(encryptedUserData, iv);
            }
            // console.log('Decrypted Data:', decrypted);
            setDecryptedUser(decrypted);
            if(decrypted){
                dispatch(login({ userID: decrypted.userID, isAdmin: decrypted.type, type:decrypted.loginWith }));
            }
        }
        
    }, []);

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
}

export default HomePage;

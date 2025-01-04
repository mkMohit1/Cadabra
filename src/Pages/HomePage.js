import React,{useState} from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import LogosSection from '../components/LogoSection';
import ServicesSection from '../components/ServicesSection';
import CustomerSection from '../components/CustomerSection';
import Testimonials from '../components/Testimonials';
import CustomerSection2 from '../components/CustomerSection2';
import BlogSection from '../components/BlogSection';
import SubscribeSection from '../components/SubscribeSection';



 const HomePage = ({blogs}) => {
  return (
    <div className="App"> 
      <HeroSection />
      <LogosSection />
      <ServicesSection />
      <CustomerSection/>
      <Testimonials/> {/* Testimonials component done */}
      <CustomerSection2/>
      <BlogSection blogs={blogs}/>
      <SubscribeSection/>
      </div>
  )
}


export default HomePage;
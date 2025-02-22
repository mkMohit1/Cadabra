import React, { useState } from 'react';
import '../../styles/ServicesSection.scss';
import serviceImg from '../../ImagePath';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ConsultationFilter from '../Popup&Faq/ConsultationFilter';
import ProductCard from '../Product/ProductCard';
import { useSelector } from 'react-redux';

const services = [
    {
    title: 'Alarm Systems',
    subText: 'For Homes & Businesses',
    description: '->',
  },
  {
    title: 'CCTV Surveillance',
    subText: 'For Homes & Businesses',
    description: '->',
  },
  {
    title: 'Displays & TVs',
    subText: 'For Homes & Businesses',
    description: '->',
  },
];

const ServicesSection = ({products =[]}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [categoryIndex, setCategoryIndex] = useState(null);
  const cartItem = useSelector(state=>state.cart.cartItem);
  const categories = ['Alarm System','CCTV', 'Display & TV'];
    // ✅ Filter products based on selected categoryIndex
    const filteredProducts = categoryIndex !== null
    ? products.filter(product => product.category === categories[categoryIndex])
    : products;
  const handleShowFilterProdut = (index)=>{
    if(showFilters){
      setCategoryIndex(null);
    }else{
      setCategoryIndex(index);
    }
    setShowFilters((prev)=>!prev);
  }
  return (
    <>
      <div className="services-section font-mulish">
        <h2>Thousands of options Ready to Rent!</h2>
        <div className="services-container">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <img src={serviceImg[index]} alt={service.title} className="service-img" />
              <h3>{service.title}</h3>
              <p>{service.subText}</p>
              <button onClick={()=>handleShowFilterProdut(index)} className="service-link bg-gradient-to-r from-blue-400 to-purple-600 font-Inter xs:font-[10px]">
              <FontAwesomeIcon icon={faArrowRight} className="text-white"/>
              </button>
            </div>
          ))}
        </div>
      </div>
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 md:p-6 z-50">
        <div
          className="bg-white p-3 flex flex-col lg:flex-row shadow-[8px_8px_1px_rgba(1,1,1,0.6)] border-black border-[2px] w-full max-w-xs sm:max-w-sm md:max-w-[36rem] lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl relative max-h-screen overflow-y-scroll
        md:max-h-[35.5rem] md:mt-[6.5rem] scrollbar-hide
        xxxs:mt-[4rem] xxxs:max-h-[39rem] xxxs:pt-[1.2rem] xxxs:scrollbar-none
        "
        >
          <button
            onClick={handleShowFilterProdut}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl p-1 rounded-full
            xxxs:top-[-0.4rem] xxxs:right-[0.4rem]
            "
            aria-label="Close quiz"
          >
            &times;
          </button>
          <div className="w-full md:w-full lg:w-1/3 p-2">
            <ConsultationFilter categoryIndex={categoryIndex}/>
          </div>
          {filteredProducts.length>0 &&(
          <div className="w-full lg:w-2/3 p-2 py-[18px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id + index}
                className="px-2 xxxs:flex justify-center"
              >
                <ProductCard
                  product={product}
                  isInCart={
                    Array.isArray(cartItem) &&
                    cartItem.some(
                      (item) => item.productId._id === product._id
                    )
                  }
                />
              </div>
            ))}
          </div>
          )}
          {filteredProducts.length ==0 && (
              <div className='text-[red] w-full lg:w-2/3 flex justify-center items-center'>
                Their is currently no product which match the category: {categories[categoryIndex]} 
              </div>
            )}
        </div>
      </div>
      )}
    </>
  );
};

export default ServicesSection;

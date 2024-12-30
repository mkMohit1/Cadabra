import React, {useState, useRef} from 'react';
import "../styles/SingleProductPage.scss";
import PriceAndDeliveryCard from './PriceAndDeliveryCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { ChevronRight,ChevronLeft } from 'lucide-react';




export const SingleProductPage = () => {
    const product = {
        name: "Generic IP Bullet Camera",
        model: "GENCAM2024",
        price: "₹10,500",
        specifications: {
          resolution: "2MP",
          lens: "3.6mm",
          type: "Bullet Camera",
          connectivity: "IP",
        },
        image: "https://via.placeholder.com/300", // Dummy image
        vendor: "Dummy Export",
      };

    const PromoBanner = () => {
        return (
          <div className="promo-container">
            <button className="promo-button">
              <div className="promo-content">
                <div className="checkmark">✓</div>
                <div className="text-content">
                  <span className="primary-text">Sign Up & Earn 20 Mogli Coins</span>
                  <span className="secondary-text">& save extra money on your next purchase.</span>
                </div>
              </div>
              <ChevronRight className="chevron" />
            </button>
          </div>
        );
    };

  return (
    <div className='singlePageProduct'>
        <div className='productAlldetails'>
            <div className='productLeftSide'>
                <div className="product-card">
                    <div className="image-container">
                        <img src={product.image} alt={product.name} className="product-image" />
                        <div className='image-innerContainer'>
                        <img src={product.image} alt={product.name} className="product-image" />
                        <img src={product.image} alt={product.name} className="product-image" />
                        <img src={product.image} alt={product.name} className="product-image" />
                        </div>
                    </div>
                    <div className="productDetatils">
                    <h2 className="product-name">{product.name}</h2>
                    <h4 className="product-model">Model: {product.model}</h4>
                    <div className='ratingShow'>
                    <span>4.0 <FontAwesomeIcon icon={faStar}/></span> (5 Reviews)
                    </div>
                    <p className="product-price">{product.price}</p>
                    {/* call promo banner */}
                    <PromoBanner/>
                    <div className='productDetailContainer'>
                    <ProductDetails/>
                    </div>
                    </div>
                </div>
                <div className="carousoleContainer">
                  <SimilarProducts/>
                </div>
            </div>
            <div className='productRightSide'>
                <PriceAndDeliveryCard/>
            </div>
        </div>
    </div>
  )
}


export const ProductDetails = () => {
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const specifications = [
    { label: 'Brand', value: 'BGT' },
    { label: 'Colour', value: 'Grey' },
    { label: 'IR Range', value: '30-40 m' },
    { label: 'Image Sensor', value: '1/3 in Sony Super HAD CCD' }
  ];

  const keyFeatures = [
    { feature: 'Power Consumption: Maximum 5 W with IR cut filter on.' },
    { feature: 'Weather Proof: yes.' },
    { feature: 'Lens Mount: M12.' }
  ];

  const productDescription = `The BGT 700 TVL Bullet CCTV Camera is a great way to keep an eye on your property. This camera features 700 TV lines of resolution, allowing you to see what's going on clearly. The BGT CCTV Cameras are one of the most reliable and affordable options when it comes to security. With a resolution of 700 TVL, these cameras provide high quality images and are absolutely ideal for both home and business security. The image sensor is a 1/3 in Sony Super HAD CCD, making it one of the most advanced options on the market. The colour of the...`;

  return (
    <div className="productDetail-card">
      <div className="product-content">
        {/* About This Product */}
        <section className="product-section">
          <h2 className="section-title">About This Product</h2>
          
          {/* Key Features */}
          <div className="key-features">
            <h3 className="subsection-title">Key Features</h3>
            <ul className="features-list">
              {keyFeatures.map((item, index) => (
                <li key={index}>{item.feature}</li>
              ))}
            </ul>
            <button className="show-more">
              SHOW ALL KEY FEATURES
            </button>
          </div>
        </section>

        {/* Product Specifications */}
        <section className="product-section">
          <h2 className="section-title">Product Specifications</h2>
          <div className="specifications">
            {specifications.map((spec, index) => (
              <div key={index} className="spec-row">
                <div className="spec-label">{spec.label}</div>
                <div className="spec-value">{spec.value}</div>
              </div>
            ))}
          </div>
          <button className="show-more">
            SHOW ALL SPECIFICATIONS
          </button>
        </section>

        {/* Product Details */}
        <section className="product-section">
          <h2 className="section-title">Product Details</h2>
          <p className="product-description">
            {productDescription}
            <button className="read-more">
              READ MORE
            </button>
          </p>
        </section>
      </div>
    </div>
  );
};


// carousel for similar product

export const SimilarProducts = () => {
  const scrollContainerRef = useRef(null);
  
  const products = [
    {
      id: 1,
      name: "Bullet Camera 2MP",
      price: 3000,
      discountedPrice: 2499,
      discountPercentage: 45,
      imageUrl: "/api/placeholder/200/150"
    },
    {
      id: 2,
      name: "4K IP CCTV Bundle",
      price: 18669,
      discountedPrice: 15999,
      discountPercentage: 30,
      imageUrl: "/api/placeholder/200/150"
    },
    {
      id: 3,
      name: "4K IP CCTV System",
      price: 23320,
      discountedPrice: 19999,
      discountPercentage: 37,
      imageUrl: "/api/placeholder/200/150"
    },
    {
      id: 4,
      name: "Security Camera Bundle",
      price: 16310,
      discountedPrice: 13999,
      discountPercentage: 35,
      imageUrl: "/api/placeholder/200/150"
    }
  ];

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 250;
      const container = scrollContainerRef.current;
      
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="similar-products">
      <h2 className="similar-products__title">Similar Products</h2>
      
      <div className="similar-products__container">
        <div className="similar-products__scroll-wrapper">
          <button 
            onClick={() => scroll('left')}
            className="similar-products__scroll-button"
            aria-label="Scroll left"
          >
            <ChevronLeft />
          </button>
          
          <div 
            ref={scrollContainerRef}
            className="similar-products__products-container"
          >
            {products.map((product) => (
              <div 
                key={product.id}
                className="similar-products__product-card"
              >
                <div className="similar-products__image-container">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                  />
                  <span className="similar-products__discount-badge">
                    {product.discountPercentage}% OFF
                  </span>
                </div>
                
                <div className="similar-products__product-info">
                  <h3 className="similar-products__product-name">
                    {product.name}
                  </h3>
                  
                  <div className="similar-products__price-container">
                    <span className="similar-products__current-price">
                      ₹{product.discountedPrice.toLocaleString()}
                    </span>
                    <span className="similar-products__original-price">
                      ₹{product.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => scroll('right')}
            className="similar-products__scroll-button"
            aria-label="Scroll right"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};
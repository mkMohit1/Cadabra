import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Star, Truck, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {errorToast, infoToast, successToast} from '../../DecryptoAndOther/ToastUpdate';
import { useDispatch, useSelector } from "react-redux";
import { updateCartItem, syncCartWithServer, removeCartItem, removeSellCartItem } from "../../redux/cartSlice";


const PriceAndDeliveryCard = ({product}) => {
  //console.log(product);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  let cartNItem = useSelector((state) => state.cart.cartNItem) || [];
  let cartItem = useSelector((state) => state.cart.cartItem) || [];
  const [isInCart, setIsInCart] = useState(false);

  useEffect(()=>{
    if(!user){
      setIsInCart(Array.isArray(cartNItem) &&
      cartNItem.some((item) => item.productId._id === product._id))
    }else{
      setIsInCart(Array.isArray(cartItem) &&
      cartItem.some((item) => item.productId._id === product._id))
    }
  },[]);

  const deleteCartItem = async (userId, productId) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACK_URL}/cart/item`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, productId }),
          });
    
          if (response.ok) {
            //successToast('Cart item deleted successfully');
            dispatch(removeCartItem({ _id: productId, user }));
            console.log(productId);
          } else {
            errorToast('Error deleting cart item');
          }
        } catch (error) {
          console.error('Error deleting cart item:', error);
          errorToast('Failed to delete cart item');
        }
      };

  const handleAddCart = () => {
    if (!product || !product._id) {
      errorToast("Invalid product data.");
      return;
    }
    
    if(isInCart){
      // If the product is already in the cart, remove it
      dispatch(removeCartItem({product, user}));
      dispatch(removeSellCartItem(product));
      if (user){
        deleteCartItem(user._id, product._id);
      }
      setIsInCart(false);
      infoToast("Product removed from the cart");
    }else{
      // If the product is not in the cart, add it
      if(!user){
        const cartItem = {productId:product, quantity:1, mohit:"mnk"};
        console.log(cartItem);
        dispatch(updateCartItem(cartItem));
      }
      if (user){
        const cartItem = {productId:product, quantity:1};
        dispatch(syncCartWithServer({ userId: user._id, cartItems: [cartItem] }));
      }
      setIsInCart(true);
      successToast(`${product.title} added to cart!`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6 font-mulish">
      {/* Price Section */}
      <div className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">₹{product.mrp}</span>
          <span className="text-lg text-gray-500 line-through">₹{product.mrp}</span>
          <span className="text-green-600 text-sm font-medium">{product.discount}% off</span>
        </div>
        <p className="text-sm text-gray-500">Inclusive of all taxes</p>
      </div>

      {/* Delivery Section */}
      <div className="space-y-4 border-t border-b py-4">
        <div className="flex items-start gap-3">
          <Truck className="w-5 h-5 text-gray-600 mt-1" />
          <div>
            <p className="font-medium text-gray-900">Free Delivery</p>
            <p className="text-sm text-gray-500">Delivery by 23rd Jan</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ArrowLeft className="w-5 h-5 text-gray-600 mt-1" />
          <div>
            <p className="font-medium text-gray-900">Easy Returns</p>
            <p className="text-sm text-gray-500">7 Days Return Policy</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-gray-600 mt-1" />
          <div>
            <p className="font-medium text-gray-900">Warranty</p>
            <p className="text-sm text-gray-500">1 Year Manufacturer Warranty</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        { 1==0 && (
          <button className="w-full bg-gradient-to-r from-blue-400 to-purple-500 text-white py-3 px-4 font-medium hover:bg-blue-700 transition-colors">
          Buy Now
        </button>
        )}
        <button className="w-full bg-gradient-to-r from-blue-400 to-purple-500 text-white py-3 px-4  font-medium hover:bg-orange-600 transition-colors"
        onClick={handleAddCart}
        >
          {!isInCart?"Add to Cart":"Remove from Cart"}
        </button>
      </div>

      {/* Seller Info */}
      <div className="pt-4 border-t">
        <p className="text-sm text-gray-600">
          Sold by <span className="font-medium text-gray-900">Dummy Export</span>
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium">4.2</span>
          </div>
          <span className="text-sm text-gray-500">(234 Seller Ratings)</span>
        </div>
      </div>
    </div>
  );
};

export const SingleProductPage = () => {
  const {id}= useParams();
  const [currentProduct, setCurrentProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(()=>{
    let category =null;
    const fetchProduct = async()=>{
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/admin/getProducts/${id}`);
        if(response.ok){
          const data = await response.json();
          // console.log(data.products);
          setCurrentProduct(data.products);
          category = data.products.category;
          fetchSimilarProducts(category);
        }
      } catch (error) {
        errorToast(error);
      }
    };
    const fetchSimilarProducts = async(category)=>{
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/similarProducts/${category}`);
        if(response.ok){
          const data = await response.json();
          console.log(data.products);
          setSimilarProducts(data.products);
        }
      } catch (error) {
        errorToast(error);
      }
    }
    fetchProduct();
    // ✅ Smooth scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
  },[id]);
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
    image: "https://plus.unsplash.com/premium_photo-1675016457613-2291390d1bf6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FtZXJhJTIwY2N0dnxlbnwwfHwwfHx8MA%3D%3D",
  };

  const PromoBanner = () => {
    return (
      <div className="max-w-full my-4 font-mulish">
        <button className="w-full bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between transition hover:bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
              ✓
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg md:text-xl font-medium text-gray-900">
                Sign Up & Earn 20 Mogli Coins
              </span>
              <span className="text-sm text-gray-500">
                & save extra money on your next purchase.
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    );
  };

  return (
    <>
    {currentProduct && (
      <div className="max-w-7xl mx-auto px-4 py-20 font-mulish">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-6 max-h-[850px] overflow-y-auto scrollbar-hidden">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-96 top-4">
                <div className="space-y-4">
                  <img 
                    src={`${process.env.REACT_APP_BACK_URL}${currentProduct.productImage}`} 
                    alt={currentProduct.name} 
                    className="w-full rounded-lg"
                  />
                  <div className="grid grid-cols-3 gap-3 bg-gray-100 p-2 rounded-lg">
                    {[...Array(3)].map((_, i) => (
                      <div className='bg-white'>
                      <img
                        key={i}
                        src={`${process.env.REACT_APP_BACK_URL}${currentProduct.productImage}`}
                        alt={`${currentProduct.name} view ${i + 1}`}
                        className="w-full h-20 object-cover rounded-md cursor-pointer hover:opacity-75"
                      />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentProduct.title}</h2>
                <h4 className="text-gray-600 mb-4">Model: {product.model}</h4>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1">
                    4.0 <Star className="w-4 h-4" />
                  </span>
                  <span className="text-gray-600">(5 Reviews)</span>
                </div>
                <p className="text-2xl font-bold text-green-700 mb-6">{currentProduct.mrp}</p>
                <PromoBanner />
                <ProductDetails />
              </div>
            </div>
          </div>
          <div className="mt-8">
            <SimilarProducts similarProducts={similarProducts}/>
          </div>
        </div>
        <div className="w-full lg:w-1/4 sticky top-4 h-fit">
          <PriceAndDeliveryCard product={currentProduct}/>
        </div>
      </div>
      <div className='flex flex-col'>
        
      </div>
    </div>
    )}
    </>
  );
};

export const ProductDetails = () => {
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const specifications = [
    { label: 'Brand', value: 'BGT' },
    { label: 'Colour', value: 'Grey' },
    { label: 'IR Range', value: '30-40 m' },
    { label: 'Image Sensor', value: '1/3 in Sony Super HAD CCD' },
    // Additional specifications shown when expanded
    { label: 'Video Resolution', value: '700 TVL' },
    { label: 'Power Supply', value: '12V DC' },
    { label: 'Night Vision', value: 'Yes' },
    { label: 'Material', value: 'Metal Housing' },
    { label: 'Operating Temperature', value: '-10°C to 50°C' },
    { label: 'Waterproof Rating', value: 'IP66' }
  ];

  const keyFeatures = [
    { feature: 'Power Consumption: Maximum 5 W with IR cut filter on.' },
    { feature: 'Weather Proof: yes.' },
    { feature: 'Lens Mount: M12.' },
    // Additional features shown when expanded
    { feature: 'Advanced motion detection with customizable zones' },
    { feature: 'Built-in IR-cut filter for true day/night operation' },
    { feature: 'Wide Dynamic Range (WDR) for balanced images' },
    { feature: 'Privacy masking zones' },
    { feature: '3D Digital Noise Reduction' },
    { feature: 'ONVIF compliant for easy integration' }
  ];

  const shortDescription = `The BGT 700 TVL Bullet CCTV Camera is a great way to keep an eye on your property. This camera features 700 TV lines of resolution, allowing you to see what's going on clearly. The BGT CCTV Cameras are one of the most reliable and affordable options when it comes to security...`;

  const fullDescription = `The BGT 700 TVL Bullet CCTV Camera is a great way to keep an eye on your property. This camera features 700 TV lines of resolution, allowing you to see what's going on clearly. The BGT CCTV Cameras are one of the most reliable and affordable options when it comes to security.

With a resolution of 700 TVL, these cameras provide high quality images and are absolutely ideal for both home and business security. The image sensor is a 1/3 in Sony Super HAD CCD, making it one of the most advanced options on the market.

The camera comes with a built-in IR-cut filter that automatically switches between day and night modes, ensuring optimal image quality in any lighting condition. The weatherproof metal housing is rated IP66, making it suitable for both indoor and outdoor installation.

Advanced features include:
• Wide Dynamic Range (WDR) technology that balances bright and dark areas in the image
• 3D Digital Noise Reduction for clear night vision
• Motion detection with email alerts
• Multiple privacy masking zones
• ONVIF compatibility for easy integration with existing systems

The camera supports various network protocols and can be easily integrated into your existing security infrastructure. With its professional-grade build quality and advanced features, this camera is an excellent choice for comprehensive security solutions.`;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mt-8 font-mulish">
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Product</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Key Features</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              {keyFeatures.slice(0, showAllFeatures ? keyFeatures.length : 3).map((item, index) => (
                <li key={index} className="transition-all duration-300 ease-in-out">
                  {item.feature}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => setShowAllFeatures(!showAllFeatures)}
              className="text-blue-700 font-medium text-sm hover:underline transition-colors"
            >
              {showAllFeatures ? 'SHOW LESS FEATURES' : 'SHOW ALL KEY FEATURES'}
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Specifications</h2>
          <div className="border rounded-md divide-y divide-gray-200">
            {specifications.slice(0, showAllSpecs ? specifications.length : 4).map((spec, index) => (
              <div 
                key={index} 
                className="flex p-3 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="w-1/3 text-gray-600">{spec.label}</div>
                <div className="w-2/3 text-gray-900">{spec.value}</div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setShowAllSpecs(!showAllSpecs)}
            className="mt-4 text-blue-700 font-medium text-sm hover:underline transition-colors"
          >
            {showAllSpecs ? 'SHOW LESS SPECIFICATIONS' : 'SHOW ALL SPECIFICATIONS'}
          </button>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h2>
          <div className="text-gray-600 leading-relaxed">
            <p className={`${showFullDescription ? '' : 'line-clamp-3'} transition-all duration-300`}>
              {showFullDescription ? fullDescription : shortDescription}
            </p>
            <button 
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="ml-1 text-blue-700 font-medium text-sm hover:underline transition-colors"
            >
              {showFullDescription ? 'READ LESS' : 'READ MORE'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export const SimilarProducts = ({similarProducts =[]}) => {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  // const products = [
  //   {
  //     id: 1,
  //     name: "Bullet Camera 2MP",
  //     price: 3000,
  //     discountedPrice: 2499,
  //     discountPercentage: 45,
  //     imageUrl: "https://images.unsplash.com/photo-1460134846237-51c777df6111?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FtZXJhfGVufDB8fDB8fHww"
  //   },
  //   {
  //     id: 2,
  //     name: "4K IP CCTV Bundle",
  //     price: 18669,
  //     discountedPrice: 15999,
  //     discountPercentage: 30,
  //     imageUrl: "https://plus.unsplash.com/premium_photo-1667538960104-25726d82a6e5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y2FtZXJhfGVufDB8fDB8fHww"
  //   },
  //   {
  //     id: 3,
  //     name: "4K IP CCTV System",
  //     price: 23320,
  //     discountedPrice: 19999,
  //     discountPercentage: 37,
  //     imageUrl: "https://plus.unsplash.com/premium_photo-1661751140625-2b01ae1d681d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FtZXJhfGVufDB8fDB8fHww"
  //   },
  //   {
  //     id: 4,
  //     name: "Security Camera Bundle",
  //     price: 16310,
  //     discountedPrice: 13999,
  //     discountPercentage: 35,
  //     imageUrl: "https://images.unsplash.com/photo-1623621461302-e6b5236629cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNhbWVyYXxlbnwwfHwwfHx8MA%3D%3D"
  //   }
  // ];

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 250;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleGotoProduct = (id) => {
    navigate(`/products/${id}`);
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto font-mulish">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Similar Products</h2>
      <div className="relative">
        <div className="flex items-center">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 px-4 pb-4 scroll-smooth scrollbar-hidden"
          >
            {similarProducts.length>0 && similarProducts.map((product) => {
                // Ensure values are valid before calculation
                const mrp = product.mrp || 0;
                const discount = product.discount || 0;
                const discountedPrice = mrp - (mrp * discount) / 100; // Correct calculation

              return(
              <div 
                key={product.id}
                onClick={()=>handleGotoProduct(product._id)}
                className="flex-none w-48 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={`${process.env.REACT_APP_BACK_URL}${product.productImage}`}
                    alt={product.title}
                    className="w-full h-32 object-contain rounded-t-lg"
                  />
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    {product.discount}% OFF
                  </span>
                </div>
                
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                    {product.title}
                  </h3>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{discountedPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.mrp.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )})}
          </div>
          
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
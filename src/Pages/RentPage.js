import React, { useState, useEffect } from "react";
import { rentImage, normalImages } from "../ImagePath";
import ProductCard from "../components/ProductCard";
import FilterProduct from "../components/FilterProduct";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/rentProductSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareArrowUpRight } from "@fortawesome/free-solid-svg-icons";
import ConsultationFilter from "../components/ConsultationFilter";

export default function RentPage() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.rentProduct);
  const cartItem = useSelector((state) => state.cart.cartItem);
  const locationNames = useSelector((state) => state.product.indiaStatesAndUTs);
  const [filterData, setFilterData] = useState({});
  const [filterDataPopup, setFilterDataPopup] = useState({});
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [tenure, setTenure] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleProducts = 3;

  const handleSearch = (e) => {
    e.preventDefault();
    if (category === "" && type === "" && location === "" && tenure === "") {
      alert("Please fill at least one filter!");
      return;
    }
    const filter = { location, category, type, tenure };
    const filteredProducts = products.filter((product) =>
      Object.keys(filter).every((key) =>
        filter[key] ? product[key] === filter[key] : true
      )
    );
    setFilterData(filteredProducts);
  };

  const renderProductCards = (data) =>
    data.map((product) => (
      <ProductCard 
        key={product.id}
        product={product}
        isInCart={cartItem.some((item) => item._id === product._id)}
      />
    ));

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % products.length);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="font-inter">
      {/* Header Section */}
      <div className="relative text-center bg-cover bg-center py-[100px] px-4"
        style={{background:`url(${normalImages.patern})`}}
      >
        <h1 className="text-3xl md:text-5xl font-bold">Select the Right Product</h1>
        <p className="text-3xl mt-4  mb-4">
          Using <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 font-semibold">CadabraAI</span>
        </p>
        <button
          onClick={() => setShowQuiz(true)}
          className="bg-black text-green-400 py-3 px-8 text-xl font-bold hover:bg-gray-800 transition"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Rent Now 
          {/* <FontAwesomeIcon icon={faSquareArrowUpRight} className="ml-2" /> */}
          </span>
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-gray-100 py-8">
        <form
          onSubmit={handleSearch}
          className="max-w-5xl mx-auto flex flex-wrap gap-4 items-end"
        >
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full sm:w-1/5 border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Select Location</option>
            {locationNames.map((item, idx) => (
              <option key={idx} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-1/5 border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Select Category</option>
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full sm:w-1/5 border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Select Type</option>
          </select>
          <select
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            className="w-full sm:w-1/5 border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Select Tenure</option>
          </select>
          <button
            type="submit"
            className="w-full sm:w-auto bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-600"
          >
            Search
          </button>
        </form>

        {filterData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {renderProductCards(filterData)}
          </div>
        )}
      </div>

      {/* Product Slider */}
      <div className="bg-gray-50 py-12">
        <h2 className="text-2xl font-bold text-center mb-6">Latest Arrivals</h2>
        <div className="relative flex items-center">
          <button
            className="absolute left-[200px] bg-gray-300 text-black rounded-full p-3"
            onClick={handlePrev}
          >
            &#8249;
          </button>
          <div className="overflow-hidden max-w-4xl mx-auto  px-4 py-8">
            <div
              className="flex transition-transform duration-300"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleProducts)}%)`,
              }}
            >
              {renderProductCards(products)}
            </div>
          </div>
          <button
            className="absolute right-[200px] bg-gray-300 text-black rounded-full p-3"
            onClick={handleNext}
          >
            &#8250;
          </button>
        </div>
      </div>

      {/* Quiz Popup */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowQuiz(false)}
              className="absolute top-2 right-2 text-gray-500 text-xl hover:text-gray-700"
            >
              &times;
            </button>
            <FilterProduct handleCloseQuiz={() => setShowQuiz(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

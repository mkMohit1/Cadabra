import React, { useState, useRef, useEffect } from "react";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { normalImages } from "../ImagePath";
import { NavLink } from "react-router-dom";
import FaqContainer from "../components/Popup&Faq/FaqContainer";
import { errorToast, successToast } from "../DecryptoAndOther/ToastUpdate";

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState("Month");
  const [showComparison, setShowComparison] = useState(true);
  const [currentFaqIndex, setCurrentFaqIndex] = useState(0);
  const [faqs, setFaqs]= useState([]);
  const [openFAQs, setOpenFAQs] = useState([]);
  const telRef = useRef();
  const plans = [
    {
      name: "Homeshield Starter",
      subtitle: "For Shops and Small Homes",
      price: 79,
      keyFeatures: [
        { name: "One Wifi Camera/Plan", included: true },
        { name: "Night Vision", included: true },
        { name: "Remote Monitoring", included: false },
        { name: "iOS & Android app", included: true },
        { name: "Audio Recording", included: true },
      ],
      features: {
        Camera: "One Wifi Camera/Plan",
        "Night Vision": "Yes",
        "Remote Monitoring": "No",
        "Audio Recording": "Yes",
        "AI Features": "No",
        "Latest Updates Availability": "No",
        "Priority Installation": "No",
        "Easy Renewal": "No",
        User: "Single User",
        Storage: "15 days Storage",
        Installation: "Refundable Installation Charges",
        "iOS & Android app": "Yes",
        "Zero Security Deposit": "Yes",
        "Unlimited Maintenance Visits": "Yes",
        "24/7 Technical Assistance": "No",
        "Dedicated Relationship Manager": "No",
        "Command Center Monitoring": "No",
        "Emergency SOS Support": "Yes",
      },
    },
    {
      name: "Homeshield Plus",
      subtitle: "For Homes, Small Offices, Showrooms and Warehouses",
      price: 299,
      keyFeatures: [
        { name: "Three Wifi Camera/Plan", included: true },
        { name: "Night Vision", included: true },
        { name: "Remote Monitoring", included: true },
        { name: "iOS & Android app", included: true },
        { name: "Audio Recording", included: true },
      ],
      features: {
        Camera: "Three Wifi Camera/Plan",
        "Night Vision": "Yes",
        "Remote Monitoring": "Yes",
        "Audio Recording": "Yes",
        "AI Features": "2 Basic AI Features",
        "Latest Updates Availability": "Yes",
        "Priority Installation": "Yes",
        "Easy Renewal": "Yes",
        User: "2 Users",
        Storage: "30 Days Storage",
        Installation: "Free Installation",
        "iOS & Android app": "Yes",
        "Zero Security Deposit": "Yes",
        "Unlimited Maintenance Visits": "Yes",
        "24/7 Technical Assistance": "Yes",
        "Dedicated Relationship Manager": "No",
        "Command Center Monitoring": "No",
        "Emergency SOS Support": "Yes",
      },
    },
    {
      name: "Homeshield Max",
      subtitle: "For Societies, Factories, Offices",
      price: 399,
      keyFeatures: [
        { name: "Five Wifi Camera/Plan", included: true },
        { name: "Night Vision", included: true },
        { name: "Remote Monitoring", included: true },
        { name: "iOS & Android app", included: true },
        { name: "Audio Recording", included: true },
      ],
      features: {
        Camera: "Five Wifi Camera/Plan",
        "Night Vision": "Yes",
        "Remote Monitoring": "Yes",
        "Audio Recording": "Yes",
        "AI Features": "Up to 3 AI Features",
        "Latest Updates Availability": "Yes",
        "Priority Installation": "Yes",
        "Easy Renewal": "Yes",
        User: "Up to 5 Users",
        Storage: "45 Days Storage",
        Installation: "Free Installation",
        "iOS & Android app": "Yes",
        "Zero Security Deposit": "Yes",
        "Unlimited Maintenance Visits": "Yes",
        "24/7 Technical Assistance": "Yes",
        "Dedicated Relationship Manager": "Yes",
        "Command Center Monitoring": "Yes",
        "Emergency SOS Support": "Yes",
      },
    },
    {
      name: "Homeshield Pro",
      subtitle: "For RWAs, Offices",
      price: "contact",
      keyFeatures: [
        { name: "Custom Camera Setup", included: true },
        { name: "Night Vision", included: true },
        { name: "Remote Monitoring", included: true },
        { name: "iOS & Android app", included: true },
        { name: "Audio Recording", included: true },
      ],
      features: {
        Camera: "Custom Camera Setup",
        "Night Vision": "Yes",
        "Remote Monitoring": "Yes",
        "Audio Recording": "Yes",
        "AI Features": "All AI Features",
        "Latest Updates Availability": "Yes",
        "Priority Installation": "Yes",
        "Easy Renewal": "Yes",
        User: "Custom User Plan",
        Storage: "Custom Storage Plan",
        Installation: "Free Installation",
        "iOS & Android app": "Yes",
        "Zero Security Deposit": "Yes",
        "Unlimited Maintenance Visits": "Yes",
        "24/7 Technical Assistance": "Yes",
        "Dedicated Relationship Manager": "Yes",
        "Command Center Monitoring": "Yes",
        "Emergency SOS Support": "Yes",
      },
    },
  ];

  const featureCategories = [
    "Camera",
    "Night Vision",
    "Remote Monitoring",
    "Audio Recording",
    "AI Features",
    "Latest Updates Availability",
    "Priority Installation",
    "Easy Renewal",
    "User",
    "Storage",
    "Installation",
    "iOS & Android app",
    "Zero Security Deposit",
    "Unlimited Maintenance Visits",
    "24/7 Technical Assistance",
    "Dedicated Relationship Manager",
    "Command Center Monitoring",
    "Emergency SOS Support",
  ];
  const itemsPerPage = 3;
  // const nextFaq = () => {
  //   setCurrentFaqIndex((prev) =>
  //     Math.min(prev + itemsPerPage, faqs.length - itemsPerPage)
  //   );
  // };

  // const prevFaq = () => {
  //   setCurrentFaqIndex((prev) => Math.max(prev - itemsPerPage, 0));
  // };
  const handlePriceChange = (plan) => {
    if (billingCycle === "Year" && typeof plan.price === "number") {
      return plan.price * 12 * 0.975; // Applying a 2.5% discount for yearly
    }
    return plan.price;
  };
  const renderPrice = (plan) => {
    if (plan.price === "contact") {
      return (
        <a href="/Contact">
          <button className="bg-gradient-to-r from-blue-400 to-purple-500 text-white py-2 px-6  hover:from-blue-500 hover:to-purple-600 transition-all text-lg w-full font-semibold">
            Contact Us
          </button>
        </a>
      );
    }
    return (
      <>
        ₹{handlePriceChange(plan).toFixed(2)}
        <span className="text-base font-normal text-gray-600">
          / {billingCycle}
        </span>
      </>
    );
  };
  const plansRef = useRef(null);

  const scrollToPlans = () => {
    if (plansRef.current) {
      plansRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

    const handleSubmitConsultation = async(event) => {
      event.preventDefault();
      if (!telRef.current || !telRef.current.value.trim() || telRef.current.value.length !== 10) {
        errorToast('Please enter a valid 10-digit mobile number.');
        return;
      }
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/consultation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mobileNumber: telRef.current.value }),
        });
        const data = await response.json();
        if (!response.ok) {
          errorToast( data.message || 'Failed to submit. Please try again later.');
          telRef.current.value ='';
          return;
        }
        if(response.ok){
          successToast(data.message || 'Submitted successfully!');
          telRef.current.value ='';
        }
      } catch (error) {
        console.error('Error:', error);
      }
  
      console.log('Arrow clicked with value:', telRef.current.value);
    };
    useEffect(() => {
      const fetchFaqFunction = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACK_URL}/faqs/${'Plane'}`);
          if (response.ok) {
            const data = await response.json();
            setFaqs(data);
            setOpenFAQs(new Array(data.length).fill(false)); // ✅ Initialize only after faqs is set
          } else {
            console.error("Failed to fetch FAQs");
          }
        } catch (error) {
          console.error("Error fetching FAQs:", error);
        }
      };
    
      fetchFaqFunction();
    }, []);    
  return (
   <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-mulish relative">
      {/* Header Section */}
      <div className="text-center py-8 pt-[4rem] space-y-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Choose Your Plan</h1>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Choose a plan for Securing your Loved ones
        </h2>
        <p className="text-lg sm:text-xl lg:text-xl lg:text-[1.1rem] text-gray-600 max-w-3xl mx-auto tracking-[-0.5px] ">
          Not sure what product to buy? Pick a plan to start and our AI tool will help you make selection.
        </p>

        {/* Billing Toggle */}
        <div className="flex justify-center mt-6">
          <div className="inline-flex border border-gray-200 p-1">
            <button
              className={`px-4 py-2 text-sm sm:text-base transition-all ${
                billingCycle === "Month"
                  ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white"
                  : "text-gray-600"
              }`}
              onClick={() => setBillingCycle("Month")}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 text-sm sm:text-base transition-all ${
                billingCycle === "Year"
                  ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white"
                  : "text-gray-600"
              }`}
              onClick={() => setBillingCycle("Year")}
            >
              Yearly (Save 2.5%)
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {plans.map((plan) => (
          <div key={plan.name} className="border rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="text-[0.7rem] text-gray-600 h-[25px] italic">{plan.subtitle}</p>
              </div>
              
              <div className="text-2xl sm:text-3xl font-bold">
                {plan.price === "contact" ? (
                  <button className="w-full py-2 px-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white  text-base">
                    Contact Us
                  </button>
                ) : (
                  <>
                    ₹{handlePriceChange(plan).toFixed(2)}
                    <span className="text-base font-normal text-gray-600"> /{billingCycle}</span>
                  </>
                )}
              </div>

              <div className="space-y-3">
                {plan.keyFeatures.map((feature) => (
                  <div key={feature.name} className="flex items-center space-x-2">
                    <Check className={`w-5 h-5 ${feature.included ? "text-green-500" : "text-gray-300"}`} />
                    <span className={`text-sm ${feature.included ? "text-gray-800" : "text-gray-400"}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full py-2 px-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white  hover:from-blue-500 hover:to-purple-600 transition-all">
                Choose Plan
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Plans and Features Button */}
      <div className="text-center mb-12 col-span-full">
        <button
          onClick={scrollToPlans}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white py-3 px-6 hover:from-blue-500 hover:to-purple-600 transition-all text-lg"
        >
          <span>View all Plans and Features</span>
        </button>
      </div>

      {/* Mobile Number Section */}
      <div className="bg-gray-50 rounded-xl p-6 sm:p-8 mb-12">
        <div className="text-center mb-6">
          <p className="text-xl sm:text-2xl font-bold text-gray-600 tracking-[-0.7px]">
            Enter your Number below for a Security Expert Consultation!
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="tel"
            ref={telRef}
            placeholder="Enter your mobile number......"
            className="w-full sm:w-[60%] py-3 sm:py-5 px-4 border border-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="w-full sm:w-auto bg-gradient-to-r from-blue-400 to-purple-500 text-white py-3 sm:py-5 px-6 hover:from-blue-500 hover:to-purple-600 transition-all" onClick={handleSubmitConsultation}>
            <ChevronRight className="w-6 h-6 mx-auto" />
          </button>
        </div>
      </div>

      {/* Comparison Section (referenced by the View All Plans button) */}
      <div ref={plansRef}>
        {/* Comparison Toggle */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white py-2 px-4 hover:from-blue-500 hover:to-purple-600 transition-all"
          >
            <span>{showComparison ? "Hide" : "Show"} Comparison</span>
            <ChevronRight className={`w-5 h-5 transform transition-transform ${showComparison ? "rotate-90" : ""}`} />
          </button>
        </div>

        {/* Comparison Table */}
        {showComparison && (
          <div className="overflow-x-auto mb-12 shadow-lg rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left font-medium">Features</th>
                  {plans.map((plan) => (
                    <th key={plan.name} className="p-4 text-center font-medium">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(plans[0].features).map((feature) => (
                  <tr key={feature} className="hover:bg-gray-50">
                    <td className="p-4 border-t">{feature}</td>
                    {plans.map((plan) => (
                      <td key={`${plan.name}-${feature}`} className="p-4 border-t text-center">
                        {plan.features[feature] === "Yes" ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : plan.features[feature] === "No" ? (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        ) : (
                          plan.features[feature]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="flex flex-col max-w-6xl mx-auto py-4 space-y-2">
        <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">FAQ:-</span>
        <FaqContainer faqs={faqs} openFAQ={openFAQs} className="lg:w-full"/>
      </div>
        
      <div className={`tk-Rent fixed bottom-[40px] right-[5px] w-[200px] hidden md:hidden lg:block`}>
              <NavLink to="/Rent"><img src={normalImages.rentToday} alt="Rent Now image" /></NavLink>
      </div>
    </div>
  );
};

export default PricingPage;

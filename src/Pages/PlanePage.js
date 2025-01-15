import React, { useState } from "react";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [showComparison, setShowComparison] = useState(true);
  const [currentFaqIndex, setCurrentFaqIndex] = useState(0);

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

  const faqs = [
    {
      question: "What's included in the installation process?",
      answer:
        "Our professional installation team handles everything - from camera mounting and wiring to system configuration and app setup.",
    },
    {
      question: "How long does the installation take?",
      answer:
        "Typical installation takes 2-4 hours depending on the number of cameras and complexity of setup. We work efficiently to minimize disruption to your schedule.",
    },
    {
      question: "Is there a warranty on the equipment?",
      answer:
        "Yes, all our cameras and equipment come with a 1-year manufacturer warranty. Plus, our service plans include maintenance and support.",
    },
    {
      question: "Can I access the cameras from my phone?",
      answer:
        "Yes, you can view your cameras anytime, anywhere through our iOS and Android apps. The apps also provide notifications and camera controls.",
    },
    {
      question: "What happens if I need technical support?",
      answer:
        "We provide 24/7 technical support for all our plans. Plus and higher tiers get priority support with faster response times.",
    },
  ];
  const itemsPerPage = 3;
  const nextFaq = () => {
    setCurrentFaqIndex((prev) =>
      Math.min(prev + itemsPerPage, faqs.length - itemsPerPage)
    );
  };

  const prevFaq = () => {
    setCurrentFaqIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };
  const handlePriceChange = (plan) => {
    if (billingCycle === "yearly" && typeof plan.price === "number") {
      return plan.price * 12 * 0.975; // Applying a 2.5% discount for yearly
    }
    return plan.price;
  };
  const renderPrice = (plan) => {
    if (plan.price === "contact") {
      return (
        <a href="/Contact">
          <button className="bg-gradient-to-r from-blue-400 to-purple-500 text-white py-2 px-6 rounded-md hover:from-blue-500 hover:to-purple-600 transition-all text-lg w-full font-semibold">
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
  return (
    <div className="w-full max-w-7xl mx-auto px-4 font-mulish">
      <div className="text-center py-8 ">
        <h1 className="text-4xl font-bold mb-6">Choose Your Plan</h1>
        <h1
          className="text-4xl font-bold mb-6 text-main"
          style={{
            background: "linear-gradient(19deg, #21D4FD 0%, #B721FF 100%)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Choose a plan for Securing your Loved ones
        </h1>
        <p className="mb-10 text-2xl">
          Not sure what product to buy? Pick a plan to start and our AI tool
          will help you make selection.
        </p>
        <div className="inline-flex rounded-lg border border-gray-200 p-1 mb-6">
          <button
            className={`px-4 py-2 rounded-md ${
              billingCycle === "monthly"
                ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white"
                : "text-gray-600"
            }`}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              billingCycle === "yearly"
                ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white"
                : "text-gray-600"
            }`}
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly (Save 2.5%)
          </button>
        </div>

        <h2 className="text-2xl mb-8">
          <span className="text-gray-600">Best Plans For</span>{" "}
          <span
            className="text-coded"
            style={{
              background: "linear-gradient(19deg, #21D4FD 0%, #B721FF 100%)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Homeshield Security
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full "
          >
            <div className="flex-grow">
              <div className="text-lg font-bold mb-2">{plan.name}</div>
              <div className="text-sm text-gray-600 mb-4 h-12">
                {plan.subtitle}
              </div>
              <div className="text-3xl font-bold mb-6">{renderPrice(plan)}</div>
              <div className="space-y-3 mb-6">
                {plan.keyFeatures.map((feature) => (
                  <div
                    key={feature.name}
                    className="flex items-center space-x-2"
                  >
                    <Check
                      className={`w-5 h-5 ${
                        feature.included ? "text-green-500" : "text-gray-300"
                      }`}
                    />
                    <span
                      className={
                        feature.included ? "text-gray-800" : "text-gray-400"
                      }
                    >
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-auto pt-6">
              <button className="w-full py-2 px-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 transition-all">
                Choose Plan
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Trusted Companies Section */}
      <div className="py-16 border-t border-gray-100 bg-[#f8f9fb] rounded-xl">
        <div className="text-center mb-10">
          <p className="text-gray-600 text-2xl font-bold mb-4">
            Provide your number, and our experts will call you back shortly!
          </p>
        </div>
        <div className="flex items-center justify-center">
          <input
            type="tel"
            placeholder="Enter your mobile number......"
            className="border border-gray-300 py-5 px-5  text-lg w-[60%]  focus:outline-none focus:ring-2 focus:gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl"
          />
          <button
            className="bg-gradient-to-r from-blue-400 to-purple-500 text-white py-5 px-6  ml-2 flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={() => alert("Number submitted")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* FAQ Carousel Section */}
      <div className="py-16 border-t border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">
            Everything you need to know about our security systems
          </p>
        </div>

        <div className="max-w-full mx-auto relative flex justify-between items-center">
          {/* Left Arrow */}
          <button
            onClick={prevFaq}
            className="p-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 transition-all absolute left-0"
            aria-label="Previous set of questions"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Displaying 3 or 4 FAQ items in a row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-4">
            {faqs
              .slice(currentFaqIndex, currentFaqIndex + itemsPerPage)
              .map((faq, index) => (
                <div
                  key={index}
                  className="min-h-[200px] bg-white rounded-lg p-8 shadow-lg"
                >
                  <h3 className="text-xl font-bold mb-4">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextFaq}
            className="p-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 transition-all absolute right-0"
            aria-label="Next set of questions"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="text-center mb-8">
        <button
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 transition-all py-2 px-4 rounded-md"
          onClick={() => setShowComparison(!showComparison)}
        >
          <span>{showComparison ? "Hide" : "Compare"} Plans and Features</span>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              showComparison ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {showComparison && (
        <div className="overflow-x-auto mb-8 shadow-lg hover:shadow-xl transition-shadow">
          <table className="w-full border-collapse ">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-2 text-left">Features</th>
                {plans.map((plan) => (
                  <th key={plan.name} className="border px-4 py-2 text-center">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureCategories.map((feature) => (
                <tr
                  key={feature}
                  className="hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-500 hover:text-white transition-all"
                >
                  <td className="border px-4 py-2 font-medium">{feature}</td>
                  {plans.map((plan) => (
                    <td
                      key={`${plan.name}-${feature}`}
                      className="border px-4 py-2 text-center"
                    >
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
  );
};

export default PricingPage;

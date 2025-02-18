import React from 'react';

const PrivacyPolicy = () => {
  //shadow-lg rounded-lg
  return (
    <div className="w-full max-w-7xl mx-auto p-4 pt-[5rem] font-mulish">
      <div className="bg-white  overflow-hidden"> 
        {/* Header Section */}
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Privacy Policy (USA)
          </h1>
          <p className="text-blue-600 text-sm mt-2">
            Date of last published version: 13/08/2024
          </p>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                1. INTRODUCTION
              </h2>
              <div className="space-y-4 text-gray-600">
                <div className="space-y-2">
                  <p className="text-sm leading-relaxed">
                    1.1. We are Wobot Intelligence Private Limited and Wobot Intelligence Inc. (collectively, "Wobot"). We are committed to ensuring that the privacy of our clients, visitors, and other users of the websites, mobile sites, mobile applications, software, services, including the application software and/or website, modules, functions, features supporting such services operated by Wobot or its affiliates or licensees (collectively, the "Services") is always respected.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm leading-relaxed">
                    1.2. The protection and security of your Personal Information and Usage Information (as defined below) is one of our top priorities. This Privacy Policy discloses and explains how we collect, use, share and protect Personal Information, Usage Information, or any other information about you.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Contact Information
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="text-sm leading-relaxed">
                  To exercise your rights, contact us by emailing{' '}
                  <a href="mailto:info@wobot.ai" className="text-blue-600 hover:underline">
                    info@wobot.ai
                  </a>{' '}
                  or calling{' '}
                  <a href="tel:+16508672578" className="text-blue-600 hover:underline">
                    +1 6508672578
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Age Restrictions
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="text-sm leading-relaxed">
                  Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Information, please contact us.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      {/* <footer className="mt-8 p-4 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <img 
              src="/api/placeholder/120/40" 
              alt="Wobot.ai Logo" 
              className="h-8"
            />
            <p className="text-sm text-gray-600">
              Wobot analyzes camera feeds and generates actionable insights
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <img 
              src="/api/placeholder/100/40" 
              alt="SOC 2 Certification" 
              className="h-10"
            />
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default PrivacyPolicy;
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import CreateJob from './CreateJob';
import JobPosting from './JobPosting';
import { normalImages } from '../../ImagePath';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const JobsPortal = () => {
  const navigate = useNavigate();
 const currentusers = useSelector((state)=>state.auth.user);
  const [isLoginView, setIsLoginView] = useState(true);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [jobs, setJobs] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [selectedJob, setSelectedJob] = useState(null);
  const [visibleJobs, setVisibleJobs] = useState(5);
  const [categories, setCategories] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Show/hide scroll button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Fetch jobs from the API on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('https://career-page-j4ik.onrender.com/api/jobs');
        const data = await response.json();
        setJobs(data);
        
        // Extract unique categories from jobs data and limit to 5
        const uniqueCategories = [...new Set(data.map(job => job.jobCategory))];
        setCategories(uniqueCategories.slice(0, 5)); // Only take first 5 categories
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []); 

  if(!currentusers){
    navigate('/login');
  }
  
  if (showCreateJob) {
    return <CreateJob onClose={() => setShowCreateJob(false)} />;
  }
  
  if (selectedJob) {
    return <JobPosting job={selectedJob} onClose={() => setSelectedJob(null)} />;
  }

  const formatCategoryText = (category) => {
    const words = category.split(' ');
    if (words.length > 2) {
      const midpoint = Math.ceil(words.length / 2);
      return (
        <>
          {words.slice(0, midpoint).join(' ')}
          <br />
          {words.slice(midpoint).join(' ')}
        </>
      );
    }
    return category;
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Scroll to top button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#4fe8a4] hover:bg-emerald-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Navigation */}
      {/* <nav className="flex justify-between items-center p-4 z-10 relative bg-white">
        <h1 className="text-4xl font-bold text-emerald-600">JobsPortal</h1>
        <div className="flex gap-4">
          <button 
            className="px-4 py-2 text-gray-600 hover:text-emerald-700 text-xl"
            onClick={() => {
              setIsLoginView(true);
              setShowAuth(true);
            }}
          >
            Login
          </button>
        </div>
      </nav> */}

      {/* Hero Section */}
      <div className="bg-white px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative h-[550px]">
        <div>
          <div className="ml-[15%]">
            <h2 className="text-7xl font-bold mb-4 tracking-tighter">
              Find A <span className="text-[#4fe8a4]">Job</span> That
              <br />
              <span className="text-[#4fe8a4]">Matches</span> Your
              <br />
              Passion
            </h2>
            <p className="text-gray-600 mb-6 text-2xl font-light">
              Hand-picked opportunities to work from home, remotely, freelance,
              full-time, part-time, contract, and internships.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by job title..."
                className="flex-1 p-3  border"
              />
              <button
                className="relative top-0 bg-[#4fe8a4] text-white px-6 py-6  flex items-center gap-2"
                style={{ left: '-9%' }}
              >
                Search
              </button>
            </div>
          </div>
          <img
            src={normalImages.Jobbg}
            alt="Job seeker"
            className="rounded-lg absolute right-0 w-[360px] top-[5%] mr-[15%]"
          />
          <div className="hidden lg:block">
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-16 px-4 bg-gray-100">
        <h3 className="text-2xl font-bold text-center mb-8">Popular Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-20 max-w-6xl mx-auto">
          {loading ? (
            <div>Loading categories...</div>
          ) : (
            categories.map((category, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer p-6"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <svg 
                      className="w-6 h-6 text-[#4fe8a4]"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-center">
                    {formatCategoryText(category)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Job Listings */}
      <div className="py-16 px-4 max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold mb-8">All Jobs here</h3>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-4">
            {jobs.slice(0, visibleJobs).map((job) => (
              <div key={job._id} className="bg-white shadow-lg hover:shadow-xl transition-shadow p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#4fe8a4] rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      J
                    </div>
                    <div>
                      <h4 className="font-bold mb-2 text-[20px] tracking-tighter">{job.jobTitle}</h4>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <img src={normalImages.Jobmap} alt="before location" className="w-4 h-4" />
                          <span className="text-[15px]">{job.jobLocation}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <img src={normalImages.Jobmin} alt="before job type" className="w-4 h-4" />
                          <span className="text-[15px]">{job.jobType}</span>
                        </span>
                        <span className="text-[15px]">{job.salaryRange}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedJob(job)}
                    className="px-4 py-2 bg-[#4fe8a4] text-white hover:bg-emerald-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View More Button */}
        {visibleJobs < jobs.length && (
          <div className="flex justify-center mt-8">
            <button 
              onClick={() => setVisibleJobs(visibleJobs + 5)} 
              className="px-4 py-2 bg-[#4fe8a4] text-white hover:bg-emerald-700 flex items-center"
            >
              View More
              <img src={normalImages.Jobarrow} alt="icon" className="ml-2 w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      {/* <footer className="bg-[#4fe8a4] text-white p-4 text-center">
        <p>&copy; 2024 Jobs Portal. Designed By Tanishk Tiwari.</p>
      </footer> */}
    </div>
  );
};

export default JobsPortal;
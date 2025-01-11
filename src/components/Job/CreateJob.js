import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

const CreateJob = ({ onClose }) => {
  const navigate = useNavigate(); // Initialize navigate function
  const [formData, setFormData] = useState({
    companyName: "",
    companyWebsite: "",
    jobTitle: "",
    jobCategory: "",
    jobType: "",
    jobLocation: "",
    salaryRange: "",
    experience: "",
    qualification: "",
    applicationDeadline: "",
    applicationLink: "",
    jobDescription: "",
  });

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("https://career-page-j4ik.onrender.com/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Job posted successfully", data);
      navigate("/list"); // Navigate after posting the job
    } else {
      const errorData = await response.json();
      console.log("Error posting job:", errorData.message);
    }
  } catch (error) {
    console.error("Error posting job:", error);
  }
};


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handlePostJobClick = () => {
    navigate("/list"); // Correctly use navigate here
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-4">
        <h1 className="text-4xl font-bold text-[#4fe8a4]">JobsPortal</h1>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-transparent border-2 border-[#4fe8a4] text-black rounded-md hover:bg-emerald-700 hover:text-white text-xl">
            Logout
          </button>
          {/* <button className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">
            Post a job
          </button> */}
        </div>
      </nav>
      <div className="text-center">
        <h2 className="text-2xl font-semibold bg-[#f4f5f7] h-20 flex items-center justify-center mb-8">
          Create a job
        </h2>
      </div>
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg p-6 shadow-sm space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block  mb-2 font-bold text-xl">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4fe8a4] focus:border-transparent"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-xl mb-2">
                  Company Website
                </label>
                <input
                  type="text"
                  name="companyWebsite"
                  placeholder="Website Link"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4fe8a4] focus:border-transparent"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-xl mb-2">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                placeholder="Title"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4fe8a4] focus:border-transparent"
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div>
                  <label className="block font-bold text-xl mb-2">
                    Job Category
                  </label>
                  <input
                    type="text"
                    name="jobCategory"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4fe8a4] focus:border-transparent"
                    onChange={handleChange}
                    value={formData.jobCategory}
                    placeholder="Enter job category"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-xl mb-2">Job Type</label>
                <select
                  name="jobType"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4fe8a4] focus:border-transparent"
                  onChange={handleChange}
                  value={formData.jobType}
                >
                  <option value="Please select">Please select</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-xl mb-2">
                  Job Location
                </label>
                <input
                  type="text"
                  name="jobLocation"
                  placeholder="Location"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4fe8a4] focus:border-transparent"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-xl mb-2">
                  Salary Range
                </label>
                <input
                  type="text"
                  name="salaryRange"
                  placeholder="Salary Range"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4fe8a4] focus:border-transparent"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-xl mb-2">
                  Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  placeholder="Experience"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4fe8a4] focus:border-transparent"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block font-bold text-xl mb-2">
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  placeholder="Qualification"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4fe8a4] focus:border-transparent"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-xl mb-2">
                Application Deadline
              </label>
              <input
                type="date"
                name="applicationDeadline"
                placeholder="Job application deadline"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4fe8a4] focus:border-transparent"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block font-bold text-xl mb-2">
                Job Application Link
              </label>
              <input
                type="text"
                name="applicationLink"
                placeholder="Job application link url"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4fe8a4] focus:border-transparent"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block font-bold text-xl mb-2">
                Job Description
              </label>
              <textarea
                name="jobDescription"
                placeholder="Job Description"
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4fe8a4] focus:border-transparent"
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-between space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-transparent border-2 border-[#4fe8a4] text-black rounded-md hover:bg-emerald-700 hover:text-white text-xl"
                onClick= {handlePostJobClick}
              >
                Go back
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-[#4fe8a4] text-white rounded-md hover:bg-emerald-700 text-xl"
              >
                Post Job
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#4fe8a4] text-white p-4 text-center">
        <p>&copy; 2024 Jobs Portal. Designed By Tanishk Tiwari.</p>
      </footer>
    </div>
  );
};

export default CreateJob;

import React, { useState } from "react";

const JobPosting = ({ job, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    resume: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      resume: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Application submitted:", formData);
    setShowModal(false);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 ">
      <nav className="flex justify-between items-center p-4">
        <h1 className="text-4xl font-bold text-[#4fe8a4]">JobsPortal</h1>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 text-gray-600 hover:text-emerald-700 text-xl"
            // onClick={() => {
            //   setIsLoginView(true);
            //   setShowAuth(true);
            // }}
          >
            Login
          </button>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="flex justify-items-start mb-4">
          {" "}
          {/* Added flex and justify-center */}
          <span
            onClick={onClose}
            className=" text-black hover:text-[#4fe8a4] cursor-pointer"
          >
            ← Back to Jobs
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="bg-gray-100 p-6 rounded-t-lg">
            <div className="flex items-center gap-6 mb-4">
              <div className="w-16 h-16 bg-[#4fe8a4] rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {job.companyName?.[0] || "J"}
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">{job.jobTitle}</h1>
                {/* <p className="text-gray-600">{job.companyName}</p> */}
              </div>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                View Company
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-[#4fe8a4] text-white rounded-md hover:bg-emerald-700"
              >
                Apply This Job
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <DetailItem label="Job Type" value={job.jobType} />
              <DetailItem label="Location" value={job.jobLocation} />
              <DetailItem
                label="Experience Required"
                value={job.experience || "Not specified"}
              />
              <DetailItem label="Salary Range" value={job.salaryRange} />
              <DetailItem
                label="Application Deadline"
                value={
                  job.applicationDeadline
                    ? `${new Date(job.applicationDeadline)
                        .getDate()
                        .toString()
                        .padStart(2, "0")}/${(
                        new Date(job.applicationDeadline).getMonth() + 1
                      )
                        .toString()
                        .padStart(2, "0")}/${new Date(job.applicationDeadline)
                        .getFullYear()
                        .toString()
                        .slice(2)}`
                    : "Not specified"
                }
              />
            </div>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Job Description</h2>
              <div className="text-gray-700 space-y-4">
                {job.jobDescription}
              </div>
            </section>
          </div>
        </div>

        {/* Application Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold ml-[30%]">Job Application</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-4xl -mt-[10%]"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Years of Experience</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Upload Resume</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded mb-4"
                    required
                  />
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#4fe8a4] text-white rounded hover:bg-emerald-700"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#4fe8a4] text-white p-4 text-center">
        <p>&copy; 2024 Jobs Portal. Designed By Tanishk Tiwari.</p>
      </footer>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div>
    <div className="font-semibold">{label}:</div>
    <div className="text-gray-700">{value}</div>
  </div>
);

export default JobPosting;

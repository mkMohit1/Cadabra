import React, { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment"; // Import moment.js for date formatting

const List = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   // Fetch jobs from backend
  //   const fetchJobs = async () => {
  //     const token = localStorage.getItem("jwtToken");
  //     if (!token) {
  //       window.location.href = "/auth";
  //     }

  //     try {
  //       const response = await axios.get("https://career-page-j4ik.onrender.com/api/jobs", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setJobs(response.data);
  //       setLoading(false);
  //     } catch (err) {
  //       console.error(err);
  //       setError("Failed to load jobs");
  //       setLoading(false);
  //     }
  //   };

  //   fetchJobs();
  // }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("savedUsername");
    window.location.href = "/auth";
  };

  const handleView = (job) => {
    setSelectedJob(job);
    setIsViewModalOpen(true);
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setEditFormData(job);
    setIsEditModalOpen(true);
  };

  const handleDelete = (job) => {
    setSelectedJob(job);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setJobs(
      jobs.map((job) => (job._id === selectedJob._id ? editFormData : job))
    );
    setIsEditModalOpen(false);
  };

  // Updated delete confirmation function to call DELETE API
  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.delete(`https://career-page-j4ik.onrender.com/api/jobs/${selectedJob._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setJobs(jobs.filter((job) => job._id !== selectedJob._id)); // Remove job from state
        setIsDeleteModalOpen(false); // Close modal
        alert('Job deleted successfully!');
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert('Failed to delete the job');
    }
  };

  const handlePostJobClick = () => {
    navigate("/createjob");
  };

  const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    );
  };

  const ViewModal = () => (
    <Modal
      isOpen={isViewModalOpen}
      onClose={() => setIsViewModalOpen(false)}
      title="Job Details"
    >
      {selectedJob && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Title</h3>
            <p>{selectedJob.jobTitle}</p>
          </div>
          <div>
            <h3 className="font-semibold">Job Type</h3>
            <p>{selectedJob.jobType}</p>
          </div>
          <div>
            <h3 className="font-semibold">Posted Date</h3>
            <p>{moment(selectedJob.applicationDeadline).format("DD/MM/YYYY")}</p>
          </div>
          <div>
            <h3 className="font-semibold">Description</h3>
            <p>{selectedJob.jobDescription}</p>
          </div>
          <div>
            <h3 className="font-semibold">Location</h3>
            <p>{selectedJob.jobLocation}</p>
          </div>
          <div>
            <h3 className="font-semibold">Salary Range</h3>
            <p>{selectedJob.salaryRange}</p>
          </div>
          <div>
            <h3 className="font-semibold">Application Link</h3>
            <a href={selectedJob.applicationLink} target="_blank" rel="noopener noreferrer" className="text-blue-600">
              Apply Here
            </a>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );

  const EditModal = () => (
    <Modal
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      title="Edit Job"
    >
      <form onSubmit={handleEditSubmit} className="space-y-4">
        {/* Edit Form Inputs */}
      </form>
    </Modal>
  );

  const DeleteModal = () => (
    <Modal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      title="Confirm Deletion"
    >
      <div>
        <p className="mb-4">
          Are you sure you want to delete this job posting? This action cannot
          be undone.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteConfirm} // Use updated delete handler
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex justify-between items-center p-4">
        <h1 className="text-4xl font-bold text-[#4fe8a4]">JobsPortal</h1>
        <div className="flex gap-4">
          <button
            className="text-[#4fe8a4] hover:text-emerald-700"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            className="px-4 py-2 bg-[#4fe8a4] text-white rounded-md hover:bg-emerald-700"
            onClick={handlePostJobClick}
          >
            Post a job
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-8">My Jobs List</h2>

        {loading ? (
          <p>Loading jobs...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                    Company Name
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                    Location
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                    Application Deadline
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-400 bg-white">
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center">
                      {job.companyName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center">
                      {job.jobTitle}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center">
                      {job.jobLocation}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center">
                      {moment(job.applicationDeadline).format("DD/MM/YYYY")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center">
                      <div className="flex justify-center space-x-4">
                        <button
                          className="text-[#4fe8a4] hover:text-emerald-700"
                          onClick={() => handleView(job)}
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handleEdit(job)}
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(job)}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="bg-[#4fe8a4] text-white p-4 text-center">
        <p>&copy; 2024 Jobs Portal. Designed By Tanishk Tiwari.</p>
      </footer>

      <ViewModal />
      <EditModal />
      <DeleteModal />
    </div>
  );
};

export default List;

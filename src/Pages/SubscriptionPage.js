import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { errorToast, successToast } from "../DecryptoAndOther/ToastUpdate";

const SubscriptionPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default entries per page

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACK_URL}/fetchSubscriptions`
        );
        if (response.ok) {
          const data = await response.json();
          setSubscriptions(data.data);
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleDelete = async (id) => {
    console.log("Deleting subscription with ID:", id);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}/deleteSubscription/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        successToast(data.message);
        setSubscriptions(subscriptions.filter((sub) => sub._id !== id));
        setCurrentPage(1);
      } else {
        errorToast(data.message);
      }
    } catch (error) {
      console.error("Error deleting subscription:", error);
      errorToast("Failed to delete subscription.");
    }
  };
  

  // Filter and Paginate Data
  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubscriptions.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Subscriptions Management</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <button
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition duration-300"
          onClick={() => setSearch("")}
        >
          Reset
        </button>
        <input
          type="text"
          placeholder="Search Subscriptions"
          className="border border-gray-300 px-4 py-2 rounded w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((sub) => (
              <tr key={sub._id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-4 py-3">{sub.email}</td>
                <td className="px-4 py-3">{new Date(sub.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDelete(sub._id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded transition duration-300"
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination and Manual Rows Per Page */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-2">
              <div className="flex items-center">
                <span className="mr-2 text-gray-600">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page on change
                  }}
                  className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
                <span className="ml-2 text-gray-600">entries</span>
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded transition duration-300 ${
                      currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} /> Prev
                  </button>
      
                  <span className="text-gray-700 px-4">
                    Page {currentPage} of {totalPages}
                  </span>
      
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded transition duration-300 ${
                      currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Next <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              )}
              </div>
    </div>
  );
};

export default SubscriptionPage;

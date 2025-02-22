import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const truncateText = (text, limit) => {
  return text.length > limit ? text.substring(0, limit) + '...' : text;
};

const FaqsPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [newFAQ, setNewFAQ] = useState({ page: '', question: '', answer: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default rows per page

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/fetchFaq`);
        setFaqs(response.data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchFAQs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACK_URL}/deleteFAQ/${id}`);
      setFaqs(faqs.filter(faq => faq._id !== id));
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  const handleAddFAQ = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/createFaq`, newFAQ);
      setFaqs([...faqs, response.data]);
      setNewFAQ({ page: '', question: '', answer: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding FAQ:', error);
    }
  };

  const handleUpdateFAQ = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACK_URL}/updateFAQ/${editingFAQ._id}`, editingFAQ);
      setFaqs(faqs.map(faq => faq._id === editingFAQ._id ? response.data : faq));
      setEditingFAQ(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating FAQ:', error);
    }
  };

  const startEditing = (faq) => {
    setEditingFAQ(faq);
    setShowForm(true);
  };

  const handleSubmit = () => {
    editingFAQ ? handleUpdateFAQ() : handleAddFAQ();
  };

  // Filtering and pagination logic
  const filteredFaqs = faqs.filter(faq => faq.question.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFaqs.slice(indexOfFirstItem, indexOfLastItem);


  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">FAQs Management</h1>
        <button 
          onClick={() => {
            setEditingFAQ(null);
            setNewFAQ({ page: '', question: '', answer: '' });
            setShowForm(true);
          }} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Add New FAQ
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">
              {editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="page" className="block text-sm font-medium text-gray-700 mb-1">Page</label>
                <input
                  id="page"
                  type="text"
                  placeholder="Enter page name"
                  value={editingFAQ ? editingFAQ.page : newFAQ.page}
                  disabled ={editingFAQ?true:false}
                  onChange={(e) => 
                    editingFAQ 
                      ? setEditingFAQ({...editingFAQ, page: e.target.value}) 
                      : setNewFAQ({...newFAQ, page: e.target.value})
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <input
                  id="question"
                  type="text"
                  placeholder="Enter FAQ question"
                  value={editingFAQ ? editingFAQ.question : newFAQ.question}
                  onChange={(e) => 
                    editingFAQ 
                      ? setEditingFAQ({...editingFAQ, question: e.target.value}) 
                      : setNewFAQ({...newFAQ, question: e.target.value})
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                <textarea
                  id="answer"
                  placeholder="Enter detailed answer"
                  value={editingFAQ ? editingFAQ.answer : newFAQ.answer}
                  onChange={(e) => 
                    editingFAQ 
                      ? setEditingFAQ({...editingFAQ, answer: e.target.value}) 
                      : setNewFAQ({...newFAQ, answer: e.target.value})
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  required
                />
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 flex-grow"
                >
                  {editingFAQ ? 'Update' : 'Save'}
                </button>
                <button 
                  onClick={() => {
                    setShowForm(false);
                    setEditingFAQ(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the existing component remains the same */}
      <div className="flex justify-between items-center mb-4">
        <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition duration-300">Reset</button>
        <input
          type="text"
          placeholder="Search FAQs"
          className="border border-gray-300 px-4 py-2 rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {faqs.filter(faq => faq.question.toLowerCase().includes(search.toLowerCase())).map((faq) => (
              <tr key={faq._id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-4 py-3 whitespace-nowrap">{faq.page}</td>
                <td className="px-4 py-3">{truncateText(faq.question, 50)}</td>
                <td className="px-4 py-3">{truncateText(faq.answer, 50)}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center space-x-2">
                    <button 
                      onClick={() => startEditing(faq)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded transition duration-300"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button 
                      onClick={() => handleDelete(faq._id)} 
                      className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded transition duration-300"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
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

export default FaqsPage;
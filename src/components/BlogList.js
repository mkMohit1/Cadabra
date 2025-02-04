import React, { useState, useEffect } from "react";
import SearchBar from "../components/Search";
import BlogCard from "../components/BlogCard";
const BlogList = ({ blogs, onNewBlog, handleBlogEdit }) => {
const [filteredBlogs, setFilteredBlogs] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const blogsPerPage = 10;
const startIndex = (currentPage - 1) * blogsPerPage;
const endIndex = startIndex + blogsPerPage;
const currentBlogs =filteredBlogs.length > 0 ? filteredBlogs.slice(startIndex, endIndex) : [];
const totalPages =
  filteredBlogs.length > 0
    ? Math.ceil(filteredBlogs.length / blogsPerPage)
    : 0;
const handlePageChange = (page) => setCurrentPage(page);
useEffect(() => {
  if (blogs && Array.isArray(blogs)) {
    setFilteredBlogs(blogs);
  }
}, [blogs]);

  const handleSearch = async (term) => {
    if (!term) {
      setFilteredBlogs(blogs);
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACK_URL}/blogs/search?query=${term}`
      );
      if (response.ok) {
        const results = await response.json();
        setFilteredBlogs(results);
      } else {
        setFilteredBlogs([]);
        console.log("No blogs found for this search.");
      }
    } catch (error) {
      console.log("Error searching blogs:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">
            Blogs
          </h3>
          <button
            onClick={onNewBlog}
            className="w-full sm:w-auto px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full cursor-pointer transition-all hover:bg-indigo-700 hover:shadow-lg active:scale-95"
          >
            + Add New Blog
          </button>
        </div>
        <div className="px-4 sm:px-6 pb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Loading State */}
      {/* {loading && (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )} */}

      {/* Error State */}
      {/* {error && (
          <div className="text-red-600 text-center p-4 bg-red-50 rounded-lg">
            {error}
          </div>
        )} */}

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {currentBlogs.length > 0 ? (
          currentBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} handleBlogEdit={handleBlogEdit} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No blogs available.
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredBlogs.length > blogsPerPage && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-4 py-2 text-sm rounded-md transition-colors
                    ${
                      currentPage === i + 1
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";

const BlogSection = ({ blogs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleBlogs, setVisibleBlogs] = useState(3); // Default to 3 blogs
  const clonedBlogs = Array.isArray(blogs) ? [...blogs, ...blogs] : []; // Duplicate blogs for infinite loop
  const navigate = useNavigate();
  const handleNext = () => {
    if (currentIndex < blogs.length + visibleBlogs - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Reset to start after finishing one loop (seamless)
      setTimeout(() => {
        setCurrentIndex(visibleBlogs);
      }, 300); // Match the transition duration
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Reset to end of first loop
      setTimeout(() => {
        setCurrentIndex(blogs.length - visibleBlogs);
      }, 300); // Match the transition duration
    }
  };

  const handleBlogClick = (id) => {
    // Redirect to blog post page
    navigate(`/blog/${id}`);
    // console.log("Blog ID:", id);
  };

  const updateVisibleBlogs = () => {
    if (window.innerWidth < 768) {
      setVisibleBlogs(1); // Small screens: 1 blog visible
    } else if (window.innerWidth < 1024) {
      setVisibleBlogs(2); // Medium screens: 2 blogs visible
    } else {
      setVisibleBlogs(3); // Large screens: 3 blogs visible
    }
  };

  useEffect(() => {
    // Set initial value based on window width
    updateVisibleBlogs();

    // Add event listener for window resize
    window.addEventListener("resize", updateVisibleBlogs);

    // Cleanup event listener
    return () => {
      window.removeEventListener("resize", updateVisibleBlogs);
    };
  }, []);

  useEffect(() => {
    // Reset the index smoothly if out of bounds
    if (currentIndex >= blogs.length + visibleBlogs) {
      setCurrentIndex(visibleBlogs);
    } else if (currentIndex < 0) {
      setCurrentIndex(blogs.length - visibleBlogs);
    }
  }, [currentIndex, blogs.length, visibleBlogs]);

  console.log(blogs);
  return (
    blogs && blogs.length > 0 ? (
      <div className="blog-section lg:max-w-[1700px] lg:mx-auto text-center py-12 px-4 bg-gray-100 font-mulish">
        {/* Header */}
        <div className=" mb-8 md:w-full lg:max-w-7xl mx-auto h-fit flex flex-col bg-gray-100">
          <h3 className="text-lg font-extrabold  opacity-[0.7]"><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Our Blog</span></h3>
          <h2 className="text-sm sm:text-sm md:text-2xl lg:text-[2rem] font-light text-[#222] mt-2 tracking-[-1px]">
              From around the World
          </h2>
        </div>

        {/* Blog Slider */}
        <div className="blog-slider relative flex items-center justify-center">
          <button
            className="nav-button prev absolute -left-4 md:left-2 text-7xl text-[#333] z-10 hover:text-[#0a2640]"
            onClick={handlePrev}
          >
            &#8249;
          </button>

          <div className="blog-cards-container overflow-hidden w-full max-w-5xl mx-auto">
            <div
              className="blog-cards flex transition-transform duration-300"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleBlogs)}%)`,
              }}
            >
              {clonedBlogs.map((post,index) => {
                const date = new Date(post.date);
                const formattedDate = date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });

                return (
                  <div
                    className={`blog-card relative flex-shrink-0 bg-white mr-4 w-full lg:w-[330px] ${
                      visibleBlogs === 1 ? `w-[310px] xxs:${index ==0?"ml-4":"ml-4"} xs:w-[95%] xs:ml-0` : visibleBlogs === 2 ? "md:w-[330px] ml-[20px]" : "md:w-1/3"
                    } p-4`}
                    key={post._id}
                    onClick={() => handleBlogClick(post._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={post.coverImage || "https://via.placeholder.com/1200x500"}
                      alt={post.title}
                      className="blog-image w-full h-48 object-cover"
                    />
                    <div className="blog-content p-4">
                      <p className="category text-sm text-[#888] mb-4">
                        <span className="font-bold">
                          {post.category || "Uncategorized"}
                        </span>{" "}
                        <span>{formattedDate}</span>
                      </p>
                      <h4 className="title text-lg font-medium text-[#333] mb-4">
                        {post.title}
                      </h4>
                      <div className="author flex items-center justify-between">
                        {post.userImage && (
                          <div className="author-image flex items-center">
                            <img
                              src={post.userImage}
                              alt="author"
                              className="w-10 h-10 rounded-full mr-2"
                            />
                            <span className="text-sm text-[#555]">
                              By {post.author || "Unknown"}
                            </span>
                          </div>
                        )}
                        <div className="read-btn absolute bottom-0">
                          {/* <Link to={`/blog/${post._id}`}>
                            <FontAwesomeIcon
                              icon={faCircleArrowRight}
                              className="arrow text-[lightgray] hover:text-[#ffd437] w-10 h-10 rounded-full"
                            />
                          </Link> */}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            className="nav-button next absolute -right-4 md:right-2 text-7xl text-[#333] hover:text-[#0a2640]"
            onClick={handleNext}
          >
            &#8250;
          </button>
        </div>
      </div>
    ) : null
  );
};

export default BlogSection;

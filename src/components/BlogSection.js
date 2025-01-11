import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/BlogSection.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";

const BlogSection = ({ blogs }) => {
  console.log(blogs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleBlogs = 3; // Number of blogs to show at a time

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + blogs.length) % blogs.length);
  };

  return (
    <>
    {blogs && blogs.length > 0 ? 
    <div className="blog-section">
      <div className="header">
        <h3>Our Blog</h3>
        <h2>Value proposition accelerator product management venture</h2>
      </div>

      <div className="blog-slider">
        <button
          className="nav-button prev"
          onClick={handlePrev}
          // disabled={currentIndex === 0}
        >
          &#8249;
        </button>
        <div className="blog-cards-container">
          <div
            className="blog-cards"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleBlogs)}%)`,
            }}
          >
            {blogs.map((post) => {
              const date = new Date(post.date);
              const options = { year: "numeric", month: "long", day: "numeric" };
              const formattedDate = date.toLocaleDateString("en-US", options);

              return (
                <div className="blog-card" key={post._id}>
                  <img
                    src={post.coverImage || "https://via.placeholder.com/1200x500"}
                    alt={post.title}
                    className="blog-image"
                  />
                  <div className="blog-content">
                    <p className="category">
                      <span style={{ fontWeight: "bold" }}>
                        {post.category || "Uncategorized"}
                      </span>{" "}
                      <span>{formattedDate}</span>
                    </p>
                    <h4 className="title">{post.title}</h4>
                    <div className="author">
                      {post.userImage && (
                        <div className="author-image">
                          <img src={post.userImage} alt="author" />
                          <span> {`By ${post.author || "Unknown"}`}</span>
                        </div>
                      )}
                      <div className="read-btn">
                      <Link to={`/blog/${post._id}`}><FontAwesomeIcon icon={faCircleArrowRight} className="arrow"/></Link>
                    </div>
                    </div>
                    
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <button
          className="nav-button next"
          onClick={handleNext}
          // disabled={(currentIndex -2) >= blogs.length - visibleBlogs}
        >
          &#8250;
        </button>
      </div>
    </div>
    :""}
    </>
  );
};

export default BlogSection;

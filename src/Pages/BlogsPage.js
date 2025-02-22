import React, { useState } from "react";
import "../styles/BlogPage.scss";

const BlogPage = ({blogs = []}) => {
  const [showMoreFeature, setShowMoreFeature] = useState(false);
  let featuredBlogs = blogs.filter((blog) => blog.isOnCoverTop === 'yes');
  
  // Check if featuredBlogs is empty or undefined
  if (!featuredBlogs || featuredBlogs.length === 0) {
    if (blogs.length > 0) {
      let randomIndex = Math.floor(Math.random() * blogs.length);
      // Convert single blog to array
      featuredBlogs = [blogs[randomIndex]];
    } else {
      // Ensure featuredBlogs is an empty array if blogs is empty
      featuredBlogs = [];
    }
  }
  console.log(featuredBlogs);

  const trendingBlogs = blogs;

  const featuredVideos = [
    {
      id: 1,
      title: "Reader Spotlight: Transformation Stories",
      type: "Advice",
      time: "15:48",
    },
    {
      id: 2,
      title: "Guest Expert Takeover: Interactive Beauty Experiences",
      type: "Experts",
      time: "15:48",
    },
    {
      id: 3,
      title: "Step-by-Step Guide: Achieving the Perfect Smokey Eye",
      type: "Tutorial",
      time: "15:48",
    },
  ];

  const handleShowFeatureBlog = () => {
    setShowMoreFeature(!showMoreFeature);
  };

  return (
    <section className="blog-section pt-[4rem] font-mulish">
      {/* Featured Blog */}
      <div className="featured-section">
        {featuredBlogs.map((blog) => (
          // featured-content
          <div key={blog._id} className={`flex flex-col ${!showMoreFeature ? 'lg:flex-row' : ''} gap-4`}>
            <div className={`image-content ${!showMoreFeature ? 'lg:w-[80%]' : 'w-full'}`}>
              <img 
                src={`${process.env.REACT_APP_BACK_URL}${blog.coverImage}`} 
                alt={blog.title}
                className={`w-full object-contain ml-2 rounded-lg ${!showMoreFeature ? 'h-[300px]' : 'max-h-[500px]'}`}
              />
            </div>
            <div className="flex flex-col w-full px-4 pt-2 relative font-mulish">
              <h2 className="text-4xl font-bold mb-6 text-gray-800 leading-tight">{blog.title}</h2>
              <div className={`relative ${!showMoreFeature ? 'max-h-[180px]' : ''} overflow-hidden`}>
                <div
                  className="blog-html-content prose prose-lg max-w-none 
                    prose-headings:text-gray-800 prose-headings:font-semibold prose-headings:mt-6 prose-headings:mb-4
                    prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-base prose-p:mb-4
                    prose-strong:text-gray-700 prose-strong:font-medium
                    prose-ul:my-4 prose-li:text-gray-600"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                ></div>
                {!showMoreFeature && (
                  <>
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
                    <button 
                      className="read-more absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#0A2640] text-white px-4 py-2 rounded-[8px] text-xl font-medium hover:bg-[#1C3D5D] transition-colors z-10 border border-[#0A2640] hover:border-[#1C3D5D]"
                      onClick={handleShowFeatureBlog}
                    >
                      Read more
                    </button>
                  </>
                )}
              </div>
              {showMoreFeature && (
                <button 
                  className="read-more mt-3 mb-2 bg-[#0A2640] text-white px-8 py-3 rounded-[8px] text-xl font-medium hover:bg-[#1C3D5D] transition-colors self-center border border-[#0A2640] hover:border-[#1C3D5D]"
                  onClick={handleShowFeatureBlog}
                >
                  Read less
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Trending Blogs */}
      <div className="trending-section font-mulish">
        <h2 className="section-title">Stay Trendy with Our Latest Insights</h2>
        <div className="blogs-grid">
          {trendingBlogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              <img src={`${process.env.REACT_APP_BACK_URL}${blog.coverImage}`} alt={blog.title} className="blog-image" />
              <div className="blog-content">
                <h3 className="blog-title">{blog.title}</h3>
                <p className="blog-description">{blog.description}</p>
                <div className="blog-footer">
                  <span>Jane Doe</span> • <span>5min read</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="see-more-btn">See More</button>
      </div>

      {/* Featured Videos */}
      {/* <div className="featured-videos">
        <h2 className="section-title">Featured Videos</h2>
        <div className="video-container">
          <div className="video-main">
            <img src="video-placeholder.png" alt="Main Video" />
          </div>
          <div className="video-list">
            {featuredVideos.map((video) => (
              <div key={video.id} className="video-item">
                <p className="video-title">{video.title}</p>
                <span className="video-meta">
                  {video.type} • {video.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Subscription Section */}
      <div className="subscription-section">
        <div className="subscription-content font-mulish">
          <h3>Join our exclusive beauty community</h3>
          <p>
            Elevate your beauty journey with personalized recommendations and
            stay connected with a community that shares your passion.
          </p>
          <div className="subscription-form">
            <input
              type="email"
              placeholder="Email Address"
              aria-label="Email Address"
            />
            <button>Subscribe</button>
          </div>
        </div>
        <div className="subscription-image">
          <img src="community-image.png" alt="Beauty Community" />
        </div>
      </div>
    </section>
  );
};

export default BlogPage;

import React from "react";
import "../styles/BlogPage.Module.scss";

const BlogPage = () => {
  const featuredBlogs = [
    {
      id: 1,
      title: "10 Must-Have Skincare Products for Radiant Skin",
      description:
        "Explore essential skincare products that can transform your daily routine...",
      image: "featured1.png",
    },
  ];

  const trendingBlogs = [
    {
      id: 1,
      title: "Seasonal Makeup Trends: Fall Edition",
      description:
        "Dive into the enchanting world of fall-inspired makeup trends...",
      image: "image1.png",
    },
    {
      id: 2,
      title: "Reviewing the Latest Beauty Innovations in 2023",
      description:
        "Stay on the cutting edge of beauty with a comprehensive review...",
      image: "image2.png",
    },
    {
      id: 3,
      title: "Reader Spotlight: Transformation Stories",
      description:
        "Witness incredible transformations of our valued customers...",
      image: "image3.png",
    },
    {
      id: 4,
      title: "Inside BB: Product Development Journey",
      description:
        "Take an exclusive behind-the-scenes look at the creation of beauty products...",
      image: "image4.png",
    },
    {
      id: 5,
      title: "Exclusive Interview with Jenna Milhouse (@missyb)",
      description:
        "Gain insights from a renowned beauty influencer or expert...",
      image: "image5.png",
    },
    {
      id: 6,
      title: "Step-by-Step Guide: Achieving the Perfect Smokey Eye",
      description:
        "Witness the art of achieving the perfect smokey eye through step-by-step guidance...",
      image: "image6.png",
    },
  ];

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

  return (
    <section className="blog-section">
      {/* Featured Blog */}
      <div className="featured-section">
        {featuredBlogs.map((blog) => (
          <div key={blog.id} className="featured-content">
            <div className="text-content">
              <h2 className="title">{blog.title}</h2>
              <p className="description">{blog.description}</p>
              <button className="read-more">Read more</button>
            </div>
            <div className="image-content">
              <img src={blog.image} alt={blog.title} />
            </div>
          </div>
        ))}
      </div>

      {/* Trending Blogs */}
      <div className="trending-section">
        <h2 className="section-title">Stay Trendy with Our Latest Insights</h2>
        <div className="blogs-grid">
          {trendingBlogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <img src={blog.image} alt={blog.title} className="blog-image" />
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
      <div className="featured-videos">
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
      </div>

      {/* Subscription Section */}
      <div className="subscription-section">
        <div className="subscription-content">
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

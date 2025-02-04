import React, { useEffect, useState } from "react";
import "../styles/BlogPost.scss"; // Add custom styles in this file
import { normalImages } from "../ImagePath";

const BlogPost = ({ title, subtitle, imageUrl, featuredText, onContactClick, onSubscribeClick, htmlContent }) => {
  const currentBlogID = window.location.href.split('blog/');
  // console.log(currentBlogID);
  const [blog, setBlog] = useState(null);
  useEffect(()=>{
    const fetchBlog = async()=>{
      try{
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}/blog/${currentBlogID[1]}`);
      const data = await response.json();
      // console.log(data);
      setBlog(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
    }
    fetchBlog();
  },[]);
  if (!blog) {
    return <div>Loading...</div>;
  }
  return (
    <div className="blog-post">
      {/* <header className="blog-header">
        <nav className="blog-nav">
          <ul>
            <li><a href="#">Featured</a></li>
            <li><a href="#">How-to</a></li>
            <li><a href="#">Expert Advice</a></li>
          </ul>
          <h1 className="logo">ab</h1>
          <div className="blog-actions">
            <button onClick={onContactClick}>Contact</button>
            <button onClick={onSubscribeClick}>Subscribe</button>
          </div>
        </nav>
      </header> */}

      <div className="blog-content">
        {blog.category && <span className="blog-featured">{blog.category}</span>}
        <h2 className="blog-title">{blog.title}</h2>
        <p className="blog-subtitle">{blog.description}</p>
        <img src={`${process.env.REACT_APP_BACK_URL}${blog.coverImage}`} alt={title} className="blog-image" />
        <div
          className="blog-html-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        ></div>
      </div>

      {/* Add the trending topics section */}
      <section className="trending-topics">
        <h3>Stay Trendy with Our Latest Insights</h3>
        <div className="topics-container">
          <div className="topic-card">
            <img src="path/to/first-image.jpg" alt="Product Development Journey" />
            <h4>Inside BB: Product Development Journey</h4>
            <p>Take an exclusive behind-the-scenes look at the creation of beauty products. Learn about commitment to quality, innovation, and the meticulous process that goes into each product.</p>
            <span>Jane Doe - 5min read</span>
          </div>
          <div className="topic-card">
            <img src="path/to/second-image.jpg" alt="Exclusive Interview with Jenna Milhouse" />
            <h4>Exclusive Interview with Jenna Milhouse @missyb</h4>
            <p>Gain insights from a renowned beauty influencer or expert in an exclusive interview. Discover their favorite beauty tips, product recommendations, and the secrets behind their success in the industry.</p>
            <span>Jane Doe - 5min read</span>
          </div>
          <div className="topic-card">
            <img src="path/to/third-image.jpg" alt="Achieving the Perfect Smokey Eye" />
            <h4>Step-by-Step Guide: Achieving the Perfect Smokey Eye</h4>
            <p>Witness the incredible transformations of our valued customers. Read real stories of beauty journeys, complete with before-and-after photos, and be inspired by the power of self-care.</p>
            <span>Jane Doe - 5min read</span>
          </div>
        </div>
        <button className="see-more">See More</button>
      </section>
 {/* Subscription Section */}
 <section className="subscription-section">
        <div className="subscription-text">
          <h3>Join our exclusive beauty community</h3>
          <p>
            Elevate your beauty journey with personalized recommendations and stay connected with a
            community that shares your passion for self-care. Subscribe now and embark on a beauty
            adventure with us!
          </p>
          <form className="subscription-form">
            <input
              type="email"
              placeholder="Email Address"
              aria-label="Email Address"
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
        <div className="subscription-image">
          <img src={normalImages.blogBottom} alt="Community members by the ocean" />
        </div>
      </section>

      {/* Footer Section */}
      {/* <footer className="blog-footer">
        <div className="footer-logo">
          <h1 className="logo">ab</h1>
          <p>All rights reserved.</p>
        </div>
        <div className="footer-social">
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-youtube"></i></a>
        </div>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Cookie Policy</a>
        </div>
      </footer> */}
    </div>
  );
};

export default BlogPost;

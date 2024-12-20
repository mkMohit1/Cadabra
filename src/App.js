import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import BlogPost from "./Pages/BlogPost";
import RentPage from "./Pages/RentPage";
import Navbar from "./components/Navbar";
import FooterPage from './components/FooterPage';
import "./App.scss";
import { Provider } from "react-redux";
import store from "./redux/store";
import ShoppingCart from "./Pages/ShoppingCart";
import LoginPage from "./Pages/LoginPage";

function App() {
  const [blogs, setBlogs] = useState(null);

  // Fetch blogs when the app loads
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("https://server-lmhc.onrender.com/blogs");
        const blogsData = await response.json();
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  if (!blogs || blogs.length === 0) {
    return <div>Loading...</div>; // Display loading text until blogs are fetched
  }

  return (
    <Router>
      {/* Router wraps the entire app */}
      <Provider store={store}>
        
      <AppWithRouter blogs={blogs}/>
      </Provider>
    </Router>
  );
}

function AppWithRouter({ blogs }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login"; 
  return (
    <>
      {!isLoginPage && <Navbar />}
      <Routes>
        {/* Login Rout */}
        <Route path="/login" element={<LoginPage/>}/>
        {/* HomePage route */}
        <Route path="/" element={<HomePage blogs={blogs} />} />

        {/* BlogPost route */}
        <Route path="/blog/:id" element={<BlogPost blogs={blogs} />} />

        {/* RentPage route */}
        <Route path="/Rent" element={<RentPage/>} />

        {/* Cart route */}
        <Route path="/Cart" element={<ShoppingCart/>} />
      </Routes>
      {!isLoginPage && <FooterPage />}
    </>
  );
}

export default App;

import React, { useState, useEffect, use } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate, redirect } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import BlogPost from "./Pages/BlogPost";
import RentPage from "./Pages/RentPage";
import Navbar from "./components/Navbar";
import FooterPage from "./components/FooterPage";
import "./App.scss";
import ShoppingCart from "./Pages/ShoppingCart";
import LoginPage from "./Pages/LoginPage";
import AdminDashboard from "./Pages/AdminDashboard";
import { useDispatch,useSelector } from "react-redux";
import { login } from "./redux/authSlice";
import { SingleProductPage } from "./components/SingleProductPage";
import About from "./Pages/AboutPage";
import PricingPage from "./Pages/PlanePage";
import ContactForm from "./Pages/ContactPage";
import List from "./components/Job/list";
import CreateJob from "./components/Job/CreateJob";
import JobsPortal from "./components/Job/JobsPortal";

function App() {
  const [blogs, setBlogs] = useState(null);
  const dispatch = useDispatch();
 const user = useSelector((state) => state.auth.user);
  
  // Fetching user data from localStorage and updating state
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log("Stored User:", storedUser); // Debugging line to check stored user
    if (storedUser) {
      dispatch(login(storedUser)); // Restore user state on refresh
    }
  }, [dispatch]);

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

  return (
    <Router>
      { <AppRoutes blogs={blogs} user={user} /> }
    </Router>
  );
}

function AppRoutes({ blogs, user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminPage = location.pathname === "/admin";
  if(location.pathname === "/About"){
    redirect("/myPage.html");
  }

  // Redirect user to admin dashboard or login page based on admin status
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userparam = urlParams.get("user");
    // if(userparam){
    //   localStorage.setItem("loggedInUser",JSON.stringify({userID: formData.userID, isAdmin: existingUser.type}))
    // }
    if (isAdminPage) {
      if (!user) {
        navigate("/admin-login");
      } else if (!["SupperAdmin", "SaleAdmin", "ProductAdmin"].includes(user.isAdmin)) {
        navigate("/admin-login");
      }
    }
  }, [user, isAdminPage, navigate]);

  // Redirect user after login based on their role
  useEffect(() => {
    if (user) {
      if (user.isAdmin && ["SupperAdmin", "SaleAdmin", "ProductAdmin",'SaleManager'].includes(user.isAdmin)) {
        navigate("/admin"); // Redirect admin users to admin dashboard
      } else if (location.pathname === "/login" || location.pathname === "/admin-login") {
        navigate("/"); // Redirect regular users to home page
      }
    }
  }, [user, location.pathname, navigate]);


  const showNavbarFooter = !["/login", "/admin", "/admin-login"].includes(location.pathname);

  return (
    <>
      {showNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<LoginPage />} />
        <Route path="/Rent" element={<RentPage />} />
        <Route path="/" element={<HomePage blogs={blogs} />} />
        <Route path="/blog/:id" element={<BlogPost blogs={blogs} />} />
        <Route path="/Cart" element={<ShoppingCart />} />
        <Route path="/products/:id" element ={<SingleProductPage/>}/>
        <Route path="/About" element={<About />} />
        <Route path="/Suscription" element={<PricingPage/>}/>
        <Route path="/Contact" element={<ContactForm/>}/>
          <Route path="/Job/list" element={<List />} /> {/* Job list for admin */}
          <Route path='/Job/createjob' element={<CreateJob/>} /> {/* Create job for admin*/}
          <Route path="/Job" element={<JobsPortal />} /> {/* Main Jobs Portal page */}
        <Route
          path="/admin"
          element={
            user && ["SupperAdmin", "SaleAdmin", "ProductAdmin",'SaleManager'].includes(user.isAdmin) ? (
              <AdminDashboard />
            ) : (
              <LoginPage />
            )
          }
        />
      </Routes>
      {showNavbarFooter && <FooterPage />}
    </>
  );
}

export default App;

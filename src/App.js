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
import { loginUser } from "./redux/authSlice";
import { updateCartItem } from "./redux/cartSlice";

function App() {
  const [blogs, setBlogs] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

   useEffect(()=>{
      // Load cart from localStorage
      const storedCart = localStorage.getItem("cart");
      console.log("storedCart", storedCart);
      // if (storedCart) {
      //   const cartItems = JSON.parse(storedCart);
      //   cartItems.forEach((item) => {
      //     dispatch(updateCartItem(item));
      //   });
      // }
    },[])

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser && !user) {
      dispatch(login(storedUser)); // Restore user state
    }
    if(!user){
      const storedCart = localStorage.getItem("cartNuser");
      if (storedCart) {
        const cartItems = JSON.parse(storedCart);
        cartItems.forEach((item) => {
          dispatch(updateCartItem(item));
        });
      }
    }
  }, [dispatch, user]);

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
  const dispatch = useDispatch();
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
      console.log("dsfhjdhfsdvhb",user);
      // dispatch(login(user));
      if (!user) {
        navigate("/admin-login");
      } else if (!["SuperAdmin", "SaleAdmin", "ProductAdmin"].includes(user.role)) {
        navigate("/admin-login");
      }
    }
  }, [user, isAdminPage, navigate]);

  // Redirect user after login based on their role
  useEffect(() => {
    if (user) {
      if (user.role && ["SuperAdmin", "SaleAdmin", "ProductAdmin",'SaleManager'].includes(user.role)) {
        console.log("mk admin");
        navigate("/admin"); // Redirect admin users to admin dashboard
      } else if (location.pathname === "/login" || location.pathname === "/Login" || location.pathname === "/admin-login") {
        navigate("/"); // Redirect regular users to home page
      }
    }
  }, [user, location.pathname, navigate, dispatch]);


  const showNavbarFooter = ![ "/admin", "/admin-login"].includes(location.pathname);

  return (
    <>
      {showNavbarFooter && <Navbar />}
      <Routes>
        <Route path={"/login" || "Login"} element={<LoginPage />} />
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
            user && ["SuperAdmin", "SaleAdmin", "ProductAdmin",'SaleManager'].includes(user.role) ? (
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

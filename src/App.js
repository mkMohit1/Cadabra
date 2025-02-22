import React, { useState, useEffect, use, Children } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate, redirect } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import BlogPost from "./Pages/BlogPost";
import RentPage from "./Pages/RentPage";
import Navbar from "./components/common/Navbar";
import FooterPage from "./components/common/FooterPage";
import "./App.scss";
import ShoppingCart from "./Pages/ShoppingCart";
import LoginPage from "./Pages/LoginPage";
import AdminDashboard from "./Pages/AdminDashboard";
import { useDispatch,useSelector } from "react-redux";
import { login } from "./redux/authSlice";
import { SingleProductPage } from "./components/Product/SingleProductPage";
import About from "./Pages/AboutPage";
import PricingPage from "./Pages/PlanePage";
import ContactForm from "./Pages/ContactPage";
import List from "./components/Job/list";
import CreateJob from "./components/Job/CreateJob";
import JobsPortal from "./components/Job/JobsPortal";
import { loginUser } from "./redux/authSlice";
import { updateCartItem } from "./redux/cartSlice";
import BlogForm from "./components/Blog/BlogForm";
import BlogsAdminPage from "./Pages/BlogsAdminPage";
import BookingConfirmation from "./components/Cart/BookingConfirmation";
import PrivacyPolicy from "./components/common/PrivacyPolicy";
import MyOrders from "./components/Cart/MyOrders";
import BlogPage from "./Pages/BlogsPage";
import { fetchProducts } from "./redux/rentProductSlice";

function App() {
  const [blogs, setBlogs] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(()=>{
    // Load cart from localStorage
    const storedCart = localStorage.getItem("cart");
    // console.log("storedCart", storedCart);
    // if (storedCart) {
    //   const cartItems = JSON.parse(storedCart);
    //   cartItems.forEach((item) => {
    //     dispatch(updateCartItem(item));
    //   });
    // }
  },[]);

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
        console.log(process.env.REACT_APP_BACK_URL);
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/blogs`);
        const blogsData = await response.json();
        setBlogs(blogsData);
      } catch (error) {
        console.log("Error fetching blogs:", error);
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
      if (user.role && ["SuperAdmin", "SaleAdmin", "ProductAdmin",'SaleManager','InstallerAdmin','Installer','GeneralAdmin'].includes(user.role)) {
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
        <Route path="/booking-confirmation/:orderId" element={<BookingConfirmation/>}/>
        <Route path="/products/:id" element ={<SingleProductPage/>}/>
        <Route path="/About" element={<About />} />
        <Route path="/Pricing" element={<PricingPage/>}/>
        <Route path="policy" element={<PrivacyPolicy/>}/>
        <Route path="/Contact" element={<ContactForm/>}/>
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/blogs" element={<BlogPage blogs={blogs}/>}/>
          <Route path="/Job/list" element={<List />} /> {/* Job list for admin */}
          <Route path='/Job/createjob' element={<CreateJob/>} /> {/* Create job for admin*/}
          <Route path="/Job" element={<JobsPortal />} /> {/* Main Jobs Portal page */}
        <Route
          path="/admin"
          element={
            user && ["SuperAdmin", "SaleAdmin", "ProductAdmin",'SaleManager','InstallerAdmin','Installer','GeneralAdmin'].includes(user.role) ? (
              <AdminDashboard />
            ) : (
              <LoginPage />
            )
          }
          // children={[
          //   ...(user && ["SuperAdmin", "SaleAdmin", "ProductAdmin", "SaleManager"].includes(user.role)
          //     ? [{ path: "blogs", element: <BlogsAdminPage /> },

          //     ]
          //     : []
          //   )
          // ]}          
        />
      </Routes>
      {showNavbarFooter && <FooterPage />}
    </>
  );
}

export default App;

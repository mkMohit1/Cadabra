import React, { useEffect, useState } from "react";
import { Menu, User, Maximize, ChevronDown, LogOut } from "lucide-react";
import "../styles/AdminDashboard.Module.scss";
import { useSelector, useDispatch } from "react-redux";
import Dashboard from "../components/Admin/Dashboard";
import AdminPage from "../components/Admin/AdminPage";
import { logout } from "../redux/authSlice";
import SaleAdmin from "../components/Admin/SaleAdmin";
import CustomerManagement from "../components/Admin/CustomerManagement";
import ProductPage from "./ProductPage";
import { io } from "socket.io-client";
import FaqsPage from "./FaqsPage";
import BlogsAdminPage from "./BlogsAdminPage";
import BookedOrders from "../components/Admin/BookOrder";

const socket= io(process.env.REACT_APP_BACK_URL);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [currentContainer, setCurrentContainer] = useState("Dashboard");
  

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const toggleProfile = () => setProfileOpen(!isProfileOpen);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleAdminContainer = (content) => {
    if (content) {
      setCurrentContainer(content);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/admin-login";

  };
  useEffect(()=>{
    if(currentUser.isAdmin =='SupperAdmin'){
      // Notify backend that SuperAdmin is logged in
      socket.emit('supperAdminLogin');
      socket.on('newContactNotification',(notification)=>{
        alert(notification.message);
        console.log('Contact Data', notification.data);
      });
      return ()=>{
        socket.disconnect();
      }
    }
  },[]);
  
  return (
    <div className="dashboard">
      <aside className={`sidebar ${!isSidebarOpen ? "collapsed" : ""}`}>
        <div className="logo">
          <h1>Cadabra</h1>
        </div>

        <nav className="nav-menu">
          {[
            { icon: "📊", text: "Dashboard" },
            currentUser.role === "SuperAdmin" && { icon: "👥", text: "Admins" },
            currentUser.role === "SaleAdmin" && { icon: "👔", text: "Sales Manager" },
            currentUser.role ==='InstallerAdmin' && { icon: "👔", text: "Installer" },
            currentUser.role === "ProductAdmin" && { icon: "📦", text: "Product" },
          (currentUser.role === "InstallerAdmin" ||currentUser.role === "SaleAdmin" ||currentUser.role === "Installer") && { icon: "📦", text: "Orders" },
            currentUser.role === "SaleManager" && { icon: "🙍‍♂️", text: "Customer" },            
            currentUser.role === "SuperAdmin" && { icon: "👥", text: "FAQS" },
            currentUser.role === "SuperAdmin" && { icon: "👥", text: "Blogs" },
          ]
            .filter(Boolean)  // Filter out falsy values
            .map(({ icon, text }) => (
              <div
                className="nav-item"
                key={text}
                onClick={() => handleAdminContainer(text)}
              >
                <span className="nav-icon">{icon}</span>
                <span className="nav-text">{text}</span>
              </div>
            ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <button
            className="menu-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <Menu size={24} />
          </button>

          <div className="header-actions">
            <button
              className="fullscreen-toggle"
              onClick={toggleFullScreen}
              aria-label="Toggle Fullscreen"
            >
              <Maximize size={24} />
            </button>

            <div className="profile-dropdown">
              <button
                className="profile-toggle"
                onClick={toggleProfile}
                aria-label="Toggle Profile Menu"
              >
                <User size={24} />
                <ChevronDown size={16} />
              </button>

              {isProfileOpen && (
                <div className="dropdown-menu">
                  <div className="user-info">
                    <div className="user-name">{currentUser.role}</div>
                    <div className="user-email">{currentUser.email}</div>
                  </div>
                  <button className="logout-button" aria-label="Logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {currentContainer === "Dashboard" && <Dashboard />}
          {currentContainer === "Admins" && currentUser.role === "SuperAdmin" && <AdminPage />}
          {currentContainer === "Sales Manager" && currentUser.role === "SaleAdmin" && <SaleAdmin />}
          {currentContainer === "Installer" && currentUser.role === "InstallerAdmin" && <SaleAdmin />}
          {currentContainer=== 'Customer' && <CustomerManagement />}
          {currentContainer === 'Product' && <ProductPage/>}
          {currentContainer ==='FAQS' && <FaqsPage/>}
          {currentContainer ==='Blogs' && <BlogsAdminPage/>}
          {currentContainer ==='Orders' && <BookedOrders/>}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect, useState } from "react";
import { Menu, User, Maximize, ChevronDown, LogOut } from "lucide-react";
import "../styles/AdminDashboard.Module.scss";
import { useSelector, useDispatch } from "react-redux";
import Dashboard from "../components/Dashboard";
import AdminPage from "../components/AdminPage";
import { logout } from "../redux/authSlice";
import SaleAdmin from "../components/SaleAdmin";
import CustomerManagement from "../components/CustomerManagement";
import ProductPage from "./ProductPage";
import { io } from "socket.io-client";

const socket= io('http://localhost:5000');

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
      socket.emit('superAdminLogin');
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
            currentUser.isAdmin === "SupperAdmin" && { icon: "👥", text: "Admins" },
            currentUser.isAdmin === "SaleAdmin" && { icon: "👔", text: "Sales Manager" },
            currentUser.isAdmin === "ProductAdmin" && { icon: "📦", text: "Product" },
            currentUser.isAdmin === "SaleManager" && { icon: "🙍‍♂️", text: "Customer" },
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
                    <div className="user-name">{currentUser.isAdmin}</div>
                    <div className="user-email">example@gmail.com</div>
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
          {currentContainer === "Admins" && currentUser.isAdmin === "SupperAdmin" && <AdminPage />}
          {currentContainer === "Sales Manager" && currentUser.isAdmin === "SaleAdmin" && <SaleAdmin />}
          {currentContainer=== 'Customer' && <CustomerManagement />}
          {currentContainer === 'Product' && <ProductPage/>}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

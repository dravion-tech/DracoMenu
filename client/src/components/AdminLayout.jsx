import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  Palette,
  ClipboardList,
  LogOut,
  Menu as MenuIcon,
  X,
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  const menuItems = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      to: "/dashboard/menu",
      icon: <Utensils size={20} />,
      label: "Menu Editor",
    },
    {
      to: "/dashboard/orders",
      icon: <ClipboardList size={20} />,
      label: "Orders",
    },
    {
      to: "/dashboard/branding",
      icon: <Palette size={20} />,
      label: "Branding",
    },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar Overlay for Mobile */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "var(--primary)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            }}
          >
            <MenuIcon size={20} />
          </div>
          <span
            style={{
              fontWeight: "800",
              fontSize: "1.35rem",
              letterSpacing: "-0.5px",
            }}
          >
            DracoMenu
          </span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div
            style={{
              padding: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
              backgroundColor: "var(--bg-main)",
              borderRadius: "var(--radius)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "var(--primary)",
                color: "white",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "1.1rem",
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.name}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Admin Account
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-item"
            style={{
              width: "100%",
              color: "#ef4444",
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Nav Toggle */}
      <button
        className="mobile-nav-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Main Content */}
      <main className="main-content" style={{ flex: 1, overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

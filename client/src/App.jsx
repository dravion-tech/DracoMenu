import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./components/AdminLayout";
import DashboardHome from "./pages/DashboardHome";
import MenuEditor from "./pages/MenuEditor";
import Orders from "./pages/Orders";
import Branding from "./pages/Branding";
import PublicMenu from "./pages/PublicMenu";
import SuperDashboard from "./pages/SuperDashboard";
import PrintQRs from "./pages/PrintQRs";
import StaffOrders from "./pages/StaffOrders";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  // If user is pending and not super_admin, they shouldn't be here
  if (user && user.role !== "super_admin" && user.status !== "active") {
    return <Navigate to="/admin-login" />;
  }

  return user ? children : <Navigate to="/admin-login" />;
};

const SuperRoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.role === "super_admin" ? (
    children
  ) : (
    <Navigate to="/admin-login" />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/admin-login" element={<Login />} />
          <Route path="/admin-setup" element={<Register />} />
          <Route path="/menu/:restaurantId" element={<PublicMenu />} />
          <Route path="/staff/:restaurantId" element={<StaffOrders />} />

          {/* Admin Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <DashboardHome />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/print-qrs"
            element={
              <PrivateRoute>
                <PrintQRs />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/menu"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <MenuEditor />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/orders"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <Orders />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/branding"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <Branding />
                </AdminLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/super-dashboard"
            element={
              <SuperRoute>
                <SuperDashboard />
              </SuperRoute>
            }
          />

          <Route path="/" element={<Navigate to="/admin-login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

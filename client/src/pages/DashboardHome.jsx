import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
  QrCode,
  TrendingUp,
  Users,
  ShoppingBag,
  Download,
  Printer,
} from "lucide-react";
import { Link } from "react-router-dom";

// For mobile testing, we use the local network IP.
// For mobile testing, we use the local network IP.
const DEV_BASE_URL = window.location.origin;

const DashboardHome = () => {
  const { restaurantId } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [tableCount, setTableCount] = useState(0);
  const [savingTables, setSavingTables] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    activeOrders: 0,
    totalItems: 0,
    recentOrders: [],
  });

  useEffect(() => {
    fetchData();
    fetchStats();

    // Set up real-time polling every 10 seconds
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/restaurant/profile");
      setRestaurant(res.data);
      if (res.data.qrCode) setQrCode(res.data.qrCode);
      setTableCount(res.data.tableCount || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/restaurant/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const generateQR = async () => {
    try {
      const res = await api.post("/restaurant/qr", {
        baseUrl: DEV_BASE_URL,
      });
      setQrCode(res.data.qrCode);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTableCount = async () => {
    setSavingTables(true);
    try {
      const res = await api.put("/restaurant/profile", {
        tableCount: parseInt(tableCount),
      });
      setRestaurant(res.data);
      alert("Table count saved successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setSavingTables(false);
    }
  };

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `menu-qr-${restaurant?.name}.png`;
    link.click();
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          Dashboard Overview
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Welcome back to <strong>{restaurant?.name || "DracoMenu"}</strong>.
          Your kitchen is live.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2.5rem",
        }}
      >
        <div
          className="card"
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
          <div
            style={{
              backgroundColor: "#ecfdf5",
              color: "#10b981",
              padding: "0.75rem",
              borderRadius: "12px",
            }}
          >
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Total Sales
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>
              ₹{stats.totalSales.toFixed(2)}
            </div>
          </div>
        </div>
        <div
          className="card"
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
          <div
            style={{
              backgroundColor: "#eff6ff",
              color: "#3b82f6",
              padding: "0.75rem",
              borderRadius: "12px",
            }}
          >
            <ShoppingBag size={24} />
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Active Orders
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>
              {stats.activeOrders}
            </div>
          </div>
        </div>
        <div
          className="card"
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
          <div
            style={{
              backgroundColor: "#fef3c7",
              color: "#f59e0b",
              padding: "0.75rem",
              borderRadius: "12px",
            }}
          >
            <Users size={24} />
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Menu Items
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>
              {stats.totalItems}
            </div>
          </div>
        </div>
      </div>

      <div
        className="dashboard-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        <div className="card">
          <h2 style={{ marginBottom: "1.5rem" }}>Recent Activity</h2>
          {stats.recentOrders.length > 0 ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {stats.recentOrders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "0.75rem",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>
                      {order.customerName}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {formatDate(order.orderDate)} • Table{" "}
                      {order.tableNumber || "N/A"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "700", color: "var(--primary)" }}>
                      ₹{order.totalAmount.toFixed(2)}
                    </div>
                    <div
                      style={{
                        fontSize: "0.65rem",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        color:
                          order.status === "completed" ? "#10b981" : "#f59e0b",
                      }}
                    >
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
              <Link
                to="/dashboard/orders"
                style={{
                  textAlign: "center",
                  fontSize: "0.875rem",
                  color: "var(--primary)",
                  marginTop: "0.5rem",
                  fontWeight: "600",
                }}
              >
                View All Orders
              </Link>
            </div>
          ) : (
            <div
              style={{
                color: "var(--text-muted)",
                textAlign: "center",
                padding: "2rem",
              }}
            >
              No recent activity to show. Start by adding items to your menu!
            </div>
          )}
        </div>

        <div className="card" style={{ textAlign: "center" }}>
          <QrCode
            size={40}
            style={{ color: "var(--primary)", marginBottom: "1rem" }}
          />
          <h3>Menu QR Code</h3>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              margin: "0.5rem 0 1.5rem",
            }}
          >
            Customers can scan this to view your digital menu and place orders.
          </p>

          {qrCode ? (
            <div style={{ marginBottom: "1.5rem" }}>
              <img
                src={qrCode}
                alt="Menu QR"
                style={{
                  width: "180px",
                  height: "180px",
                  border: "8px solid white",
                  borderRadius: "12px",
                  boxShadow: "0 0 0 1px #e2e8f0",
                }}
              />
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "center",
                }}
              >
                <button onClick={downloadQR} className="btn btn-secondary">
                  <Download size={18} /> Download
                </button>
                <button
                  onClick={generateQR}
                  className="btn btn-secondary"
                  style={{
                    border: "1px solid var(--primary)",
                    color: "var(--primary)",
                  }}
                >
                  <QrCode size={18} /> Regenerate
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={generateQR}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Generate QR Code
            </button>
          )}
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <Printer
            size={40}
            style={{ color: "var(--primary)", marginBottom: "1rem" }}
          />
          <h3>Table Management</h3>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              margin: "0.5rem 0 1.5rem",
            }}
          >
            Specify how many tables you have. You can generate distinct QR codes
            for each.
          </p>

          <div className="input-group" style={{ textAlign: "left" }}>
            <label className="input-label">Number of Tables</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="number"
                className="input-field"
                value={tableCount}
                onChange={(e) => setTableCount(e.target.value)}
                min="0"
                max="100"
              />
              <button
                onClick={handleSaveTableCount}
                className="btn btn-primary"
                disabled={savingTables}
              >
                {savingTables ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          {restaurant?.tableCount > 0 && (
            <Link
              to="/print-qrs"
              className="btn btn-secondary"
              style={{
                width: "100%",
                marginTop: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <Printer size={18} /> Print Table QRs
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

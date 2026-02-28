import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import {
  Clock,
  CheckCircle,
  Package,
  Phone,
  User,
  Hash,
  RefreshCcw,
} from "lucide-react";

/**
 * StaffOrders Component
 * This is a mobile-optimized public page for restaurant staff to manage orders.
 * Access is meant to be via a specific Staff QR code.
 */
const StaffOrders = () => {
  const { restaurantId } = useParams();
  const [orders, setOrders] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // "active" or "history"

  useEffect(() => {
    fetchRestaurant();
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Polling every 5s for better real-time feel
    return () => clearInterval(interval);
  }, [restaurantId, activeTab]);

  const fetchRestaurant = async () => {
    try {
      const res = await api.get(`/public/${restaurantId}`);
      setRestaurant(res.data.restaurant);
    } catch (err) {
      console.error("Error fetching restaurant:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const statusParam = activeTab === "history" ? "completed" : "";
      const res = await api.get(
        `/public/staff/orders/${restaurantId}${statusParam ? `?status=${statusParam}` : ""}`,
      );
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching staff orders:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/public/staff/orders/${id}/status`, { status });
      // Instant update for better UX
      setOrders((prev) => {
        if (activeTab === "active") {
          return status === "completed"
            ? prev.filter((o) => o._id !== id)
            : prev.map((o) => (o._id === id ? { ...o, status } : o));
        } else {
          // If in history and moving back to active
          return status !== "completed"
            ? prev.filter((o) => o._id !== id)
            : prev.map((o) => (o._id === id ? { ...o, status } : o));
        }
      });
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f59e0b"; // Orange
      case "preparing":
        return "#3b82f6"; // Blue
      case "completed":
        return "#10b981"; // Green
      default:
        return "#64748b"; // Slate
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f8fafc",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <RefreshCcw
            className="animate-spin"
            size={32}
            style={{ color: "#3b82f6", margin: "0 auto 1rem" }}
          />
          <p style={{ color: "#64748b" }}>Loading Staff Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        padding: "1rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "white",
          padding: "1.25rem",
          borderRadius: "16px",
          marginBottom: "1rem",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.25rem",
              fontWeight: "800",
              color: "#1e293b",
              margin: 0,
            }}
          >
            {restaurant?.name || "Restaurant"} Staff
          </h1>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>
            {activeTab === "active" ? "Active Orders" : "Order History"}
          </p>
        </div>
        <button
          onClick={fetchOrders}
          style={{
            padding: "0.5rem",
            backgroundColor: "#f1f5f9",
            border: "none",
            borderRadius: "8px",
            color: "#64748b",
          }}
        >
          <RefreshCcw size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          backgroundColor: "white",
          padding: "0.4rem",
          borderRadius: "12px",
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        }}
      >
        <button
          onClick={() => setActiveTab("active")}
          style={{
            padding: "0.75rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: activeTab === "active" ? "#3b82f6" : "transparent",
            color: activeTab === "active" ? "white" : "#64748b",
            fontWeight: "700",
            fontSize: "0.875rem",
            transition: "all 0.2s",
          }}
        >
          Active
        </button>
        <button
          onClick={() => setActiveTab("history")}
          style={{
            padding: "0.75rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor:
              activeTab === "history" ? "#3b82f6" : "transparent",
            color: activeTab === "history" ? "white" : "#64748b",
            fontWeight: "700",
            fontSize: "0.875rem",
            transition: "all 0.2s",
          }}
        >
          History
        </button>
      </div>

      {/* Orders List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {orders.length === 0 ? (
          <div
            style={{
              backgroundColor: "white",
              padding: "3rem 1.5rem",
              borderRadius: "16px",
              textAlign: "center",
              boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
            }}
          >
            <Package
              size={48}
              style={{ color: "#cbd5e1", margin: "0 auto 1rem" }}
            />
            <h3 style={{ color: "#475569", margin: "0 0 0.5rem" }}>
              {activeTab === "active" ? "No Active Orders" : "No Past Orders"}
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
              {activeTab === "active"
                ? "All caught up! New orders will appear here."
                : "Completed orders will show up here."}
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "1rem",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                borderLeft: `6px solid ${getStatusColor(order.status)}`,
                position: "relative",
                opacity: order.status === "preparing" ? 0.95 : 1,
              }}
            >
              {/* Preparing Badge for Race Condition Visibility */}
              {order.status === "preparing" && (
                <div
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "10px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    fontSize: "0.6rem",
                    fontWeight: "900",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
                  }}
                >
                  BEING HANDLED
                </div>
              )}

              {/* Order Metadata */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "700",
                    color: "#94a3b8",
                  }}
                >
                  #{order._id.slice(-5).toUpperCase()}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "700",
                    color: getStatusColor(order.status),
                    textTransform: "uppercase",
                  }}
                >
                  {order.status}
                </span>
              </div>

              {/* Customer & Table */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "#eff6ff",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    fontWeight: "800",
                    color: "#3b82f6",
                  }}
                >
                  {order.tableNumber || "?"}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: "700",
                      color: "#1e293b",
                      fontSize: "1rem",
                    }}
                  >
                    {order.customerName}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <Phone size={12} /> {order.customerPhone}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: "12px",
                  padding: "0.75rem",
                  marginBottom: "1rem",
                }}
              >
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.875rem",
                      marginBottom:
                        idx === order.items.length - 1 ? 0 : "0.5rem",
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>
                      {item.quantity}x {item.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                }}
              >
                {activeTab === "active" ? (
                  <>
                    <button
                      onClick={() =>
                        updateStatus(
                          order._id,
                          order.status === "preparing"
                            ? "pending"
                            : "preparing",
                        )
                      }
                      style={{
                        padding: "0.75rem",
                        borderRadius: "12px",
                        border:
                          order.status === "preparing"
                            ? "1px solid #3b82f6"
                            : "none",
                        backgroundColor:
                          order.status === "preparing" ? "white" : "#f1f5f9",
                        color: "#3b82f6",
                        fontWeight: "700",
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        transition: "all 0.2s",
                      }}
                    >
                      {order.status === "preparing" ? (
                        "Revert to Pending"
                      ) : (
                        <>
                          <Clock size={16} /> Mark Preparing
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => updateStatus(order._id, "completed")}
                      style={{
                        padding: "0.75rem",
                        borderRadius: "12px",
                        border: "none",
                        backgroundColor: "#10b981",
                        color: "white",
                        fontWeight: "700",
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        transition: "all 0.2s",
                      }}
                    >
                      <CheckCircle size={16} /> Complete
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => updateStatus(order._id, "pending")}
                    style={{
                      gridColumn: "span 2",
                      padding: "0.75rem",
                      borderRadius: "12px",
                      border: "1px solid #64748b",
                      backgroundColor: "white",
                      color: "#64748b",
                      fontWeight: "700",
                      fontSize: "0.875rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    Restore to Active
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Manual Refresh Hint */}
      <div
        style={{
          textAlign: "center",
          marginTop: "2rem",
          paddingBottom: "2rem",
          color: "#94a3b8",
          fontSize: "0.75rem",
        }}
      >
        Auto-refreshes every 5 seconds
      </div>

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default StaffOrders;

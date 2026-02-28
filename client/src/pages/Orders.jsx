import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Clock, CheckCircle, Package, Phone, User, Hash } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f59e0b";
      case "preparing":
        return "#3b82f6";
      case "completed":
        return "#10b981";
      default:
        return "#64748b";
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          Orders Dashboard
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Manage incoming orders and update their status.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {orders.length === 0 ? (
          <div
            className="card"
            style={{ textAlign: "center", padding: "4rem" }}
          >
            <Package
              size={48}
              style={{ color: "var(--text-muted)", margin: "0 auto 1.5rem" }}
            />
            <h3>No Orders Yet</h3>
            <p style={{ color: "var(--text-muted)" }}>
              Your incoming orders will appear here.
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="card"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "2rem",
                alignItems: "start",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      color: "var(--text-muted)",
                    }}
                  >
                    ORDER #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <span
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      backgroundColor: `${getStatusColor(order.status)}20`,
                      color: getStatusColor(order.status),
                      textTransform: "capitalize",
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <User size={16} style={{ color: "var(--text-muted)" }} />
                  <span style={{ fontWeight: "600" }}>
                    {order.customerName}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Phone size={16} style={{ color: "var(--text-muted)" }} />
                  <span style={{ fontSize: "0.875rem" }}>
                    {order.customerPhone}
                  </span>
                </div>
                {order.tableNumber && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Hash size={16} style={{ color: "var(--text-muted)" }} />
                    <span style={{ fontSize: "0.875rem" }}>
                      Table {order.tableNumber}
                    </span>
                  </div>
                )}
              </div>

              <div
                className="border-x-responsive"
                style={{
                  borderLeft: "1px solid var(--border)",
                  borderRight: "1px solid var(--border)",
                  padding: "0 2rem",
                }}
              >
                <h4
                  style={{
                    marginBottom: "1rem",
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                  }}
                >
                  ORDER ITEMS
                </h4>
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                ))}
                <div
                  style={{
                    borderTop: "1px solid var(--border)",
                    marginTop: "1rem",
                    paddingTop: "0.75rem",
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "700",
                  }}
                >
                  <span>Total</span>
                  <span style={{ color: "var(--primary)" }}>
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <h4
                  style={{
                    marginBottom: "0.25rem",
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                  }}
                >
                  UPDATE STATUS
                </h4>
                <button
                  onClick={() => updateStatus(order._id, "preparing")}
                  className={`btn ${order.status === "preparing" ? "btn-primary" : "btn-secondary"}`}
                  style={{ fontSize: "0.875rem" }}
                >
                  <Clock size={16} /> Preparing
                </button>
                <button
                  onClick={() => updateStatus(order._id, "completed")}
                  className={`btn ${order.status === "completed" ? "btn-primary" : "btn-secondary"}`}
                  style={{ fontSize: "0.875rem" }}
                >
                  <CheckCircle size={16} /> Completed
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;

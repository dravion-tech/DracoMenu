import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Store,
  CheckCircle,
  XCircle,
  LogOut,
  ShieldCheck,
  Search,
  AlertCircle,
} from "lucide-react";

const SuperDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/super-admin/users");
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      await api.put(`/super-admin/users/${userId}/status`, {
        status: newStatus,
      });
      fetchUsers(); // Refresh list
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.restaurant?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading management console...
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
      {/* Top Header */}
      <header
        style={{
          backgroundColor: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
              padding: "0.5rem",
              borderRadius: "8px",
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "800" }}>
            Super Admin
          </h2>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-secondary"
          style={{ color: "#ef4444" }}
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      <main
        className="main-content"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            Platform Management
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Approve new restaurant owners and manage existing accounts.
          </p>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <div className="card">
            <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Total Owners
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: "700" }}>
              {users.length}
            </div>
          </div>
          <div className="card">
            <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Pending Approval
            </div>
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "#f59e0b",
              }}
            >
              {users.filter((u) => u.status === "pending").length}
            </div>
          </div>
          <div className="card">
            <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Active Partners
            </div>
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "#10b981",
              }}
            >
              {users.filter((u) => u.status === "active").length}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: "280px" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              className="input-field"
              placeholder="Search owners or restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "2.75rem", width: "100%" }}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "var(--bg-main)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <th style={{ padding: "1rem 1.5rem" }}>Owner & Restaurant</th>
                <th style={{ padding: "1rem 1.5rem" }}>Email</th>
                <th style={{ padding: "1rem 1.5rem" }}>Status</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: "var(--text-muted)",
                    }}
                  >
                    No owners found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u._id}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div style={{ fontWeight: "600" }}>{u.name}</div>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--text-muted)",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <Store size={14} />{" "}
                        {u.restaurant?.name || "No Restaurant"}
                      </div>
                    </td>
                    <td
                      style={{ padding: "1rem 1.5rem", fontSize: "0.875rem" }}
                    >
                      {u.email}
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.6rem",
                          borderRadius: "20px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          backgroundColor:
                            u.status === "active"
                              ? "#dcfce7"
                              : u.status === "suspended"
                                ? "#fee2e2"
                                : "#fef3c7",
                          color:
                            u.status === "active"
                              ? "#16a34a"
                              : u.status === "suspended"
                                ? "#dc2626"
                                : "#b45309",
                          textTransform: "capitalize",
                        }}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          justifyContent: "flex-end",
                        }}
                      >
                        {u.status !== "active" && (
                          <button
                            onClick={() => handleStatusUpdate(u._id, "active")}
                            className="btn btn-primary"
                            style={{
                              padding: "0.4rem 0.8rem",
                              fontSize: "0.75rem",
                            }}
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                        )}
                        {u.status === "active" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(u._id, "suspended")
                            }
                            className="btn btn-secondary"
                            style={{
                              padding: "0.4rem 0.8rem",
                              fontSize: "0.75rem",
                              color: "#ef4444",
                            }}
                          >
                            <XCircle size={14} /> Suspend
                          </button>
                        )}
                        {u.status === "suspended" && (
                          <button
                            onClick={() => handleStatusUpdate(u._id, "active")}
                            className="btn btn-secondary"
                            style={{
                              padding: "0.4rem 0.8rem",
                              fontSize: "0.75rem",
                              color: "var(--primary)",
                            }}
                          >
                            Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Guide */}
        <div
          style={{
            marginTop: "2rem",
            backgroundColor: "#eff6ff",
            padding: "1rem",
            borderRadius: "12px",
            display: "flex",
            gap: "0.75rem",
            border: "1px solid #dbeafe",
          }}
        >
          <AlertCircle size={20} style={{ color: "#3b82f6", flexShrink: 0 }} />
          <div style={{ fontSize: "0.875rem", color: "#1e40af" }}>
            <strong>Administrator Tip:</strong> Restaurant owners can only
            access their dashboard once their status is <strong>Active</strong>.
            You can suspend any account at any time to immediately revoke their
            access.
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperDashboard;

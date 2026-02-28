import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Printer, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrintQRs = () => {
  const { restaurantId } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Use current origin for deployment readiness
  const FRONTEND_URL = window.location.origin;
  const STAFF_BASE_URL = FRONTEND_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/restaurant/profile");
        setRestaurant(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading)
    return <div style={{ padding: "2rem" }}>Loading QR codes...</div>;

  const tableCount = restaurant?.tableCount || 0;
  const tables = Array.from({ length: tableCount }, (_, i) => i + 1);

  return (
    <div
      style={{ padding: "2rem", backgroundColor: "#fff", minHeight: "100vh" }}
    >
      {/* Controls - Hidden during print */}
      <div
        className="no-print"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          padding: "1rem",
          backgroundColor: "#f8fafc",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-secondary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ margin: 0 }}>Print Table QR Codes</h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.875rem" }}>
            {tableCount} tables found. Use Ctrl+P to print or save as PDF.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Printer size={18} /> Print Now
        </button>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          @page { margin: 1cm; }
        }
        .qr-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }
        .qr-card {
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: white;
          page-break-inside: avoid;
        }
      `}</style>

      <div className="qr-grid">
        {/* Staff QR Code - NEW */}
        {restaurant && (
          <div
            className="qr-card"
            style={{ border: "2px dashed var(--primary, #3b82f6)" }}
          >
            <div
              style={{
                backgroundColor: "#eff6ff",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "800",
                  color: "#3b82f6",
                }}
              >
                STAFF ONLY
              </span>
            </div>
            <div
              style={{
                fontWeight: "700",
                fontSize: "1.25rem",
                marginBottom: "0.5rem",
              }}
            >
              {restaurant.name}
            </div>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "1rem",
                borderRadius: "12px",
                border: "1px solid #f1f5f9",
                marginBottom: "1rem",
              }}
            >
              <QRCodeSVG
                value={`${STAFF_BASE_URL}/staff/${restaurant._id}`}
                size={150}
              />
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "800",
                color: "#1e293b",
              }}
            >
              ORDER PANEL
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#94a3b8",
                marginTop: "0.5rem",
              }}
            >
              Scan to Manage Orders
            </div>
          </div>
        )}

        {tables.map((num) => {
          const menuUrl = `${FRONTEND_URL}/menu/${restaurant._id}?table=${num}`;
          return (
            <div key={num} className="qr-card">
              {restaurant.logo && (
                <img
                  src={restaurant.logo}
                  alt="Logo"
                  style={{
                    height: "40px",
                    marginBottom: "1rem",
                    objectFit: "contain",
                  }}
                />
              )}
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "1.25rem",
                  marginBottom: "0.5rem",
                }}
              >
                {restaurant.name}
              </div>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "1rem",
                  borderRadius: "12px",
                  border: "1px solid #f1f5f9",
                  marginBottom: "1rem",
                }}
              >
                <QRCodeSVG value={menuUrl} size={150} />
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  color: "var(--primary, #3b82f6)",
                }}
              >
                TABLE {num}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#94a3b8",
                  marginTop: "0.5rem",
                }}
              >
                Scan to Order
              </div>
            </div>
          );
        })}
      </div>

      {tableCount === 0 && (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <h3>No tables configured.</h3>
          <p>Please go back to the dashboard and set the number of tables.</p>
        </div>
      )}
    </div>
  );
};

export default PrintQRs;

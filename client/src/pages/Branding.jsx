import React, { useState, useEffect } from "react";
import api from "../api/axios";
import {
  Palette,
  Type,
  Check,
  Layout,
  Moon,
  Sun,
  Smartphone,
  Image as ImageIcon,
  Upload,
} from "lucide-react";

const Branding = () => {
  const [restaurant, setRestaurant] = useState({
    theme: "modern",
    primaryColor: "#3b82f6",
    fontFamily: "Inter",
    name: "",
    logo: "",
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (restaurant.fontFamily) {
      const fontUrl = restaurant.fontFamily.replace(/\s+/g, "+");
      const link = document.createElement("link");
      link.id = "preview-font";
      link.href = `https://fonts.googleapis.com/css2?family=${fontUrl}:wght@400;500;600;700;800&display=swap`;
      link.rel = "stylesheet";

      const existingLink = document.getElementById("preview-font");
      if (existingLink) document.head.removeChild(existingLink);

      document.head.appendChild(link);
      return () => {
        const currentLink = document.getElementById("preview-font");
        if (currentLink) document.head.removeChild(currentLink);
      };
    }
  }, [restaurant.fontFamily]);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/restaurant/profile");
      setRestaurant(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (updates) => {
    const updated = { ...restaurant, ...updates };
    setRestaurant(updated);
    try {
      await api.put("/restaurant/profile", updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Max 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("logo", file);

    setUploading(true);
    try {
      const res = await api.post("/restaurant/logo/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRestaurant(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to upload logo.");
    } finally {
      setUploading(false);
    }
  };

  const themes = [
    {
      id: "modern",
      name: "Modern",
      icon: <Sun size={20} />,
      desc: "Clean and vibrant design",
    },
    {
      id: "dark",
      name: "Dark",
      icon: <Moon size={20} />,
      desc: "Sleek dark mode interface",
    },
    {
      id: "minimal",
      name: "Minimal",
      icon: <Smartphone size={20} />,
      desc: "Simple serif typography",
    },
  ];

  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#0f172a",
  ];

  const fonts = [
    { id: "Inter", name: "Modern Sans (Inter)", type: "Sans-serif" },
    { id: "Roboto", name: "Clean (Roboto)", type: "Sans-serif" },
    {
      id: "Playfair Display",
      name: "Elegant (Playfair Display)",
      type: "Serif",
    },
    { id: "Outfit", name: "Geometric (Outfit)", type: "Sans-serif" },
    { id: "Poppins", name: "Friendly (Poppins)", type: "Sans-serif" },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: "800px" }}>
      <div
        style={{
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            Branding & Style
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Customize how your menu looks for customers.
          </p>
        </div>
        {saved && (
          <div
            style={{
              backgroundColor: "#ecfdf5",
              color: "#10b981",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius)",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Check size={16} /> Saved
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <section className="card">
          <h3
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <ImageIcon size={20} /> Restaurant Logo
          </h3>
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              alignItems: "start",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "120px",
                height: "120px",
                backgroundColor: "#f1f5f9",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "1px solid var(--border)",
              }}
            >
              {restaurant.logo ? (
                <img
                  src={restaurant.logo}
                  alt="Logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <ImageIcon size={40} style={{ color: "#cbd5e1" }} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label className="input-label">Logo Image</label>
              <div style={{ display: "flex", gap: "1rem" }}>
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("logo-upload").click()}
                  className="btn btn-secondary"
                  disabled={uploading}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Upload size={18} />
                  {uploading ? "Uploading..." : "Choose Image"}
                </button>
                {restaurant.logo && (
                  <button
                    className="btn btn-secondary"
                    style={{ color: "#ef4444" }}
                    onClick={() => handleUpdate({ logo: "" })}
                  >
                    Remove
                  </button>
                )}
              </div>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  marginTop: "0.5rem",
                }}
              >
                Recommended: Square image, PNG or JPG. Max 5MB.
              </p>
            </div>
          </div>
        </section>

        <section className="card">
          <h3
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <Layout size={20} /> Choose Theme
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {themes.map((t) => (
              <div
                key={t.id}
                className={`card ${restaurant.theme === t.id ? "active" : ""}`}
                onClick={() => handleUpdate({ theme: t.id })}
                style={{
                  cursor: "pointer",
                  border:
                    restaurant.theme === t.id
                      ? `2px solid var(--primary)`
                      : "1px solid var(--border)",
                  padding: "1.25rem",
                }}
              >
                <div
                  style={{
                    color:
                      restaurant.theme === t.id
                        ? "var(--primary)"
                        : "var(--text-muted)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {t.icon}
                </div>
                <div style={{ fontWeight: "600" }}>{t.name}</div>
                <div
                  style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                >
                  {t.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h3
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <Palette size={20} /> Primary Color
          </h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {colors.map((c) => (
              <div
                key={c}
                onClick={() => handleUpdate({ primaryColor: c })}
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: c,
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border:
                    restaurant.primaryColor === c ? "3px solid white" : "none",
                  boxShadow:
                    restaurant.primaryColor === c
                      ? "0 0 0 2px var(--primary)"
                      : "none",
                }}
              >
                {restaurant.primaryColor === c && (
                  <Check size={16} color="white" />
                )}
              </div>
            ))}
            <input
              type="color"
              value={restaurant.primaryColor}
              onChange={(e) => handleUpdate({ primaryColor: e.target.value })}
              style={{
                width: "40px",
                height: "40px",
                border: "none",
                background: "none",
              }}
            />
          </div>
        </section>

        <section className="card">
          <h3
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <Type size={20} /> Typography (Fonts)
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
            }}
          >
            {fonts.map((f) => (
              <div
                key={f.id}
                onClick={() => handleUpdate({ fontFamily: f.id })}
                style={{
                  cursor: "pointer",
                  border:
                    restaurant.fontFamily === f.id
                      ? `2px solid var(--primary)`
                      : "1px solid var(--border)",
                  padding: "1rem",
                  borderRadius: "var(--radius)",
                  backgroundColor: "var(--bg-main)",
                  fontFamily: f.id,
                }}
              >
                <div style={{ fontWeight: "600", fontSize: "1rem" }}>
                  {f.name}
                </div>
                <div
                  style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                >
                  {f.type}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "#f1f5f9",
            borderRadius: "var(--radius)",
            border: "2px dashed #cbd5e1",
          }}
        >
          <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
            Preview of your current theme:
          </p>
          <div
            className={`theme-${restaurant.theme}`}
            style={{
              "--primary": restaurant.primaryColor || "#3b82f6",
              "--font-body": restaurant.fontFamily
                ? `'${restaurant.fontFamily}', sans-serif`
                : "inherit",
              padding: "2rem",
              background: "var(--bg-main)",
              color: "var(--text-main)",
              borderRadius: "12px",
              boxShadow: "var(--shadow)",
              maxWidth: "400px",
              margin: "0 auto",
              textAlign: "left",
              fontFamily: "var(--font-body)",
            }}
          >
            <h4 style={{ color: restaurant.primaryColor }}>
              {restaurant.name}
            </h4>
            <div
              style={{
                margin: "1rem 0",
                height: "2px",
                backgroundColor: "var(--border)",
              }}
            ></div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Theme: {restaurant.theme}
            </p>
            <button
              className="btn"
              style={{
                backgroundColor: restaurant.primaryColor,
                color: "white",
                display: "block",
                width: "100%",
                marginTop: "1rem",
                fontSize: "0.875rem",
              }}
            >
              Button Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Branding;

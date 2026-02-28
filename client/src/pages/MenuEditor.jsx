import React, { useState, useEffect } from "react";
import api from "../api/axios";
import {
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Utensils,
} from "lucide-react";

const MenuEditor = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [newCatName, setNewCatName] = useState("");
  const [editingCatId, setEditingCatId] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isAvailable: true,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const API_BASE_URL = api.defaults.baseURL.replace("/api", ""); // Get root URL from axios config

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, itemRes] = await Promise.all([
        api.get("/menu/categories"),
        api.get("/menu/items"),
      ]);
      setCategories(catRes.data);
      setItems(itemRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName) return;
    try {
      await api.post("/menu/categories", {
        name: newCatName,
        orderIndex: categories.length,
      });
      setNewCatName("");
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete category and all its items?")) return;
    try {
      await api.delete(`/menu/categories/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setItemForm({ ...itemForm, image: "" }); // Clear URL if file selected
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", itemForm.name);
      formData.append("description", itemForm.description);
      formData.append("price", itemForm.price);
      formData.append("category", itemForm.category);
      formData.append("isAvailable", itemForm.isAvailable);

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (itemForm.image) {
        formData.append("image", itemForm.image);
      }

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (itemForm._id) {
        await api.put(`/menu/items/${itemForm._id}`, formData, config);
      } else {
        await api.post("/menu/items", formData, config);
      }

      setShowItemModal(false);
      setItemForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        isAvailable: true,
      });
      setSelectedFile(null);
      setImagePreview("");
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;
    try {
      await api.delete(`/menu/items/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openAddItemModal = (catId) => {
    setItemForm({ ...itemForm, category: catId });
    setShowItemModal(true);
  };

  return (
    <div>
      <div className="header-stack" style={{ marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            Menu Editor
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Create categories and add items.
          </p>
        </div>
        <form
          onSubmit={handleAddCategory}
          style={{ display: "flex", gap: "0.5rem" }}
        >
          <input
            type="text"
            className="input-field"
            placeholder="Category Name"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            style={{ flex: 1, minWidth: "120px" }}
          />
          <button type="submit" className="btn btn-primary">
            <Plus size={20} /> Add
          </button>
        </form>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {categories.map((cat) => (
          <div key={cat._id} className="card" style={{ padding: "0" }}>
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "var(--bg-main)",
                borderTopLeftRadius: "var(--radius)",
                borderTopRightRadius: "var(--radius)",
              }}
            >
              <h3 style={{ fontWeight: "700" }}>{cat.name}</h3>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => openAddItemModal(cat._id)}
                  className="btn btn-secondary"
                  style={{ padding: "0.4rem 1rem", fontSize: "0.875rem" }}
                >
                  <Plus size={16} /> Add Item
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="btn btn-secondary"
                  style={{ padding: "0.4rem", color: "#ef4444" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div style={{ padding: "1rem" }}>
              {items.filter((item) => item.category?._id === cat._id).length ===
              0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "var(--text-muted)",
                    padding: "1.5rem",
                  }}
                >
                  No items in this category.
                </p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {items
                    .filter((item) => item.category?._id === cat._id)
                    .map((item) => (
                      <div
                        key={item._id}
                        style={{
                          display: "flex",
                          gap: "1rem",
                          padding: "1rem",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius)",
                        }}
                      >
                        <div
                          style={{
                            width: "80px",
                            height: "80px",
                            backgroundColor: "#f1f5f9",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                          }}
                        >
                          {item.image ? (
                            <img
                              src={
                                item.image.startsWith("http")
                                  ? item.image
                                  : `${API_BASE_URL}${item.image}`
                              }
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <ImageIcon size={24} style={{ color: "#cbd5e1" }} />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <h4 style={{ fontWeight: "600" }}>{item.name}</h4>
                            <span
                              style={{
                                fontWeight: "700",
                                color: "var(--primary)",
                              }}
                            >
                              ₹{item.price}
                            </span>
                          </div>
                          <p
                            style={{
                              fontSize: "0.875rem",
                              color: "var(--text-muted)",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {item.description}
                          </p>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              onClick={() => {
                                setItemForm({
                                  ...item,
                                  category: item.category?._id || item.category,
                                });
                                setSelectedFile(null);
                                setImagePreview(
                                  item.image
                                    ? item.image.startsWith("http")
                                      ? item.image
                                      : `${API_BASE_URL}${item.image}`
                                    : "",
                                );
                                setShowItemModal(true);
                              }}
                              className="btn btn-secondary"
                              style={{
                                padding: "0.25rem 0.5rem",
                                fontSize: "0.75rem",
                              }}
                            >
                              <Edit2 size={14} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              className="btn btn-secondary"
                              style={{
                                padding: "0.25rem 0.5rem",
                                fontSize: "0.75rem",
                                color: "#ef4444",
                              }}
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div
            className="card"
            style={{ textAlign: "center", padding: "4rem" }}
          >
            <Utensils
              size={48}
              style={{ color: "var(--text-muted)", margin: "0 auto 1.5rem" }}
            />
            <h2>No Categories Yet</h2>
            <p
              style={{
                color: "var(--text-muted)",
                maxWidth: "400px",
                margin: "0.5 auto 2rem",
              }}
            >
              Start by creating categories like "Appetizers", "Main Course", or
              "Drinks".
            </p>
          </div>
        )}
      </div>

      {showItemModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 1000,
          }}
        >
          <div className="card" style={{ maxWidth: "500px", width: "100%" }}>
            <h2>{itemForm._id ? "Edit" : "Add"} Menu Item</h2>
            <form onSubmit={handleAddItem} style={{ marginTop: "1.5rem" }}>
              <div className="input-group">
                <label className="input-label">Item Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={itemForm.name}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div className="input-group">
                  <label className="input-label">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={itemForm.price}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Item Image</label>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "8px",
                        backgroundColor: "var(--bg-main)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <ImageIcon
                          size={20}
                          style={{ color: "var(--text-muted)" }}
                        />
                      )}
                    </div>
                    <input
                      type="file"
                      id="itemImage"
                      hidden
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <label
                      htmlFor="itemImage"
                      className="btn btn-secondary"
                      style={{
                        padding: "0.5rem 1rem",
                        fontSize: "0.875rem",
                        cursor: "pointer",
                      }}
                    >
                      Choose Image
                    </label>
                  </div>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea
                  className="input-field"
                  style={{ minHeight: "100px", fontFamily: "inherit" }}
                  value={itemForm.description}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, description: e.target.value })
                  }
                />
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Save Item
                </button>
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuEditor;

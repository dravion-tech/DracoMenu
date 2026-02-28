import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../api/axios";
import { ShoppingCart, ShoppingBag, Plus, Minus, X, Check } from "lucide-react";

const PublicMenu = () => {
  const { restaurantId } = useParams();
  const [data, setData] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    table: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [addedItemId, setAddedItemId] = useState(null);

  const API_BASE_URL = api.defaults.baseURL.replace("/api", "");

  const location = useLocation();

  useEffect(() => {
    fetchMenu();
    // Parse table number from URL
    const params = new URLSearchParams(location.search);
    const tableNum = params.get("table");
    if (tableNum) {
      setCustomerInfo((prev) => ({ ...prev, table: tableNum }));
    }
  }, [restaurantId, location.search]);

  useEffect(() => {
    if (data?.restaurant?.fontFamily) {
      const fontName = data.restaurant.fontFamily;
      const fontUrl = fontName.replace(/\s+/g, "+");
      const link = document.createElement("link");
      link.id = "dynamic-font";
      link.href = `https://fonts.googleapis.com/css2?family=${fontUrl}:wght@400;500;600;700;800&display=swap`;
      link.rel = "stylesheet";

      const existingLink = document.getElementById("dynamic-font");
      if (existingLink) document.head.removeChild(existingLink);

      document.head.appendChild(link);
      return () => {
        const currentLink = document.getElementById("dynamic-font");
        if (currentLink) document.head.removeChild(currentLink);
      };
    }
  }, [data?.restaurant?.fontFamily]);

  const fetchMenu = async () => {
    try {
      const res = await api.get(`/public/${restaurantId}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (item) => {
    const existing = cart.find((i) => i._id === item._id);
    if (existing) {
      setCart(
        cart.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }

    // Feedback
    setAddedItemId(item._id);
    setTimeout(() => setAddedItemId(null), 1500);
  };

  const updateQuantity = (id, delta) => {
    setCart(
      cart
        .map((i) => {
          if (i._id === id) {
            const newQty = Math.max(0, i.quantity + delta);
            return newQty === 0 ? null : { ...i, quantity: newQty };
          }
          return i;
        })
        .filter(Boolean),
    );
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      await api.post("/orders/public/place", {
        restaurantId,
        items: cart.map((i) => ({
          menuItem: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        tableNumber: customerInfo.table,
      });
      setOrderPlaced(true);
      setCart([]);
    } catch (err) {
      console.error(err);
    }
  };

  if (!data)
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        Loading menu...
      </div>
    );

  const { restaurant, categories, items } = data;

  return (
    <div
      className={`theme-${restaurant.theme}`}
      style={{
        "--primary": restaurant.primaryColor || "#3b82f6",
        "--font-body": restaurant.fontFamily
          ? `'${restaurant.fontFamily}', sans-serif`
          : "inherit",
        backgroundColor: "var(--bg-main)",
        color: "var(--text-main)",
        minHeight: "100vh",
        fontFamily: "var(--font-body)",
      }}
    >
      <style>{`
        .theme-${restaurant.theme} {
          --primary: ${restaurant.primaryColor} !important;
          --primary-hover: ${restaurant.primaryColor}dd !important;
          --font-body: "${restaurant.fontFamily}", sans-serif !important;
        }
      `}</style>

      {/* Header */}
      <header
        className="glass"
        style={{
          position: "sticky",
          top: 0,
          padding: "1rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 100,
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {restaurant.logo && (
            <img
              src={restaurant.logo}
              alt="Logo"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                objectFit: "contain",
              }}
            />
          )}
          <div>
            <h2
              style={{ fontSize: "1.25rem", fontWeight: "800", lineHeight: 1 }}
            >
              {restaurant.name}
            </h2>
            {customerInfo.table && (
              <span
                style={{
                  fontSize: "0.75rem",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  marginTop: "4px",
                  display: "inline-block",
                }}
              >
                Table #{customerInfo.table}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowCart(true)}
          style={{
            position: "relative",
            background: "none",
            border: "none",
            color: "var(--text-main)",
          }}
        >
          <ShoppingBag size={24} />
          {cart.length > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                backgroundColor: "red",
                color: "white",
                fontSize: "0.75rem",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          )}
        </button>
      </header>

      {/* Menu Sections */}
      <main
        style={{
          padding: "1rem",
          paddingBottom: "5rem",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {categories.map((cat) => (
          <section key={cat._id} style={{ marginBottom: "2.5rem" }}>
            <h3
              style={{
                fontSize: "1.75rem",
                marginBottom: "1.5rem",
                paddingLeft: "1rem",
                position: "relative",
                fontWeight: "800",
                letterSpacing: "-0.5px",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "1.75rem",
                  backgroundColor: "var(--primary)",
                  borderRadius: "4px",
                }}
              ></div>
              {cat.name}
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {items
                .filter((item) => item.category?._id === cat._id)
                .map((item) => (
                  <div
                    key={item._id}
                    className="card hover-lift glass-card"
                    style={{
                      display: "flex",
                      gap: "1.25rem",
                      padding: "1rem",
                      alignItems: "center",
                      borderRadius: "16px",
                    }}
                  >
                    {item.image && (
                      <div
                        style={{
                          overflow: "hidden",
                          borderRadius: "12px",
                          width: "90px",
                          height: "90px",
                          flexShrink: 0,
                        }}
                      >
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
                            transition: "transform 0.3s ease",
                          }}
                          className="item-image"
                        />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          fontWeight: "700",
                          fontSize: "1.1rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {item.name}
                      </h4>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-muted)",
                          marginBottom: "0.75rem",
                          lineHeight: "1.4",
                        }}
                      >
                        {item.description}
                      </p>
                      <div
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "800",
                          color: "var(--primary)",
                        }}
                      >
                        ₹{item.price.toFixed(2)}
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className={`btn btn-premium ${addedItemId === item._id ? "pulse-glow" : ""}`}
                      style={{
                        padding: "0.5rem",
                        minWidth: "auto",
                        borderRadius: "12px",
                        width: "42px",
                        height: "42px",
                        transition:
                          "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      }}
                    >
                      <Plus size={22} />
                    </button>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </main>

      {/* Floating Cart Bar */}
      {cart.length > 0 && !showCart && !orderPlaced && (
        <div
          style={{
            position: "fixed",
            bottom: "1.5rem",
            left: "1rem",
            right: "1rem",
            zIndex: 900,
            animation: "slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div
            className="premium-gradient"
            onClick={() => setShowCart(true)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem 1.5rem",
              borderRadius: "20px",
              color: "white",
              boxShadow: "0 10px 25px rgba(99, 102, 241, 0.4)",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "800",
                }}
              >
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </div>
              <div style={{ fontWeight: "700", fontSize: "1.1rem" }}>
                View Your Basket
              </div>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span style={{ opacity: 0.8, fontSize: "0.9rem" }}>Total:</span>
              <span style={{ fontWeight: "800", fontSize: "1.1rem" }}>
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal / Slider */}
      {showCart && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxShadow: "-10px 0 50px rgba(0,0,0,0.5)",
              backgroundColor: "var(--bg-card)",
              borderLeft: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                padding: "1.5rem 2rem",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "800",
                  letterSpacing: "-1px",
                }}
              >
                Your Basket
              </h2>
              <button
                onClick={() => setShowCart(false)}
                style={{
                  background: "none",
                  color: "var(--text-main)",
                  opacity: 0.7,
                }}
                className="hover-lift"
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
              {cart.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "var(--text-muted)",
                    marginTop: "4rem",
                  }}
                >
                  Your cart is empty.
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "600" }}>{item.name}</div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          border: "1px solid var(--border)",
                          borderRadius: "20px",
                          padding: "2px",
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item._id, -1)}
                          className="hover-lift"
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255,255,255,0.05)",
                            color: "var(--text-main)",
                          }}
                        >
                          <Minus size={16} />
                        </button>
                        <span
                          style={{
                            fontWeight: "700",
                            minWidth: "24px",
                            textAlign: "center",
                            fontSize: "1.1rem",
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, 1)}
                          className="hover-lift"
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255,255,255,0.05)",
                            color: "var(--text-main)",
                          }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div
                style={{
                  padding: "1.5rem",
                  borderTop: "1px solid var(--border)",
                  backgroundColor: "var(--bg-main)",
                }}
              >
                {checkoutStep === 1 ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "1.5rem",
                        fontWeight: "800",
                        fontSize: "1.5rem",
                        color: "var(--primary)",
                      }}
                    >
                      <span style={{ color: "var(--text-main)" }}>
                        Total Amount
                      </span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => setCheckoutStep(2)}
                      className="btn premium-gradient hover-lift"
                      style={{
                        width: "100%",
                        padding: "1.25rem",
                        borderRadius: "16px",
                        fontSize: "1.1rem",
                        boxShadow: "0 10px 20px rgba(99, 102, 241, 0.4)",
                      }}
                    >
                      Confirm Order
                    </button>
                  </>
                ) : (
                  <form onSubmit={handlePlaceOrder}>
                    <div className="input-group">
                      <input
                        placeholder="Your Name"
                        className="input-field"
                        value={customerInfo.name}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="input-group">
                      <input
                        placeholder="Phone Number"
                        className="input-field"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="input-group">
                      <input
                        placeholder="Table Number (Optional)"
                        className="input-field"
                        value={customerInfo.table}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            table: e.target.value,
                          })
                        }
                        readOnly={
                          !!new URLSearchParams(location.search).get("table")
                        }
                        style={{
                          backgroundColor: !!new URLSearchParams(
                            location.search,
                          ).get("table")
                            ? "var(--bg-main)"
                            : "inherit",
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: "100%", padding: "1rem" }}
                    >
                      Place Order
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(1)}
                      style={{
                        background: "none",
                        border: "none",
                        width: "100%",
                        marginTop: "1rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      Back to cart
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {orderPlaced && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.9)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            className="card glass-card"
            style={{
              maxWidth: "400px",
              width: "100%",
              textAlign: "center",
              padding: "4rem 2rem",
              borderRadius: "24px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div
              className="premium-gradient"
              style={{
                width: "80px",
                height: "80px",
                color: "white",
                borderRadius: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 2rem",
                boxShadow: "0 15px 30px rgba(99, 102, 241, 0.4)",
                transform: "rotate(-5deg)",
              }}
            >
              <Check size={40} />
            </div>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "900",
                letterSpacing: "-1px",
              }}
            >
              Chef is on it!
            </h2>
            <p style={{ color: "var(--text-muted)", margin: "1rem 0 2rem" }}>
              Your order has been sent to the kitchen. Thank you for choosing{" "}
              {restaurant.name}!
            </p>
            <button
              onClick={() => {
                setOrderPlaced(false);
                setShowCart(false);
                setCheckoutStep(1);
              }}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicMenu;

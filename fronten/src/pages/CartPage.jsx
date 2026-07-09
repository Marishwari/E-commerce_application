import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api";

// ==========================================
// 1. EMBEDDED CSS (Scroll-Safe & Premium)
// ==========================================
const injectedCSS = `
  :root {
    --theme-plum: #6E026F;
    --theme-plum-dark: #4a014b;
    --pure-white: #ffffff;
    --bg-light: #FDFCFE;
    --text-dark: #1a1a1a;
    --text-gray: #777777;
    --border-light: #EEEEEE;
    --transition-smooth: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .cart-page-wrapper {
    background-color: var(--bg-light);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  .cart-main-content {
    flex: 1;
    padding: 140px 20px 80px; 
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    box-sizing: border-box;
    animation: fadeIn 0.8s ease-out forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .cart-header {
    margin-bottom: 50px;
    border-bottom: 2px solid var(--text-dark);
    padding-bottom: 20px;
  }

  .cart-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 900;
    color: var(--text-dark);
    margin: 0;
    letter-spacing: 4px;
    text-transform: uppercase;
  }

  .cart-title span {
    color: var(--theme-plum);
  }

  .cart-subtitle {
    font-size: 14px;
    font-weight: 800;
    color: var(--text-gray);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-top: 10px;
  }

  /* --- GRID LAYOUT --- */
  .cart-grid {
    display: flex;
    gap: 50px;
    align-items: flex-start;
  }

  .cart-items-list {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* --- CART ITEM CARD --- */
  .cart-item-card {
    display: flex;
    gap: 30px;
    background: var(--pure-white);
    border: 1px solid var(--border-light);
    padding: 25px;
    align-items: center;
    transition: var(--transition-smooth);
  }

  .cart-item-card:hover {
    border-color: var(--text-dark);
    transform: translateX(5px);
  }

  .cart-item-img {
    width: 120px;
    height: 150px;
    object-fit: cover;
    border: 1px solid var(--text-dark);
    background-color: var(--bg-light);
  }

  .cart-item-details {
    flex: 1;
  }

  .item-name {
    font-size: 16px;
    font-weight: 900;
    color: var(--text-dark);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin: 0 0 15px 0;
  }

  .qty-controls {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
  }

  .qty-btn {
    width: 35px;
    height: 35px;
    border: 2px solid var(--text-dark);
    background: transparent;
    color: var(--text-dark);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: var(--transition-smooth);
  }

  .qty-btn:hover {
    background: var(--theme-plum);
    color: var(--pure-white);
    border-color: var(--theme-plum);
  }

  .qty-text {
    font-weight: 900;
    font-size: 14px;
    min-width: 25px;
    text-align: center;
  }

  .item-price {
    font-size: 18px;
    font-weight: 900;
    color: var(--theme-plum);
    letter-spacing: 1px;
    margin: 0;
  }

  .delete-btn {
    background: none;
    border: none;
    color: #CCCCCC;
    cursor: pointer;
    transition: var(--transition-smooth);
    padding: 10px;
  }

  .delete-btn:hover {
    color: #d90429;
    transform: scale(1.1);
  }

  /* --- SUMMARY CARD --- */
  .cart-summary-card {
    flex: 1;
    background-color: var(--pure-white);
    padding: 40px;
    border: 2px solid var(--text-dark);
    position: sticky;
    top: 140px;
    box-shadow: 15px 15px 0px rgba(110, 2, 111, 0.05);
    box-sizing: border-box;
  }

  .summary-card-accent {
    position: absolute;
    top: -2px;
    left: -2px;
    width: 40px;
    height: 40px;
    border-top: 6px solid var(--theme-plum);
    border-left: 6px solid var(--theme-plum);
  }

  .summary-title {
    font-size: 18px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0 0 30px 0;
    border-bottom: 2px solid var(--text-dark);
    padding-bottom: 15px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 30px;
  }

  .summary-total-price {
    color: var(--theme-plum);
    font-size: 26px;
    font-weight: 900;
    letter-spacing: 1px;
  }

  /* --- ACTION BUTTONS --- */
  .action-btn {
    width: 100%;
    padding: 20px;
    background: linear-gradient(135deg, var(--theme-plum), var(--theme-plum-dark));
    color: var(--pure-white);
    border: none;
    font-size: 12px;
    font-weight: 900;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 2px;
    transition: var(--transition-smooth);
    box-shadow: 0 10px 20px rgba(110, 2, 111, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .action-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(110, 2, 111, 0.3);
    letter-spacing: 3px;
    background: linear-gradient(135deg, var(--theme-plum-dark), var(--theme-plum));
  }

  /* --- EMPTY CART --- */
  .empty-cart-container {
    text-align: center;
    padding: 100px 20px;
    border: 2px dashed var(--border-light);
    background: var(--pure-white);
    margin-top: 20px;
  }

  .empty-title {
    font-size: 24px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin: 20px 0 30px;
    color: var(--text-dark);
  }

  .shop-btn-wrapper {
    max-width: 300px;
    margin: 0 auto;
  }

  /* --- RESPONSIVE QUERIES --- */
  @media (max-width: 900px) {
    .cart-grid {
      flex-direction: column;
    }
    .cart-summary-card {
      width: 100%;
      position: relative;
      top: 0;
    }
  }

  @media (max-width: 600px) {
    .cart-item-card {
      flex-direction: column;
      text-align: center;
      position: relative;
      padding: 30px 20px;
    }
    .cart-item-card:hover {
      transform: none;
    }
    .delete-btn {
      position: absolute;
      top: 15px;
      right: 15px;
    }
    .qty-controls {
      justify-content: center;
    }
  }
`;

// ==========================================
// 2. REACT COMPONENT
// ==========================================
export default function CartPage() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userId = user?._id || null;
  const token = user?.token;
  const cartKey = userId ? `cart_${userId}` : "cart_guest";

  const [cart, setCart] = useState([]);

  // ===================================
  // SCROLL ON MOUNT ONLY
  // ===================================
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ===================================
  // LOAD CART
  // ===================================
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (!user) {
          throw new Error("No user");
        }

        const { data } = await API.get("/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Loaded Cart:", data.items);
        setCart(data.items || []);
      } catch (err) {
        console.log("Fallback localStorage");
        const savedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
        setCart(savedCart);
      }
    };

    loadCart();
  }, [cartKey, token]); // Removed 'user' to stop infinite re-renders

  // ===================================
  // UPDATE LOCAL STORAGE
  // ===================================
  const updateCartLocal = (newCart) => {
    setCart(newCart);
    localStorage.setItem(cartKey, JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ===================================
  // INCREMENT
  // ===================================
  const increment = async (productId) => {
    try {
      const item = cart.find((i) => i.productId === productId);
      if (!item) return;

      const { data } = await API.put(
        "/cart/update",
        {
          productId,
          qty: Number(item.qty || 1) + 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCart(data.items || []);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.log("Increment fallback", err);
      const updated = cart.map((item) =>
        item.productId === productId
          ? { ...item, qty: Number(item.qty || 1) + 1 }
          : item
      );
      updateCartLocal(updated);
    }
  };

  // ===================================
  // DECREMENT
  // ===================================
  const decrement = async (productId) => {
    try {
      const item = cart.find((i) => i.productId === productId);
      if (!item) return;

      const newQty = Number(item.qty || 1) - 1;

      const { data } = await API.put(
        "/cart/update",
        {
          productId,
          qty: newQty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCart(data.items || []);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.log("Decrement fallback", err);
      const updated = cart
        .map((item) => {
          if (item.productId === productId) {
            const qty = Number(item.qty || 1) - 1;
            return qty > 0 ? { ...item, qty } : null;
          }
          return item;
        })
        .filter(Boolean);

      updateCartLocal(updated);
    }
  };

  // ===================================
  // REMOVE ITEM
  // ===================================
  const removeItem = async (productId) => {
    if (!window.confirm("Remove this item?")) {
      return;
    }

    try {
      const { data } = await API.delete(`/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("After Remove:", data.items);
      setCart([...data.items]);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.log("Remove fallback", err);
      const updated = cart.filter((item) => item.productId !== productId);
      updateCartLocal(updated);
    }
  };

  // ===================================
  // TOTAL PRICE
  // ===================================
  const totalPrice = cart.reduce((acc, item) => {
    return acc + Number(item.price || 0) * Number(item.qty || 1);
  }, 0);

  return (
    <>
      <style>{injectedCSS}</style>

      <div className="cart-page-wrapper">
        <Navbar />

        <main className="cart-main-content">
          
          {/* HEADER */}
          <header className="cart-header">
            <h1 className="cart-title">
              MY <span>SELECTION</span>
            </h1>
            <p className="cart-subtitle">
              {cart.length} item{cart.length !== 1 && "s"}
            </p>
          </header>

          {/* EMPTY CART */}
          {cart.length === 0 ? (
            <div className="empty-cart-container">
              <ShoppingBag size={50} color="#6E026F" />
              <h2 className="empty-title">Your Bag is Empty</h2>
              <div className="shop-btn-wrapper">
                <button
                  className="action-btn"
                  onClick={() => navigate("/collection")}
                >
                  DISCOVER COLLECTION
                </button>
              </div>
            </div>
          ) : (
            <div className="cart-grid">
              
              {/* LEFT SIDE: ITEMS */}
              <div className="cart-items-list">
                {cart.map((item) => {
                  const productId = item.productId;

                  return (
                    <div key={productId} className="cart-item-card">
                      
                      {/* IMAGE */}
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="cart-item-img"
                      />

                      {/* DETAILS */}
                      <div className="cart-item-details">
                        <h3 className="item-name">{item.name}</h3>

                        {/* QUANTITY */}
                        <div className="qty-controls">
                          <button
                            className="qty-btn"
                            onClick={() => decrement(productId)}
                          >
                            <Minus size={14} strokeWidth={3} />
                          </button>

                          <span className="qty-text">{item.qty || 1}</span>

                          <button
                            className="qty-btn"
                            onClick={() => increment(productId)}
                          >
                            <Plus size={14} strokeWidth={3} />
                          </button>
                        </div>

                        {/* PRICE */}
                        <p className="item-price">
                          ₹
                          {(
                            Number(item.price || 0) * Number(item.qty || 1)
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* DELETE */}
                      <button
                        className="delete-btn"
                        onClick={() => removeItem(productId)}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* RIGHT SIDE: SUMMARY */}
              <aside className="cart-summary-card">
                <div className="summary-card-accent"></div>
                
                <h2 className="summary-title">Order Summary</h2>
                
                <div className="summary-row">
                  <span>Total Investment</span>
                  <strong className="summary-total-price">
                    ₹{Number(totalPrice).toLocaleString("en-IN")}
                  </strong>
                </div>

                <button
                  className="action-btn"
                  onClick={() => navigate("/checkout")}
                >
                  SECURE CHECKOUT
                </button>
              </aside>
              
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
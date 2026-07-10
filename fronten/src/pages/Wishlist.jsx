import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import LuxyResponsiveFooter from "../components/Footer";
import API from "../api";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";

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

  .wishlist-page-wrapper {
    background-color: var(--bg-light);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
   
    font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  .wishlist-main-content {
    flex: 1;
    padding: 140px 20px 80px; 
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    box-sizing: border-box;
    animation: fadeIn 0.8s ease-out forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* --- HEADER --- */
  .wishlist-header {
    text-align: center;
    margin-bottom: 60px;
    border-bottom: 2px solid var(--text-dark);
    padding-bottom: 30px;
  }

  .wishlist-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 900;
    color: var(--text-dark);
    margin: 15px 0 10px;
    letter-spacing: 4px;
    text-transform: uppercase;
  }

  .wishlist-subtitle {
    font-size: 14px;
    font-weight: 800;
    color: var(--text-gray);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
  }

  /* --- GRID --- */
  .wishlist-grid-wrapper {
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .wishlist-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, 300px);
    gap: 40px;
    justify-content: center;
  }

  @media (max-width: 850px) {
    .wishlist-grid {
      grid-template-columns: repeat(auto-fit, 260px);
      gap: 20px;
    }
  }

  @media (max-width: 500px) {
    .wishlist-grid {
      grid-template-columns: 1fr;
      max-width: 320px;
      margin: 0 auto;
    }
  }

  /* --- PRODUCT CARD --- */
  .wishlist-card {
    background-color: var(--pure-white);
    border: 2px solid var(--text-dark);
    position: relative;
    transition: var(--transition-smooth);
    display: flex;
    flex-direction: column;
  }

  .wishlist-card:hover {
    box-shadow: 15px 15px 0px rgba(110, 2, 111, 0.1);
    transform: translateY(-5px);
  }

  .wishlist-image-box {
    position: relative;
    width: 100%;
    aspect-ratio: 4/5;
    border-bottom: 2px solid var(--text-dark);
    overflow: hidden;
    cursor: pointer;
    background-color: var(--bg-light);
  }

  .wishlist-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .wishlist-card:hover .wishlist-image {
    transform: scale(1.05);
  }

  .remove-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
    background-color: var(--pure-white);
    border: 2px solid var(--text-dark);
    color: var(--text-dark);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: var(--transition-smooth);
    z-index: 2;
  }

  .remove-btn:hover {
    background-color: #d90429; /* Sharp red for deletion */
    border-color: #d90429;
    color: var(--pure-white);
  }

  .wishlist-info {
    padding: 25px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .wishlist-category {
    font-size: 11px;
    font-weight: 800;
    color: var(--text-gray);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0 0 10px 0;
  }

  .wishlist-name {
    font-size: 16px;
    font-weight: 900;
    color: var(--text-dark);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 0 15px 0;
    flex-grow: 1;
  }

  .wishlist-price {
    font-size: 18px;
    font-weight: 900;
    color: var(--theme-plum);
    margin: 0 0 20px 0;
    letter-spacing: 1px;
  }

  .add-cart-btn {
    width: 100%;
    padding: 15px;
    background: var(--text-dark);
    color: var(--pure-white);
    border: 2px solid var(--text-dark);
    font-size: 12px;
    font-weight: 900;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 2px;
    transition: var(--transition-smooth);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  .add-cart-btn:hover {
    background: var(--theme-plum);
    border-color: var(--theme-plum);
  }

  /* --- EMPTY STATE --- */
  .empty-state {
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
    margin: 20px 0 15px;
    color: var(--text-dark);
  }

  .empty-text {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-gray);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 30px;
  }

  .shop-btn {
    padding: 18px 35px;
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
  }

  .shop-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(110, 2, 111, 0.3);
    letter-spacing: 3px;
    background: linear-gradient(135deg, var(--theme-plum-dark), var(--theme-plum));
  }
`;

// ==========================================
// 2. REACT COMPONENT
// ==========================================
export default function Wishlist() {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();

  const THEME_COLOR = "#6E026F";

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userId = user?._id;

  const wishlistKey = userId ? `wishlist_${userId}` : "wishlist_guest";
  const cartKey = userId ? `cart_${userId}` : "cart_guest";

  // -------------------------
  // ✅ LOAD WISHLIST
  // -------------------------
  const loadWishlist = useCallback(async () => {
    try {
      if (!user) {
        navigate("/login");
        return;
      }

      const token = user.token;

      const { data } = await API.get("/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const wishlistItems = Array.isArray(data) ? data : data.items || [];
      setWishlist(wishlistItems);
    } catch (err) {
      console.log("⚠️ Wishlist backend failed → using localStorage");
      const localWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
      setWishlist(localWishlist);
    } finally {
      setLoading(false);
    }
  }, [navigate, user, wishlistKey]);

  // -------------------------
  // ✅ REMOVE ITEM
  // -------------------------
  const removeFromWishlist = async (productId) => {
    try {
      const token = user.token;

      await API.delete(`/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.log("⚠️ Remove failed → using localStorage");
    }

    const updatedWishlist = wishlist.filter(
      (item) => (item.productId || item._id) !== productId
    );

    setWishlist(updatedWishlist);
    localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));

    showToast("Removed from Wishlist", "info");
  };

  // -------------------------
  // ✅ ADD TO CART
  // -------------------------
  const addToCart = async (product) => {
    try {
      const token = user.token;

      await API.post(
        "/cart/add",
        {
          productId: product.productId || product._id,
          name: product.name,
          image: product.image,
          price: product.price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.dispatchEvent(new Event("cartUpdated"));
      showToast("Added to Cart", "success");
    } catch (err) {
      console.log("⚠️ Cart backend failed → using localStorage");

      let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
      const existing = cart.find(
        (item) => item._id === (product.productId || product._id)
      );

      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({
          ...product,
          _id: product.productId || product._id,
          qty: 1,
        });
      }

      localStorage.setItem(cartKey, JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      showToast("Added to Cart (offline mode)", "success");
    }
  };

  // -------------------------
  // ✅ EFFECT
  // -------------------------
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  return (
    <>
      <style>{injectedCSS}</style>
      
      <div className="wishlist-page-wrapper">
        <Navbar />

        <main className="wishlist-main-content">
          
          {/* HEADER */}
          <div className="wishlist-header">
            <Heart size={40} color={THEME_COLOR} strokeWidth={2.5} />
            <h1 className="wishlist-title">MY WISHLIST</h1>
            <p className="wishlist-subtitle">Your saved luxury picks</p>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="empty-state">
              <p className="empty-text">Loading your luxury picks...</p>
            </div>
          ) : wishlist.length === 0 ? (
            
            /* EMPTY */
            <div className="empty-state">
              <Heart size={60} color="#CCCCCC" strokeWidth={1.5} />
              <h2 className="empty-title">Your wishlist is empty</h2>
              <p className="empty-text">Save your favorite products here.</p>
              <button
                className="shop-btn"
                onClick={() => navigate("/collection")}
              >
                Explore Collection
              </button>
            </div>
            
          ) : (
            
            /* PRODUCTS */
            <div className="wishlist-grid-wrapper">
              <div className="wishlist-grid">
                {wishlist.map((item) => {
                  const productId = item.productId || item._id;

                  return (
                    <div key={productId} className="wishlist-card">
                      
                      {/* IMAGE */}
                      <div
                        className="wishlist-image-box"
                        onClick={() => navigate(`/product/${productId}`)}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="wishlist-image"
                        />
                        <button
                          className="remove-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromWishlist(productId);
                          }}
                        >
                          <Trash2 size={18} strokeWidth={2.5} />
                        </button>
                      </div>

                      {/* INFO */}
                      <div className="wishlist-info">
                        <p className="wishlist-category">
                          {item.category || "Premium"}
                        </p>
                        <h3 className="wishlist-name">{item.name}</h3>
                        <p className="wishlist-price">
                          ₹{item.price?.toLocaleString()}
                        </p>
                        
                        <button
                          className="add-cart-btn"
                          onClick={() => addToCart(item)}
                        >
                          <ShoppingBag size={16} strokeWidth={2.5} />
                          Add To Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>

        <LuxyResponsiveFooter />

        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      </div>
    </>
  );
}
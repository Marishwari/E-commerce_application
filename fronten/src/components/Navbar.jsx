import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingBag,
  User,
  ArrowRight,
  Heart,
  LogIn,
} from "lucide-react";
import API from "../api";

// ==========================================
// 1. EMBEDDED CSS (Sharp, Bold, Uppercase)
// ==========================================
const injectedCSS = `
  :root {
    --theme-plum: #6E026F;
    --theme-plum-dark: #4a014b;
    --theme-plum-light: rgba(110, 2, 111, 0.06);
    --pure-white: #ffffff;
    --text-dark: #1a1a1a;
    --text-gray: #666666;
    --transition-smooth: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .luxy-navbar {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    height: 85px;
    background-color: rgba(255, 255, 255, 0.97);
    border-bottom: 2px solid transparent;
    transition: var(--transition-smooth);
    font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  .luxy-navbar.scrolled {
    height: 70px;
    border-bottom: 2px solid var(--text-dark);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  }

  .nav-container {
    width: 92%;
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* LOGO */
  .nav-logo {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }

  .logo-luxy {
    font-size: clamp(18px, 3vw, 24px);
    font-weight: 900;
    letter-spacing: 5px;
    color: var(--text-dark);
    text-transform: uppercase;
    margin: 0;
  }

  .logo-attire {
    margin-left: 2px;
    color: var(--theme-plum);
    font-weight: 300;
    letter-spacing: 5px;
    text-transform: uppercase;
  }

  /* DESKTOP NAV */
  .desktop-nav {
    display: flex;
    gap: 4px;
    list-style: none;
    align-items: center;
    padding: 0;
    margin: 0;
  }

  .nav-item {
    position: relative;
    cursor: pointer;
    background: none;
    border: none;
    color: var(--text-gray);
    font-weight: 800;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    padding: 10px 18px;
    transition: var(--transition-smooth);
    white-space: nowrap;
  }

  .nav-item::after {
    content: "";
    position: absolute;
    left: 18px;
    right: 18px;
    bottom: 4px;
    height: 2px;
    background: var(--theme-plum);
    transform: scaleX(0);
    transform-origin: left;
    transition: var(--transition-smooth);
  }

  .nav-item:hover {
    color: var(--text-dark);
  }

  .nav-item:hover::after {
    transform: scaleX(1);
  }

  /* ACTIONS */
  .nav-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nav-icon-wrapper {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-dark);
    transition: var(--transition-smooth);
    width: 40px;
    height: 40px;
  }

  .nav-icon-wrapper:hover {
    color: var(--theme-plum);
    background-color: var(--theme-plum-light);
  }

  .nav-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    background: var(--theme-plum);
    color: var(--pure-white);
    min-width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 800;
    border: 2px solid var(--pure-white);
  }

  /* CTA */
  .nav-cta-btn {
    padding: 11px 24px;
    background: var(--text-dark);
    color: var(--pure-white);
    border: 2px solid var(--text-dark);
    cursor: pointer;
    font-weight: 800;
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: var(--transition-smooth);
    margin-left: 8px;
  }

  .nav-cta-btn:hover {
    background: var(--theme-plum);
    border-color: var(--theme-plum);
  }

  /* MOBILE HAMBURGER */
  .mobile-hamburger {
    display: none;
    cursor: pointer;
    color: var(--text-dark);
    padding: 6px;
    align-items: center;
    justify-content: center;
  }

  .mobile-hamburger:hover {
    color: var(--theme-plum);
  }

  /* MOBILE OVERLAY */
  .mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease;
  }

  .mobile-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  /* MOBILE SIDEBAR */
  .mobile-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 320px;
    max-width: 85vw;
    height: 100vh;
    background: var(--pure-white);
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.45s cubic-bezier(0.19, 1, 0.22, 1);
    padding: 26px 22px;
    box-shadow: 15px 0 50px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow-y: auto;
    font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  .mobile-sidebar.open {
    transform: translateX(0);
  }

  .mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 22px;
    border-bottom: 2px solid var(--text-dark);
  }

  .close-btn {
    cursor: pointer;
    color: var(--text-dark);
    border: 2px solid var(--text-dark);
    padding: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-smooth);
  }

  .close-btn:hover {
    color: var(--pure-white);
    background: var(--theme-plum);
    border-color: var(--theme-plum);
  }

  .mobile-section-label {
    margin-top: 22px;
    margin-bottom: 6px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 2px;
    color: #aaa;
    text-transform: uppercase;
  }

  .mobile-menu-items {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .mobile-menu-item {
    cursor: pointer;
    font-weight: 800;
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 14px;
    color: var(--text-dark);
    border-bottom: 1px solid #eee;
    transition: var(--transition-smooth);
  }

  .mobile-menu-item .arrow-icon {
    color: var(--text-gray);
    transition: var(--transition-smooth);
    opacity: 0;
    transform: translateX(-8px);
  }

  .mobile-menu-item:hover {
    color: var(--theme-plum);
    padding-left: 20px;
    background-color: var(--theme-plum-light);
  }

  .mobile-menu-item:hover .arrow-icon {
    color: var(--theme-plum);
    opacity: 1;
    transform: translateX(0);
  }

  .mobile-footer-actions {
    margin-top: auto;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .mobile-cta-btn {
    width: 100%;
    padding: 15px;
    background: var(--text-dark);
    color: var(--pure-white);
    border: 2px solid var(--text-dark);
    cursor: pointer;
    font-weight: 800;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: var(--transition-smooth);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .mobile-cta-btn:hover {
    background: var(--theme-plum);
    border-color: var(--theme-plum);
  }

  /* ============ RESPONSIVE BREAKPOINTS ============ */

  @media (max-width: 1024px) {
    .nav-item {
      padding: 10px 12px;
      font-size: 10px;
      letter-spacing: 1px;
    }
  }

  @media (max-width: 850px) {
    .desktop-nav,
    .desktop-icon-only,
    .desktop-btn-only {
      display: none !important;
    }

    .mobile-hamburger {
      display: flex;
    }

    .nav-container {
      justify-content: flex-start;
      gap: 18px;
    }

    .nav-actions {
      margin-left: auto;
      gap: 2px;
    }
  }

  @media (max-width: 480px) {
    .luxy-navbar {
      height: 70px;
    }

    .luxy-navbar.scrolled {
      height: 62px;
    }

    .logo-luxy,
    .logo-attire {
      letter-spacing: 3px;
    }

    .nav-icon-wrapper {
      width: 36px;
      height: 36px;
    }

    .mobile-sidebar {
      width: 100%;
      max-width: 100vw;
      padding: 22px 18px;
    }
  }
`;

// ==========================================
// 2. REACT COMPONENT
// ==========================================
export default function Navbar() {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("userInfo"));

  const getCartKey = useCallback(() => {
    return user?._id ? `cart_${user._id}` : "cart_guest";
  }, [user]);

  const getWishlistKey = useCallback(() => {
    return user?._id ? `wishlist_${user._id}` : "wishlist_guest";
  }, [user]);

  const updateCartCount = useCallback(async () => {
    try {
      if (!user) {
        setCartCount(0);
        return;
      }
      const token = user.token;
      const { data } = await API.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const count = (data.items || []).reduce((acc, item) => acc + (item.qty || 1), 0);
      setCartCount(count);
    } catch (err) {
      const key = getCartKey();
      const cart = JSON.parse(localStorage.getItem(key)) || [];
      const count = cart.reduce((acc, item) => acc + (item.qty || 1), 0);
      setCartCount(count);
    }
  }, [user, getCartKey]);

  const updateWishlistCount = useCallback(async () => {
    try {
      if (!user) {
        setWishlistCount(0);
        return;
      }
      const token = user.token;
      const { data } = await API.get("/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const wishlistItems = Array.isArray(data) ? data : data.items || [];
      setWishlistCount(wishlistItems.length);
    } catch (err) {
      const key = getWishlistKey();
      const wishlist = JSON.parse(localStorage.getItem(key)) || [];
      setWishlistCount(wishlist.length);
    }
  }, [user, getWishlistKey]);

  useEffect(() => {
    updateCartCount();
    updateWishlistCount();

    const handleCartUpdated = () => updateCartCount();
    const handleWishlistUpdated = () => updateWishlistCount();
    const handleStorage = () => {
      updateCartCount();
      updateWishlistCount();
    };
    const handleScroll = () => setIsScrolled(window.scrollY > 20);

    window.addEventListener("cartUpdated", handleCartUpdated);
    window.addEventListener("wishlistUpdated", handleWishlistUpdated);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
      window.removeEventListener("wishlistUpdated", handleWishlistUpdated);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [updateCartCount, updateWishlistCount]);

  // Lock body scroll while mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // ==========================================
  // NAV LINKS — category-only.
  // Account features (Wishlist / Cart / Profile) live in the
  // icon actions area on desktop, and in a separate "Account"
  // section of the mobile menu — no duplication.
  // ==========================================
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/collection" },
    { name: "New Arrivals", path: "/collection?sort=new" },
  ];

  return (
    <>
      <style>{injectedCSS}</style>

      <nav className={`luxy-navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          {/* MOBILE MENU TOGGLE */}
          <div
            className="mobile-hamburger"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={26} strokeWidth={2} />
          </div>

          {/* LOGO */}
          <div className="nav-logo" onClick={() => navigate("/")}>
            <span className="logo-luxy">LUXY</span>
            <span className="logo-attire">ATTIRE</span>
          </div>

          {/* DESKTOP NAV */}
          <ul className="desktop-nav">
            {navItems.map((item) => (
              <li
                key={item.name}
                className="nav-item"
                onClick={() => navigate(item.path)}
              >
                {item.name}
              </li>
            ))}
          </ul>

          {/* ACTIONS */}
          <div className="nav-actions">
            <div
              className="nav-icon-wrapper"
              onClick={() => (user ? navigate("/wishlist") : navigate("/login"))}
              aria-label="Wishlist"
            >
              <Heart size={20} strokeWidth={1.8} />
              {wishlistCount > 0 && <span className="nav-badge">{wishlistCount}</span>}
            </div>

            <div
              className="nav-icon-wrapper"
              onClick={() => (user ? navigate("/cart") : navigate("/login"))}
              aria-label="Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.8} />
              {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
            </div>

            <div
              className="nav-icon-wrapper desktop-icon-only"
              onClick={() => (user ? navigate("/profile") : navigate("/login"))}
              aria-label="Profile"
            >
              <User size={20} strokeWidth={1.8} />
            </div>

            {!user && (
              <button
                className="nav-cta-btn desktop-btn-only"
                onClick={() => navigate("/register")}
              >
                Join Now
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div
        className={`mobile-overlay ${mobileMenuOpen ? "active" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* MOBILE SIDEBAR */}
      <div className={`mobile-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-header">
          <div
            className="nav-logo"
            onClick={() => {
              navigate("/");
              setMobileMenuOpen(false);
            }}
          >
            <span className="logo-luxy">LUXY</span>
            <span className="logo-attire">ATTIRE</span>
          </div>
          <div className="close-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <X size={18} strokeWidth={2.5} />
          </div>
        </div>

        {/* CATEGORY LINKS */}
        <p className="mobile-section-label">Shop</p>
        <div className="mobile-menu-items">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="mobile-menu-item"
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
            >
              <span>{item.name}</span>
              <ArrowRight size={16} className="arrow-icon" strokeWidth={2} />
            </div>
          ))}
        </div>

        {/* ACCOUNT LINKS */}
        <p className="mobile-section-label">Account</p>
        <div className="mobile-menu-items">
          <div
            className="mobile-menu-item"
            onClick={() => {
              navigate(user ? "/wishlist" : "/login");
              setMobileMenuOpen(false);
            }}
          >
            <span>Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ""}</span>
            <ArrowRight size={16} className="arrow-icon" strokeWidth={2} />
          </div>

          <div
            className="mobile-menu-item"
            onClick={() => {
              navigate(user ? "/cart" : "/login");
              setMobileMenuOpen(false);
            }}
          >
            <span>Cart {cartCount > 0 ? `(${cartCount})` : ""}</span>
            <ArrowRight size={16} className="arrow-icon" strokeWidth={2} />
          </div>

          <div
            className="mobile-menu-item"
            onClick={() => {
              navigate(user ? "/profile" : "/login");
              setMobileMenuOpen(false);
            }}
          >
            <span>{user ? "My Account" : "Login"}</span>
            <ArrowRight size={16} className="arrow-icon" strokeWidth={2} />
          </div>
        </div>

        {!user && (
          <div className="mobile-footer-actions">
            <button
              className="mobile-cta-btn"
              onClick={() => {
                navigate("/register");
                setMobileMenuOpen(false);
              }}
            >
              <LogIn size={15} />
              Join Now
            </button>
          </div>
        )}
      </div>
    </>
  );
}
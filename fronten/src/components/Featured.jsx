import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight, Star, Sparkles } from "lucide-react";
import API from "../api";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";

const THEME_COLOR = "#6E026F";

export default function Featured() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userId = user?._id || null;
  const cartKey = userId ? `cart_${userId}` : "cart_guest";

  // =========================
  // FETCH FEATURED PRODUCTS
  // =========================
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get(`/products?sort=new&limit=4`);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await API.post("/cart/add", {
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
      });

      window.dispatchEvent(new Event("cartUpdated"));
      showToast("Added to Cart", "success");
    } catch (err) {
      let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
      const index = cart.findIndex((item) => item._id === product._id);

      if (index === -1) {
        cart.push({ ...product, qty: 1 });
      } else {
        cart[index].qty += 1;
      }

      localStorage.setItem(cartKey, JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { key: cartKey } }));
      showToast("Added to Cart (offline mode)", "success");
    }
  };

  // Nothing to show and nothing loading — stay silent, as before
  if (!loading && products.length === 0) return null;

  return (
    <section style={styles.section}>
      {/* Notice: Section background stays transparent to let the global layout show through */}

      {/* Soft decorative accent, purely cosmetic, doesn't block transparency */}
      <div style={styles.accentOrb} aria-hidden="true" />

      {/* Section Header */}
      <div style={styles.headerContainer} className="fade-in-up delay-1">
        <p style={styles.preTitle}>
          <Sparkles size={11} style={{ marginRight: "6px", verticalAlign: "-1px" }} />
          CURATED SELECTIONS
        </p>
        <h2 style={styles.mainTitle}>Professional Excellence</h2>
        <div style={styles.divider} className="divider-grow"></div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="product-grid" style={styles.grid}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={styles.card} className="skeleton-card">
              <div style={styles.imageContainer} className="skeleton-shimmer" />
              <div style={styles.skeletonLine1} className="skeleton-shimmer" />
              <div style={styles.skeletonLine2} className="skeleton-shimmer" />
              <div style={styles.skeletonLine3} className="skeleton-shimmer" />
            </div>
          ))}
        </div>
      ) : (
        <div className="product-grid" style={styles.grid}>
          {products.map((p, index) => (
            <div
              key={p._id}
              className="product-card fade-in-up"
              style={{ ...styles.card, animationDelay: `${0.2 + index * 0.15}s` }}
            >
              <div
                style={styles.imageContainer}
                className="product-image-container"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                {/* Premium Inner Frame */}
                <div className="image-frame-inner"></div>

                {/* NEW badge */}
                <span style={styles.newBadge} className="new-badge">
                  NEW
                </span>

                <img src={p.image} alt={p.name} style={styles.image} className="product-img" />
                <div style={styles.imageOverlay} className="img-overlay">
                  <span style={styles.viewText} className="view-text-animate">VIEW PIECE</span>
                </div>
              </div>

              <div style={styles.info}>
                <div style={styles.metaRow}>
                  <span style={styles.category}>{p.category}</span>
                  <div style={styles.rating}>
                    <Star size={10} fill="#1a1a1a" className="star-icon" /> {p.rating ? p.rating.toFixed(1) : "4.9"}
                  </div>
                </div>
                <h3 style={styles.productName}>{p.name}</h3>
                <p style={styles.price}>₹{p.price.toLocaleString()}</p>

                <button
                  style={styles.cartBtn}
                  className="btn-primary"
                  onClick={() => addToCart(p)}
                >
                  <span className="btn-primary-label" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <ShoppingBag size={14} strokeWidth={2} /> ADD TO SELECTION
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer CTA */}
      <div style={styles.footer} className="fade-in-up delay-4">
        <button
          style={styles.exploreBtn}
          className="explore-btn"
          onClick={() => navigate("/collection")}
        >
          VIEW ENTIRE EDIT <ArrowRight size={18} className="explore-arrow" />
        </button>
      </div>

      <Toast message={toast.message} type={toast.type} onClose={hideToast} />

      <style>{`
        /* ================================= */
        /* ENTRANCE ANIMATIONS               */
        /* ================================= */
        .fade-in-up {
          opacity: 0;
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .delay-1 { animation-delay: 0.1s; }
        .delay-4 { animation-delay: 0.8s; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .divider-grow {
          transform-origin: center;
          animation: growWidth 1s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.3s;
          width: 0 !important;
        }

        @keyframes growWidth {
          to { width: 40px; }
        }

        /* ================================= */
        /* PRODUCT GRID & 3D CARDS           */
        /* ================================= */
        .product-grid {
          display: grid;
          gap: 50px;
          grid-template-columns: repeat(4, 1fr);
          perspective: 1200px;
        }

        .product-card { 
          display: flex;
          flex-direction: column;
        }

        /* 3D TILT EFFECT */
        .product-image-container {
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease;
          transform-style: preserve-3d;
          will-change: transform;
        }

        .image-frame-inner {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(26,26,26,0.1);
          z-index: 2;
          pointer-events: none;
          transition: border-color 0.4s ease;
        }

        .product-card:hover .product-image-container {
          transform: rotateX(8deg) rotateY(-4deg) translateY(-10px) scale3d(1.02, 1.02, 1.02);
          box-shadow: -15px 25px 40px rgba(110, 2, 111, 0.12);
        }

        .product-card:hover .image-frame-inner {
          border-color: #1a1a1a;
        }

        .product-img { 
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); 
        }
        
        .product-card:hover .product-img { 
          transform: scale(1.08); 
        }

        .img-overlay {
          transition: opacity 0.4s ease, backdrop-filter 0.4s ease;
          transform: translateZ(20px); /* Pushes text forward in 3D space */
        }
        
        .product-card:hover .img-overlay { 
          opacity: 1; 
          backdrop-filter: blur(3px);
        }

        .view-text-animate {
          transform: translateY(15px);
          opacity: 0;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
        }

        .product-card:hover .view-text-animate {
          transform: translateY(0);
          opacity: 1;
        }

        /* NEW BADGE */
        .new-badge {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease;
        }
        .product-card:hover .new-badge {
          transform: translateZ(25px) scale(1.05);
          background: ${THEME_COLOR} !important;
          color: #fff !important;
        }

        /* ================================= */
        /* BUTTON ANIMATIONS                 */
        /* ================================= */
        .btn-primary { 
          transition: all 0.3s ease; 
          border: 1px solid #1a1a1a !important; 
          background: transparent;
          position: relative;
          overflow: hidden;
          color: #1a1a1a;
        }
        .btn-primary-label { position: relative; z-index: 2; justify-content: center; }
        
        .btn-primary::before {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 60%;
          height: 100%;
          background: linear-gradient(120deg, transparent, rgba(26,26,26,0.1), transparent);
          transform: skewX(-20deg);
          transition: left 0.65s ease;
          z-index: 1;
        }
        .btn-primary:hover::before { left: 130%; }
        .btn-primary:hover { 
            background: #1a1a1a !important; 
            color: #fff !important;
            box-shadow: 0 10px 20px rgba(0,0,0,0.15);
        }

        /* EXPLORE BUTTON */
        .explore-btn { 
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
          border-bottom: 2px solid #1a1a1a; 
          position: relative;
        }

        .explore-arrow {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .explore-btn:hover { 
          padding-right: 15px; 
          color: ${THEME_COLOR}; 
          border-color: ${THEME_COLOR}; 
        }
        
        .explore-btn:hover .explore-arrow {
          transform: translateX(6px);
        }

        /* STAR ICON */
        .star-icon {
          transition: transform 0.3s ease, fill 0.3s ease;
        }
        .product-card:hover .star-icon {
          transform: scale(1.2);
          fill: ${THEME_COLOR};
        }

        /* ================================= */
        /* SKELETON LOADING STATE            */
        /* ================================= */
        .skeleton-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .skeleton-shimmer {
          position: relative;
          overflow: hidden;
          background: #f1f1f1;
        }

        .skeleton-shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.65),
            transparent
          );
          animation: shimmerSweep 1.6s ease-in-out infinite;
        }

        @keyframes shimmerSweep {
          100% { transform: translateX(100%); }
        }

        /* ================================= */
        /* RESPONSIVE                        */
        /* ================================= */
        @media (max-width: 1100px) { .product-grid { grid-template-columns: repeat(2, 1fr); gap: 30px; } }
        @media (max-width: 650px) { .product-grid { grid-template-columns: 1fr; gap: 40px; } }
        
        @media (prefers-reduced-motion: reduce) {
          .product-card:hover .product-image-container { transform: none; box-shadow: none; }
          .product-img { transition: none; }
          .product-card:hover .product-img { transform: none; }
          .skeleton-shimmer::after { animation: none; }
        }
      `}</style>
    </section>
  );
}

const styles = {
  section: {
    padding: "120px 5%",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    zIndex: 2,
    backgroundColor: "transparent",
    maxWidth: "1400px",
    margin: "0 auto",
    overflow: "hidden",
  },
  accentOrb: {
    position: "absolute",
    top: "-80px",
    right: "-60px",
    width: "320px",
    height: "320px",
    borderRadius: "50%",
    background: "radial-gradient(circle at 35% 35%, rgba(110,2,111,0.07), rgba(110,2,111,0.01) 60%, transparent 75%)",
    pointerEvents: "none",
    zIndex: -1,
  },
  headerContainer: {
    textAlign: "center",
    marginBottom: "80px",
  },
  preTitle: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "4px",
    color: "#6E026F",
    marginBottom: "12px",
    display: "inline-flex",
    alignItems: "center",
  },
  mainTitle: {
    fontSize: "clamp(32px, 4.5vw, 48px)",
    fontWeight: "900",
    color: "#1a1a1a",
    margin: 0,
    letterSpacing: "-1.5px",
  },
  divider: {
    height: "2px",
    backgroundColor: "#1a1a1a",
    margin: "25px auto",
  },
  card: {
    backgroundColor: "transparent",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: "0.8/1",
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    marginBottom: "24px",
    position: "relative",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(255,255,255,0.05)", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center", 
    opacity: 0,
    zIndex: 3,
  },
  viewText: {
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "3px",
    background: "#fff",
    padding: "12px 24px",
    color: "#1a1a1a",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)", 
  },
  newBadge: {
    position: "absolute",
    top: "16px",
    left: "16px",
    zIndex: 3,
    background: "#fff",
    color: "#1a1a1a",
    fontSize: "9px",
    fontWeight: "900",
    letterSpacing: "2px",
    padding: "6px 12px",
    border: "1px solid #1a1a1a",
  },
  info: {
    textAlign: "left",
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  category: {
    fontSize: "10px",
    fontWeight: "800",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
  },
  rating: {
    fontSize: "11px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#1a1a1a",
  },
  productName: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#1a1a1a",
    margin: "0 0 8px 0",
    letterSpacing: "0.5px",
  },
  price: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#6E026F",
    margin: "0 0 20px 0",
  },
  cartBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: "0px",
    fontWeight: "800",
    fontSize: "11px",
    letterSpacing: "1.5px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px",
  },
  exploreBtn: {
    padding: "15px 0",
    backgroundColor: "transparent",
    color: "#1a1a1a",
    border: "none",
    fontWeight: "900",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "3px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  skeletonLine1: {
    height: "12px",
    width: "40%",
  },
  skeletonLine2: {
    height: "18px",
    width: "70%",
  },
  skeletonLine3: {
    height: "16px",
    width: "35%",
  },
};
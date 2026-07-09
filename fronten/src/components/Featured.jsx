import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight, Star } from "lucide-react";
import API from "../api";

const THEME_COLOR = "#6E026F";

export default function Featured() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userId = user?._id || null;
  const cartKey = userId ? `cart_${userId}` : "cart_guest";

  // =========================
  // FETCH FEATURED PRODUCTS
  // (latest 4 admin-added products)
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
    }
  };

  if (products.length === 0) return null;

  return (
    <section style={styles.section}>
      {/* Section Header */}
      <div style={styles.headerContainer}>
        <p style={styles.preTitle}>CURATED SELECTIONS</p>
        <h2 style={styles.mainTitle}>Professional Excellence</h2>
        <div style={styles.divider}></div>
      </div>

      {/* Product Grid */}
      <div className="product-grid" style={styles.grid}>
        {products.map((p) => (
          <div key={p._id} className="product-card" style={styles.card}>
            <div style={styles.imageContainer} onClick={() => navigate(`/product/${p._id}`)}>
              <img src={p.image} alt={p.name} style={styles.image} className="product-img" />
              <div style={styles.imageOverlay} className="img-overlay">
                <span style={styles.viewText}>VIEW PIECE</span>
              </div>
            </div>

            <div style={styles.info}>
              <div style={styles.metaRow}>
                <span style={styles.category}>{p.category}</span>
                <div style={styles.rating}>
                  <Star size={10} fill="#1a1a1a" /> {p.rating ? p.rating.toFixed(1) : "4.9"}
                </div>
              </div>
              <h3 style={styles.productName}>{p.name}</h3>
              <p style={styles.price}>₹{p.price.toLocaleString()}</p>

              <button
                style={styles.cartBtn}
                className="cart-action-btn"
                onClick={() => addToCart(p)}
              >
                <ShoppingBag size={16} /> ADD TO SELECTION
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div style={styles.footer}>
        <button
          style={styles.exploreBtn}
          className="explore-btn"
          onClick={() => navigate("/collection")}
        >
          VIEW ENTIRE EDIT <ArrowRight size={18} />
        </button>
      </div>

      <style>{`
        .product-grid {
          display: grid;
          gap: 40px;
          grid-template-columns: repeat(4, 1fr);
        }

        .product-card { transition: opacity 0.3s ease; }
        .product-card:hover .img-overlay { opacity: 1; }
        .product-img { transition: transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1); }
        .product-card:hover .product-img { transform: scale(1.05); }

        .cart-action-btn { 
          transition: all 0.3s ease; 
          background: transparent; 
          border: 1px solid #1a1a1a; 
          color: #1a1a1a; 
        }
        .cart-action-btn:hover { 
          background: #1a1a1a; 
          color: #fff; 
        }

        .explore-btn { transition: all 0.4s ease; border-bottom: 2px solid #1a1a1a; }
        .explore-btn:hover { padding-right: 20px; color: ${THEME_COLOR}; border-color: ${THEME_COLOR}; }

        @media (max-width: 1100px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 650px) { .product-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

const styles = {
  section: {
    padding: "100px 5%",
    backgroundColor: "#FFFFFF",
    fontFamily: "'Inter', sans-serif",
  },
  headerContainer: {
    textAlign: "center",
    marginBottom: "80px",
  },
  preTitle: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "3px",
    color: "#6E026F",
    marginBottom: "10px",
  },
  mainTitle: {
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: "900",
    color: "#1a1a1a",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "-1px",
  },
  divider: {
    width: "30px",
    height: "2px",
    backgroundColor: "#1a1a1a",
    margin: "20px auto",
  },
  card: {
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "column",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: "3/4",
    overflow: "hidden",
    backgroundColor: "#f7f7f7",
    marginBottom: "20px",
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
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "0.3s ease",
    backdropFilter: "blur(2px)",
  },
  viewText: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "2px",
    background: "#fff",
    padding: "10px 20px",
    color: "#1a1a1a",
  },
  info: {
    textAlign: "left",
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  category: {
    fontSize: "10px",
    fontWeight: "800",
    color: "#BBB",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  rating: {
    fontSize: "10px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  productName: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0 0 5px 0",
  },
  price: {
    fontSize: "18px",
    fontWeight: "400",
    color: "#6E026F",
    margin: "0 0 20px 0",
  },
  cartBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: "0px",
    fontWeight: "800",
    fontSize: "11px",
    letterSpacing: "1px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "80px",
  },
  exploreBtn: {
    padding: "15px 0",
    backgroundColor: "transparent",
    color: "#1a1a1a",
    border: "none",
    fontWeight: "900",
    fontSize: "13px",
    letterSpacing: "2px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
};
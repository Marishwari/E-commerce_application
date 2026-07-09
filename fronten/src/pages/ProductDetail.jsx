import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import ReviewsList from "../components/ReviewsList";
import ReviewForm from "../components/ReviewForm";
import Footer from "../components/Footer";
import {
  FiShoppingBag,
  FiHeart,
  FiShare2,
  FiStar,
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiLock,
  FiArrowLeft,
  FiCheck,
  FiCopy,
} from "react-icons/fi";

const THEME_COLOR = "#6E026F";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [adding, setAdding] = useState(false);
  const [shared, setShared] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("userInfo"));
  const userId = currentUser?._id || null;
  const cartKey = userId ? `cart_${userId}` : "cart_guest";
  const wishlistKey = userId ? `wishlist_${userId}` : "wishlist_guest";

  // =========================
  // FETCH PRODUCT + REVIEWS
  // =========================
  useEffect(() => {
    if (id) {
      API.get(`/products/${id}`).then((res) => setProduct(res.data));
      API.get(`/reviews/${id}`).then((res) => setReviews(res.data));
    }
  }, [id]);

  // =========================
  // LOAD WISHLIST
  // =========================
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    if (!currentUser) return;
    try {
      const { data } = await API.get("/wishlist");
      setWishlist(data);
    } catch (err) {
      const localWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
      setWishlist(localWishlist);
    }
  };

  const isWishlisted =
    product &&
    wishlist.some(
      (item) =>
        item.productId === product._id ||
        item.productId?._id === product._id ||
        item._id === product._id
    );

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setAdding(true);
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
    } finally {
      setTimeout(() => setAdding(false), 1200);
    }
  };

  // =========================
  // ADD TO WISHLIST
  // =========================
  const addToWishlist = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (isWishlisted) return;

    try {
      await API.post("/wishlist/add", {
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
      });

      setWishlist([...wishlist, { productId: product._id, ...product }]);
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      let localWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
      const exists = localWishlist.find((item) => item._id === product._id);

      if (!exists) {
        localWishlist.push(product);
        localStorage.setItem(wishlistKey, JSON.stringify(localWishlist));
        setWishlist(localWishlist);
        window.dispatchEvent(new Event("wishlistUpdated"));
      }
    }
  };

  // =========================
  // SHARE
  // =========================
  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    }
  };

  if (!product)
    return <div style={styles.loading}>Loading...</div>;

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div style={styles.wrapper}>
      <Navbar />

      <main style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate(-1)} className="back-btn">
          <FiArrowLeft /> Back to Collection
        </button>

        <div style={styles.productGrid} className="product-grid">
          {/* IMAGE */}
          <div style={styles.imageColumn}>
            <div style={styles.imageFrame}>
              <img src={product.image} alt={product.name} style={styles.productImg} />
            </div>
          </div>

          {/* INFO */}
          <div style={styles.infoColumn}>
            <span style={styles.category}>{product.category}</span>
            <h1 style={styles.title}>{product.name}</h1>

            <div style={styles.rating}>
              <FiStar size={15} color={THEME_COLOR} fill={THEME_COLOR} />
              <span>{avgRating}</span>
              <span style={styles.ratingMuted}>({reviews.length} reviews)</span>
            </div>

            <p style={styles.price}>₹{product.price?.toLocaleString()}</p>
            <p style={styles.desc}>{product.description}</p>

            <div style={styles.actionRow}>
              <button
                style={{ ...styles.cartBtn, opacity: adding ? 0.8 : 1 }}
                onClick={addToCart}
                className="cart-btn"
              >
                {adding ? (
                  <>
                    <FiCheck /> Added
                  </>
                ) : (
                  <>
                    <FiShoppingBag /> Add to Bag
                  </>
                )}
              </button>

              <button
                style={styles.iconBtn}
                onClick={addToWishlist}
                className="icon-btn"
                aria-label="Add to wishlist"
              >
                <FiHeart
                  size={18}
                  color={isWishlisted ? "red" : "#1a1a1a"}
                  fill={isWishlisted ? "red" : "none"}
                />
              </button>

              <button
                style={styles.iconBtn}
                onClick={handleShare}
                className="icon-btn"
                aria-label="Share product"
              >
                {shared ? <FiCopy size={18} color={THEME_COLOR} /> : <FiShare2 size={18} />}
              </button>
            </div>

            {shared && <p style={styles.shareToast}>Link copied to clipboard</p>}

            <div style={styles.features}>
              {[
                { icon: <FiShield size={16} />, text: "Authentic" },
                { icon: <FiTruck size={16} />, text: "Free Ship" },
                { icon: <FiRefreshCw size={16} />, text: "7-Day Return" },
                { icon: <FiLock size={16} />, text: "Secure" },
              ].map((f, i) => (
                <div key={i} style={styles.featItem}>
                  <span style={{ color: THEME_COLOR }}>{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <section style={styles.reviewSection}>
        <h2 style={styles.reviewTitle}>Client Feedback</h2>
        <ReviewForm productId={id} onReviewAdded={(newRev) => setReviews([newRev, ...reviews])} />
        <ReviewsList
          productId={id}
          currentUser={currentUser}
          externalReviews={reviews}
          setExternalReviews={setReviews}
        />
      </section>

      <Footer />

      <style>{`
        .back-btn { transition: 0.3s; }
        .back-btn:hover { color: ${THEME_COLOR}; }

        .cart-btn { transition: 0.3s; }
        .cart-btn:hover { background: ${THEME_COLOR}; }

        .icon-btn { transition: 0.3s; }
        .icon-btn:hover { background: #e6e6e6; }

        @media (max-width: 850px) {
          .product-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: { backgroundColor: "#F9F9F9", minHeight: "100vh" },
  loading: { padding: "200px 20px", textAlign: "center", fontSize: "14px", letterSpacing: "1px" },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "140px 20px 60px" },

  backBtn: {
    background: "none",
    border: "none",
    marginBottom: "25px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#1a1a1a",
  },

  productGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "70px",
    background: "#fff",
    padding: "50px",
    border: "1px solid #1a1a1a",
  },

  imageColumn: { width: "100%" },
  imageFrame: {
    width: "100%",
    aspectRatio: "1/1",
    overflow: "hidden",
    backgroundColor: "#f4f4f4",
  },
  productImg: { width: "100%", height: "100%", objectFit: "cover" },

  infoColumn: { display: "flex", flexDirection: "column", justifyContent: "center" },

  category: {
    color: THEME_COLOR,
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    margin: "12px 0",
    letterSpacing: "0.5px",
    color: "#1a1a1a",
  },
  rating: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "22px",
    fontSize: "13px",
    fontWeight: "600",
  },
  ratingMuted: { color: "#999", fontWeight: "400" },

  price: { fontSize: "26px", fontWeight: "400", marginBottom: "20px", color: "#1a1a1a" },
  desc: { color: "#666", lineHeight: "1.7", marginBottom: "32px", fontSize: "14px" },

  actionRow: { display: "flex", gap: "10px", marginBottom: "10px" },
  cartBtn: {
    flex: 1,
    padding: "16px",
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    fontWeight: "800",
    fontSize: "11px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },
  iconBtn: {
    padding: "16px 20px",
    background: "#f0f0f0",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  shareToast: {
    fontSize: "11px",
    color: THEME_COLOR,
    fontWeight: "700",
    letterSpacing: "0.5px",
    marginBottom: "20px",
  },

  features: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginTop: "20px",
    paddingTop: "24px",
    borderTop: "1px solid #eee",
  },
  featItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "11px",
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: "0.5px",
    color: "#1a1a1a",
  },

  reviewSection: { maxWidth: "1200px", margin: "0 auto", padding: "20px 20px 60px" },
  reviewTitle: {
    marginBottom: "30px",
    fontSize: "22px",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },
};
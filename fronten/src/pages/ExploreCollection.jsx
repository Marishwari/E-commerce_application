import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import LuxyResponsiveFooter from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";

import {
  FiSearch,
  FiShoppingBag,
  FiHeart,
  FiEye,
  FiPackage,
} from "react-icons/fi";

import { HiOutlineSparkles } from "react-icons/hi";

export default function ExploreCollection() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [wishlist, setWishlist] = useState([]);
  const { toast, showToast, hideToast } = useToast();

  const navigate = useNavigate();

  const THEME_COLOR = "#6E026F";

  const user = JSON.parse(localStorage.getItem("userInfo"));

  const userId = user?._id || null;

  const cartKey = userId ? `cart_${userId}` : "cart_guest";

  // =========================
  // FETCH PRODUCTS
  // =========================
  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get(
        `/products?search=${search}&category=${category}`
      );

      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // LOAD WISHLIST
  // =========================
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    if (!user) return;

    try {
      const { data } = await API.get("/wishlist");

      setWishlist(data);
    } catch (err) {
      console.log("Using localStorage wishlist");

      const wishlistKey = userId
        ? `wishlist_${userId}`
        : "wishlist_guest";

      const localWishlist =
        JSON.parse(localStorage.getItem(wishlistKey)) || [];

      setWishlist(localWishlist);
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
      console.log("Backend failed, using localStorage fallback");

      let cart =
        JSON.parse(localStorage.getItem(cartKey)) || [];

      const index = cart.findIndex(
        (item) => item._id === product._id
      );

      if (index === -1) {
        cart.push({ ...product, qty: 1 });
      } else {
        cart[index].qty += 1;
      }

      localStorage.setItem(
        cartKey,
        JSON.stringify(cart)
      );

      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { key: cartKey },
        })
      );

      showToast("Added to Cart (offline mode)", "success");
    }
  };

  // =========================
  // ADD TO WISHLIST
  // =========================
  const addToWishlist = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Prevent duplicates
    const alreadyExists = wishlist.some(
      (item) =>
        item.productId === product._id ||
        item.productId?._id === product._id ||
        item._id === product._id
    );

    if (alreadyExists) {
      showToast("Already in Wishlist", "info");
      return;
    }

    try {
      await API.post("/wishlist/add", {
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
      });

      // Update UI instantly
      const updatedWishlist = [
        ...wishlist,
        {
          productId: product._id,
          ...product,
        },
      ];

      setWishlist(updatedWishlist);

      window.dispatchEvent(
        new Event("wishlistUpdated")
      );

      showToast("Added to Wishlist", "success");
    } catch (err) {
      console.log(
        "Backend failed, using localStorage fallback"
      );

      const wishlistKey = userId
        ? `wishlist_${userId}`
        : "wishlist_guest";

      let localWishlist =
        JSON.parse(
          localStorage.getItem(wishlistKey)
        ) || [];

      const exists = localWishlist.find(
        (item) => item._id === product._id
      );

      if (!exists) {
        localWishlist.push(product);

        localStorage.setItem(
          wishlistKey,
          JSON.stringify(localWishlist)
        );

        setWishlist(localWishlist);

        window.dispatchEvent(
          new Event("wishlistUpdated")
        );

        showToast("Added to Wishlist (offline)", "success");
      } else {
        showToast("Already in Wishlist", "info");
      }
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <Navbar />

      <div style={styles.contentContainer}>
        {/* HEADER */}
        <header style={styles.header}>
          <div style={styles.badge}>
            <HiOutlineSparkles /> THE 2026 EDIT
          </div>

          <h1 style={styles.mainTitle}>
            LUXY{" "}
            <span
              style={{
                fontWeight: "200",
                color: THEME_COLOR,
              }}
            >
              COLLECTION
            </span>
          </h1>

          <p style={styles.subtitle}>
            Executive Style Without Compromise
          </p>
        </header>

        {/* FILTER BAR */}
        <div
          style={styles.filterBar}
          className="filter-bar"
        >
          <div style={styles.searchWrapper}>
            <FiSearch
              size={18}
              color="#1a1a1a"
            />

            <input
              style={styles.searchInput}
              placeholder="SEARCH PIECES..."
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div style={styles.tabGroup}>
            {[
              "All",
              "Casual",
              "Oversized",
              "Premium",
            ].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={
                  category === c
                    ? styles.activeTab
                    : styles.inactiveTab
                }
                className="category-tab"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT GRID */}
        {products.length > 0 ? (
          <div
            style={styles.grid}
            className="collection-grid"
          >
            {products.map((p) => {
              const isWishlisted =
                wishlist.some(
                  (item) =>
                    item.productId === p._id ||
                    item.productId?._id === p._id ||
                    item._id === p._id
                );

              return (
                <div
                  key={p._id}
                  style={styles.card}
                  className="product-card"
                >
                  {/* IMAGE */}
                  <div
                    style={styles.imageBox}
                    onClick={() =>
                      navigate(`/product/${p._id}`)
                    }
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      style={styles.image}
                    />

                    {/* OVERLAY */}
                    <div
                      style={styles.overlay}
                      className="card-overlay"
                    >
                      <span
                        style={styles.overlayText}
                      >
                        VIEW DETAILS
                      </span>
                    </div>

                    {/* WISHLIST BUTTON */}
                    <button
                      style={styles.wishlistBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToWishlist(p);
                      }}
                    >
                      <FiHeart
                        size={18}
                        color={
                          isWishlisted
                            ? "red"
                            : "#1a1a1a"
                        }
                        fill={
                          isWishlisted
                            ? "red"
                            : "none"
                        }
                      />
                    </button>
                  </div>

                  {/* SEPARATOR */}
                  <div
                    style={styles.separator}
                  ></div>

                  {/* INFO */}
                  <div style={styles.cardInfo}>
                    <div style={styles.metaRow}>
                      <p style={styles.pCategory}>
                        {p.category}
                      </p>

                      <span
                        style={styles.stockLabel}
                      >
                        NEW
                      </span>
                    </div>

                    <h3 style={styles.pName}>
                      {p.name}
                    </h3>

                    <p style={styles.pPrice}>
                      ₹{p.price.toLocaleString()}
                    </p>

                    <div style={styles.actionRow}>
                      <button
                        style={styles.cartBtn}
                        onClick={() =>
                          addToCart(p)
                        }
                        className="action-btn"
                      >
                        <FiShoppingBag size={14} />
                        ADD TO CART
                      </button>

                      <button
                        style={styles.viewBtn}
                        onClick={() =>
                          navigate(
                            `/product/${p._id}`
                          )
                        }
                        className="action-btn-alt"
                      >
                        <FiEye size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.empty}>
            <FiPackage
              size={50}
              color="#eee"
            />

            <h3
              style={{
                color: "#aaa",
                fontWeight: "300",
                letterSpacing: "1px",
              }}
            >
              The selection is currently being
              updated.
            </h3>
          </div>
        )}
      </div>

      <LuxyResponsiveFooter />

      <Toast message={toast.message} type={toast.type} onClose={hideToast} />

      <style>{`
        .collection-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 25px;
        }

        .product-card {
          transition: all 0.4s ease;
          background: #fff;
          display: flex;
          flex-direction: column;
          border-radius: 0;
          border: 1px solid #1a1a1a;
        }

        .product-card:hover {
          transform: translateY(-5px);
          border-color: ${THEME_COLOR};
          box-shadow: 10px 10px 0px rgba(110, 2, 111, 0.1);
        }

        .product-card:hover .card-overlay {
          opacity: 1;
        }

        .action-btn {
          transition: 0.3s;
          background: #1a1a1a;
          color: #fff;
          border: none;
          cursor: pointer;
        }

        .action-btn:hover {
          background: ${THEME_COLOR};
        }

        .action-btn-alt {
          transition: 0.3s;
          background: #f9f9f9;
          color: #1a1a1a;
          border: 1px solid #eee;
          cursor: pointer;
        }

        .action-btn-alt:hover {
          background: #eee;
        }

        @media (max-width: 1100px) {
          .collection-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 850px) {
          .collection-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }

          .filter-bar {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 20px;
          }
        }

        @media (max-width: 500px) {
          .collection-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: "#FFFFFF",
    minHeight: "100vh",
  },

  contentContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "140px 20px 80px",
  },

  header: {
    textAlign: "center",
    marginBottom: "80px",
  },

  badge: {
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "3px",
    color: "#6E026F",
    marginBottom: "15px",
  },

  mainTitle: {
    fontSize: "clamp(24px, 4vw, 40px)",
    fontWeight: "900",
    letterSpacing: "6px",
    color: "#1A1A1A",
    margin: 0,
    textTransform: "uppercase",
  },

  subtitle: {
    color: "#999",
    fontSize: "12px",
    letterSpacing: "2px",
    marginTop: "10px",
    textTransform: "uppercase",
  },

  filterBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "50px",
    borderBottom: "1px solid #eee",
    paddingBottom: "15px",
  },

  searchWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    flex: 1,
  },

  searchInput: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "1px",
    textTransform: "uppercase",
    background: "transparent",
  },

  tabGroup: {
    display: "flex",
    gap: "25px",
  },

  inactiveTab: {
    background: "none",
    border: "none",
    color: "#BBB",
    fontWeight: "700",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    cursor: "pointer",
  },

  activeTab: {
    background: "none",
    border: "none",
    color: "#1a1a1a",
    fontWeight: "900",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderBottom: "2px solid #1a1a1a",
    cursor: "pointer",
  },

  imageBox: {
    position: "relative",
    aspectRatio: "1/1",
    overflow: "hidden",
    cursor: "pointer",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "0.5s ease",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(3px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "0.3s",
  },

  overlayText: {
    background: "#fff",
    padding: "12px 20px",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "2px",
    color: "#1a1a1a",
    boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
  },

  wishlistBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#1a1a1a",
  },

  separator: {
    height: "1px",
    width: "100%",
    backgroundColor: "#1a1a1a",
  },

  cardInfo: {
    padding: "20px 25px",
    textAlign: "left",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },

  pCategory: {
    fontSize: "10px",
    fontWeight: "800",
    color: "#CCC",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: 0,
  },

  stockLabel: {
    fontSize: "9px",
    color: "#6E026F",
    fontWeight: "900",
    letterSpacing: "1px",
  },

  pName: {
    fontSize: "15px",
    fontWeight: "800",
    color: "#1A1A1A",
    margin: "0 0 10px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  pPrice: {
    fontSize: "17px",
    fontWeight: "400",
    color: "#1a1a1a",
    marginBottom: "20px",
  },

  actionRow: {
    display: "flex",
    gap: "10px",
    marginTop: "auto",
  },

  cartBtn: {
    flex: 1,
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontWeight: "900",
    fontSize: "10px",
    letterSpacing: "1px",
  },

  viewBtn: {
    width: "45px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  empty: {
    textAlign: "center",
    padding: "100px 0",
    width: "100%",
  },
};
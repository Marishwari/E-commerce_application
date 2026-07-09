import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Package,
  CheckCircle2,
  Truck,
  Clock,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

const THEME_COLOR = "#6E026F";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userInfo"));

  // =====================================
  // FETCH ORDERS
  // =====================================
  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders/myorders", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      // LATEST ORDER FIRST
      setOrders(data.reverse());
    } catch (err) {
      console.log("Order fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    window.scrollTo(0, 0);

    const refreshOrders = () => fetchOrders();
    window.addEventListener("orderPlaced", refreshOrders);

    return () => {
      window.removeEventListener("orderPlaced", refreshOrders);
    };
  }, []);

  // =====================================
  // STATUS HELPERS
  // =====================================
  const getStatus = (order) => {
    if (!order.isPaid) {
      return { text: "Pending Payment", icon: <Clock size={13} />, color: "#c0392b" };
    }
    if (!order.isDelivered) {
      return { text: "Shipped", icon: <Truck size={13} />, color: "#b9770e" };
    }
    return { text: "Delivered", icon: <CheckCircle2 size={13} />, color: "#1a8a3a" };
  };

  // =====================================
  // LOADING
  // =====================================
  if (loading) {
    return (
      <div style={{ backgroundColor: "#FDFCFE", minHeight: "100vh" }}>
        <Navbar />
        <div style={styles.loading}>Loading Orders...</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#FDFCFE", minHeight: "100vh" }}>
      <Navbar />

      <div style={styles.page} className="orders-page">
        <div style={styles.container}>
          {/* HEADER */}
          <div style={styles.header}>
            <span style={styles.eyebrow}>Order History</span>
            <h1 style={styles.title}>My Orders</h1>
            <p style={styles.subtitle}>Track all your purchases</p>
          </div>

          {/* EMPTY STATE */}
          {orders.length === 0 ? (
            <div style={styles.emptyBox}>
              <Package size={50} color="#ddd" />
              <h2 style={styles.emptyTitle}>No Orders Found</h2>
              <p style={styles.emptyText}>You haven't placed any orders yet.</p>

              <button style={styles.shopBtn} className="shop-btn" onClick={() => navigate("/")}>
                <ShoppingBag size={15} />
                Continue Shopping
              </button>
            </div>
          ) : (
            // =====================================
            // ORDERS LIST
            // =====================================
            <div style={styles.list}>
              {orders.map((order) => {
                const totalItems = order.orderItems?.reduce((acc, item) => acc + item.qty, 0);
                const firstImage = order.orderItems?.[0]?.image;
                const status = getStatus(order);

                return (
                  <div
                    key={order._id}
                    style={styles.card}
                    className="order-card"
                    onClick={() => navigate(`/orders/${order._id}`)}
                  >
                    {/* LEFT */}
                    <div style={styles.leftSection} className="order-left">
                      <img src={firstImage || "/placeholder.png"} alt="order" style={styles.image} />

                      <div>
                        <h3 style={styles.orderId}>Order #{order._id.slice(-6).toUpperCase()}</h3>

                        <p style={styles.orderDate}>
                          Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>

                        <p style={styles.orderItems}>{totalItems} Item(s)</p>

                        <h2 style={styles.total}>₹{Number(order.totalPrice).toLocaleString("en-IN")}</h2>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div style={styles.rightSection} className="order-right">
                      <span style={{ ...styles.badge, borderColor: status.color, color: status.color }}>
                        {status.icon}
                        {status.text}
                      </span>

                      <p style={{ ...styles.subline, color: order.isPaid ? "#1a8a3a" : "#c0392b" }}>
                        {order.isPaid ? "Payment Done" : "Not Paid"}
                      </p>

                      <p style={{ ...styles.subline, color: order.isDelivered ? "#1a8a3a" : "#999" }}>
                        {order.isDelivered ? "Delivered Successfully" : "Delivery In Progress"}
                      </p>

                      <span style={styles.viewLink} className="view-link">
                        View Details <ChevronRight size={14}/>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style>{`
        .order-card:hover {
          border-color: ${THEME_COLOR} !important;
          box-shadow: 8px 8px 0px rgba(110, 2, 111, 0.08);
        }

        .shop-btn:hover {
          background: ${THEME_COLOR} !important;
        }

        @media (max-width: 700px) {
          .order-card {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .order-right {
            align-items: flex-start !important;
            margin-top: 18px;
            padding-top: 18px;
            border-top: 1px solid #eee;
          }
        }

        @media (max-width: 560px) {
          .orders-page {
            padding: 110px 16px 60px !important;
          }

          .order-left {
            gap: 14px !important;
          }
        }
      `}</style>
    </div>
  );
}

// =====================================
// STYLES
// =====================================
const styles = {
  loading: {
    padding: "160px 20px",
    textAlign: "center",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#999",
  },

  page: {
    padding: "140px 20px 80px",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  header: {
    marginBottom: "40px",
    borderBottom: "2px solid #1a1a1a",
    paddingBottom: "26px",
  },

  eyebrow: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "2px",
    color: THEME_COLOR,
    textTransform: "uppercase",
  },

  title: {
    fontSize: "clamp(28px, 4vw, 38px)",
    fontWeight: "900",
    letterSpacing: "1.5px",
    color: "#1a1a1a",
    textTransform: "uppercase",
    margin: "10px 0 8px",
  },

  subtitle: {
    color: "#888",
    fontSize: "13px",
  },

  emptyBox: {
    background: "#fff",
    padding: "70px 30px",
    textAlign: "center",
    border: "1px dashed #ddd",
  },

  emptyTitle: {
    marginTop: "18px",
    fontSize: "18px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#1a1a1a",
  },

  emptyText: {
    color: "#999",
    fontSize: "13px",
    marginTop: "8px",
  },

  shopBtn: {
    marginTop: "26px",
    background: "#1a1a1a",
    color: "#fff",
    border: "2px solid #1a1a1a",
    padding: "14px 26px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "11px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "0.3s",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  card: {
    background: "#fff",
    border: "1px solid #1a1a1a",
    padding: "26px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    cursor: "pointer",
    transition: "0.3s",
    flexWrap: "wrap",
  },

  leftSection: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    flex: 1,
    minWidth: "280px",
  },

  image: {
    width: "100px",
    height: "112px",
    objectFit: "cover",
    border: "1px solid #eee",
    flexShrink: 0,
  },

  orderId: {
    fontSize: "15px",
    fontWeight: "800",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    marginBottom: "6px",
    color: "#1a1a1a",
  },

  orderDate: {
    color: "#999",
    fontSize: "12px",
    marginBottom: "6px",
  },

  orderItems: {
    color: "#666",
    fontSize: "13px",
    marginBottom: "10px",
  },

  total: {
    color: THEME_COLOR,
    fontSize: "20px",
    fontWeight: "900",
    margin: 0,
  },

  rightSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    minWidth: "220px",
  },

  badge: {
    border: "1px solid",
    padding: "7px 14px",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1px",
    textTransform: "uppercase",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },

  subline: {
    fontSize: "12px",
    fontWeight: "600",
    marginTop: "10px",
  },

  viewLink: {
    marginTop: "16px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#1a1a1a",
    display: "inline-flex",
    alignItems: "center",
    gap: "2px",
  },
};
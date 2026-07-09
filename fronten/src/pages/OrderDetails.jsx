import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  CheckCircle,
  Circle,
  Package,
  MapPin,
  CreditCard,
  Receipt,
} from "lucide-react";

const THEME_COLOR = "#6E026F";

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  const user = JSON.parse(localStorage.getItem("userInfo"));

  // =========================================
  // FETCH ORDER
  // =========================================
  const fetchOrder = async () => {
    try {
      const { data } = await API.get(`/orders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setOrder(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrder();
    window.scrollTo(0, 0);
  }, []);

  // =========================================
  // LOADING
  // =========================================
  if (!order) {
    return (
      <div style={{ backgroundColor: "#FDFCFE", minHeight: "100vh" }}>
        <Navbar />
        <div style={styles.loading}>Loading Order...</div>
      </div>
    );
  }

  // =========================================
  // TOTAL ITEMS
  // =========================================
  const totalItems = order.orderItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div style={{ backgroundColor: "#FDFCFE", minHeight: "100vh" }}>
      <Navbar />

      <div style={styles.page} className="order-page">
        <div style={styles.container}>
          {/* PAGE TITLE */}
          <div style={styles.header}>
            <span style={styles.eyebrow}>Order Reference</span>
            <h1 style={styles.title}>Order Details</h1>
            <p style={styles.subtitle}>Track and manage your order</p>
          </div>

          {/* ORDER SUMMARY */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardHeaderTitle}>
                <Receipt size={18} color={THEME_COLOR} />
                <h2 style={styles.sectionTitle}>Order Summary</h2>
              </div>

              <span
                style={{
                  ...styles.statusBadge,
                  borderColor: order.isPaid ? "#1a8a3a" : "#c0392b",
                  color: order.isPaid ? "#1a8a3a" : "#c0392b",
                }}
              >
                {order.isPaid ? "PAID" : "PENDING"}
              </span>
            </div>

            <div style={styles.grid} className="info-grid">
              <InfoBox label="Order ID" value={order._id} />
              <InfoBox
                label="Total Amount"
                value={`₹${Number(order.totalPrice).toLocaleString("en-IN")}`}
              />
              <InfoBox label="Items" value={`${totalItems} Item(s)`} />
              <InfoBox label="Payment Method" value={order.paymentMethod || "Razorpay"} />
              <InfoBox label="Payment Status" value={order.isPaid ? "Completed" : "Pending"} />
              <InfoBox label="Delivery Status" value={order.isDelivered ? "Delivered" : "In Transit"} />
              <InfoBox
                label="Ordered On"
                value={new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
              <InfoBox
                label="Paid At"
                value={order.paidAt ? new Date(order.paidAt).toLocaleDateString("en-IN") : "Not Paid"}
              />
            </div>
          </div>

          {/* SHIPPING ADDRESS */}
          <div style={styles.card}>
            <div style={styles.cardHeaderTitle}>
              <MapPin size={18} color={THEME_COLOR} />
              <h2 style={styles.sectionTitle}>Shipping Address</h2>
            </div>

            <div style={styles.addressBox}>
              <p style={styles.addressLine}>{order.shippingAddress?.fullAddress}</p>
              <p style={styles.addressLine}>{order.shippingAddress?.city}</p>
              <p style={styles.addressLine}>{order.shippingAddress?.state}</p>
              <p style={styles.addressLine}>{order.shippingAddress?.pincode}</p>
              <p style={styles.addressLine}>{order.shippingAddress?.country}</p>
            </div>
          </div>

          {/* ORDER ITEMS */}
          <div style={styles.card}>
            <div style={styles.cardHeaderTitle}>
              <Package size={18} color={THEME_COLOR} />
              <h2 style={styles.sectionTitle}>Ordered Items</h2>
            </div>

            {order.orderItems.map((item, index) => (
              <div key={index} style={styles.itemCard} className="item-card">
                <img src={item.image || "/placeholder.png"} alt={item.name} style={styles.image} />

                <div style={styles.itemInfo}>
                  <h3 style={styles.productName}>{item.name}</h3>

                  <p style={styles.itemLine}>
                    Quantity <strong>{item.qty}</strong>
                  </p>

                  <p style={styles.itemLine}>
                    Price <strong>₹{Number(item.price).toLocaleString("en-IN")}</strong>
                  </p>

                  <p style={styles.itemLine}>
                    Subtotal{" "}
                    <strong>
                      ₹{(Number(item.price) * Number(item.qty)).toLocaleString("en-IN")}
                    </strong>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* PAYMENT DETAILS */}
          <div style={styles.card}>
            <div style={styles.cardHeaderTitle}>
              <CreditCard size={18} color={THEME_COLOR} />
              <h2 style={styles.sectionTitle}>Payment Details</h2>
            </div>

            <div style={styles.grid} className="info-grid">
              <InfoBox label="Payment ID" value={order.paymentResult?.id || "N/A"} />
              <InfoBox label="Payment Status" value={order.paymentResult?.status || "Pending"} />
              <InfoBox
                label="Customer Email"
                value={order.paymentResult?.email_address || user?.email}
              />
              <InfoBox
                label="Payment Time"
                value={
                  order.paymentResult?.update_time
                    ? new Date(order.paymentResult.update_time).toLocaleString("en-IN")
                    : "N/A"
                }
              />
            </div>
          </div>

          {/* ORDER TIMELINE */}
          <div style={{ ...styles.card, marginBottom: 0 }}>
            <h2 style={styles.sectionTitle}>Order Timeline</h2>

            <div style={styles.timeline}>
              <TimelineStep active={true} text="Order Placed" />
              <TimelineStep active={order.isPaid} text="Payment Completed" />
              <TimelineStep active={order.isDelivered} text="Delivered" />
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 850px) {
          .info-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 560px) {
          .order-page {
            padding: 110px 16px 60px !important;
          }

          .info-grid {
            grid-template-columns: 1fr !important;
          }

          .item-card {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

// =========================================
// INFO BOX COMPONENT
// =========================================
const InfoBox = ({ label, value }) => (
  <div style={styles.infoBox}>
    <p style={styles.infoLabel}>{label}</p>
    <h4 style={styles.infoValue}>{value}</h4>
  </div>
);

// =========================================
// TIMELINE COMPONENT
// =========================================
const TimelineStep = ({ active, text }) => (
  <div style={{ ...styles.timelineItem, color: active ? THEME_COLOR : "#bbb" }}>
    {active ? (
      <CheckCircle size={18} color={THEME_COLOR} strokeWidth={2} />
    ) : (
      <Circle size={18} color="#ddd" strokeWidth={2} />
    )}
    {text}
  </div>
);

// =========================================
// STYLES
// =========================================
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
    maxWidth: "1000px",
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
    fontSize: "clamp(26px, 4vw, 36px)",
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

  card: {
    background: "#fff",
    border: "1px solid #1a1a1a",
    padding: "30px",
    marginBottom: "24px",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },

  cardHeaderTitle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "24px",
  },

  statusBadge: {
    padding: "7px 16px",
    border: "1px solid",
    fontWeight: "800",
    fontSize: "11px",
    letterSpacing: "1px",
  },

  sectionTitle: {
    fontSize: "16px",
    fontWeight: "800",
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#1a1a1a",
    margin: 0,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1px",
    background: "#eee",
    border: "1px solid #eee",
  },

  infoBox: {
    background: "#fff",
    padding: "16px 18px",
  },

  infoLabel: {
    color: "#999",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginBottom: "8px",
  },

  infoValue: {
    fontSize: "14px",
    wordBreak: "break-word",
    color: "#1a1a1a",
    fontWeight: "600",
    margin: 0,
  },

  addressBox: {
    color: "#444",
    fontSize: "14px",
    lineHeight: "1.8",
  },

  addressLine: {
    margin: 0,
  },

  itemCard: {
    display: "flex",
    gap: "20px",
    borderBottom: "1px solid #eee",
    paddingBottom: "20px",
    marginBottom: "20px",
  },

  image: {
    width: "110px",
    height: "120px",
    objectFit: "cover",
    border: "1px solid #eee",
    flexShrink: 0,
  },

  itemInfo: {
    flex: 1,
  },

  productName: {
    marginBottom: "10px",
    fontSize: "16px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#1a1a1a",
  },

  itemLine: {
    fontSize: "13px",
    color: "#777",
    margin: "4px 0",
  },

  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginTop: "20px",
  },

  timelineItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "700",
    fontSize: "13px",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
};
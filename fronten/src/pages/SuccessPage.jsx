import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Package } from "lucide-react";

const THEME_COLOR = "#6E026F";

export default function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.iconCircle}>
          <CheckCircle size={36} color={THEME_COLOR} strokeWidth={2} />
        </div>

        <span style={styles.eyebrow}>Order Confirmed</span>
        <h1 style={styles.title}>Payment Successful</h1>
        <p style={styles.text}>
          Thank you for your purchase. Your order has been placed and is now being prepared.
        </p>

        <div style={styles.divider} />

        <div style={styles.actions}>
          <button
            style={styles.primaryBtn}
            className="primary-btn"
            onClick={() => navigate("/collection")}
          >
            Continue Shopping
            <ArrowRight size={16} />
          </button>

          <button
            style={styles.secondaryBtn}
            className="secondary-btn"
            onClick={() => navigate("/orders")}
          >
            <Package size={15} />
            View Orders
          </button>
        </div>
      </div>

      <style>{`
        .primary-btn:hover {
          background: ${THEME_COLOR} !important;
          border-color: ${THEME_COLOR} !important;
        }

        .secondary-btn:hover {
          background: #f5f5f5 !important;
        }

        @media (max-width: 480px) {
          .success-actions {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDFCFE",
    padding: "20px",
    fontFamily: "'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },

  card: {
    background: "#fff",
    border: "1px solid #1a1a1a",
    padding: "60px 50px",
    maxWidth: "460px",
    width: "100%",
    textAlign: "center",
  },

  iconCircle: {
    width: "76px",
    height: "76px",
    borderRadius: "50%",
    border: `2px solid ${THEME_COLOR}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 26px",
  },

  eyebrow: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "2px",
    color: THEME_COLOR,
    textTransform: "uppercase",
  },

  title: {
    fontSize: "26px",
    fontWeight: "900",
    letterSpacing: "1px",
    color: "#1a1a1a",
    textTransform: "uppercase",
    margin: "12px 0 14px",
  },

  text: {
    color: "#777",
    fontSize: "14px",
    lineHeight: "1.7",
    marginBottom: "0",
  },

  divider: {
    height: "1px",
    background: "#eee",
    margin: "32px 0 30px",
  },

  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  primaryBtn: {
    width: "100%",
    padding: "16px",
    background: "#1a1a1a",
    color: "#fff",
    border: "2px solid #1a1a1a",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "11px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "0.3s",
  },

  secondaryBtn: {
    width: "100%",
    padding: "16px",
    background: "#fff",
    color: "#1a1a1a",
    border: "1px solid #ddd",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "11px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "0.3s",
  },
};
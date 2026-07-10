import { useEffect } from "react";
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiX } from "react-icons/fi";

const CONFIG = {
  success: { icon: FiCheckCircle, color: "#1E9E5A", bg: "#EAFBF1" },
  error:   { icon: FiXCircle,     color: "#D93636", bg: "#FDECEC" },
  warning: { icon: FiAlertTriangle, color: "#C87F0A", bg: "#FFF6E8" },
  info:    { icon: FiInfo,        color: "#6E026F", bg: "#F7E9F7" },
};

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 2800);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  const { icon: Icon, color, bg } = CONFIG[type] || CONFIG.info;

  return (
    <div style={styles.wrapper} className="luxy-toast">
      <div style={{ ...styles.iconWrap, background: bg }}>
        <Icon size={16} color={color} />
      </div>

      <span style={styles.text}>{message}</span>

      <button style={styles.closeBtn} onClick={onClose} aria-label="Dismiss">
        <FiX size={14} />
      </button>

      <div style={{ ...styles.accent, background: color }} />

      <style>{`
        .luxy-toast {
          animation: luxyToastIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        @keyframes luxyToastIn {
          from { opacity: 0; transform: translate(-50%, 14px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#1a1a1a",
    color: "#fff",
    padding: "14px 18px",
    paddingRight: "40px",
    fontSize: "12.5px",
    fontWeight: "600",
    letterSpacing: "0.3px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    zIndex: 3000,
    borderRadius: "3px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
    minWidth: "260px",
    maxWidth: "90vw",
  },
  iconWrap: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  text: {
    flex: 1,
  },
  closeBtn: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#aaa",
    cursor: "pointer",
    display: "flex",
    padding: "4px",
  },
  accent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "4px",
    borderTopLeftRadius: "3px",
    borderBottomLeftRadius: "3px",
  },
};
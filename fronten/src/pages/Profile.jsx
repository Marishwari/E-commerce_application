import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Package,
  LogOut,
  Edit3,
  Save,
  ShoppingBag,
  Heart,
  Phone,
  Mail,
  Check,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api";

const THEME_COLOR = "#6E026F";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // =========================
  // PROFILE STATES
  // =========================
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // =========================
  // ADDRESS STATES
  // =========================
  const [fullAddress, setFullAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("India");

  // =========================
  // UI STATES
  // =========================
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // =========================
  // COUNTS
  // =========================
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  // =========================
  // LOAD PROFILE DATA
  // =========================
  const loadProfileData = async () => {
    try {
      const storedUser =
        JSON.parse(localStorage.getItem("userInfo")) ||
        JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        navigate("/login");
        return;
      }

      setUser(storedUser);

      // BASIC INFO
      setName(storedUser.name || "");
      setEmail(storedUser.email || "");
      setPhone(storedUser.phone || "");

      // ADDRESS
      setFullAddress(storedUser?.address?.fullAddress || "");
      setCity(storedUser?.address?.city || "");
      setState(storedUser?.address?.state || "");
      setPincode(storedUser?.address?.pincode || "");
      setCountry(storedUser?.address?.country || "India");

      const token = storedUser.token;

      // CART COUNT
      try {
        const cartRes = await API.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const cartItems = cartRes.data.items || [];
        const total = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);
        setCartCount(total);
      } catch (err) {
        console.log("Cart fetch failed");
      }

      // WISHLIST COUNT
      try {
        const wishlistRes = await API.get("/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const wishlistItems = Array.isArray(wishlistRes.data)
          ? wishlistRes.data
          : wishlistRes.data.items || [];

        setWishlistCount(wishlistItems.length);
      } catch (err) {
        console.log("Wishlist fetch failed");
      }

      // ORDER COUNT
      try {
        const orderRes = await API.get("/orders/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrderCount(orderRes.data.length || 0);
      } catch (err) {
        console.log("Order fetch failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      const token = user.token;

      const { data } = await API.put(
        "/auth/profile",
        {
          name,
          phone,
          address: { fullAddress, city, state, pincode, country },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      setEditing(false);

      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (err) {
      console.log(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // =========================
  // EFFECT
  // =========================
  useEffect(() => {
    loadProfileData();
    window.scrollTo(0, 0);

    const refreshProfile = () => {
      loadProfileData();
    };

    window.addEventListener("orderPlaced", refreshProfile);
    window.addEventListener("cartUpdated", refreshProfile);

    return () => {
      window.removeEventListener("orderPlaced", refreshProfile);
      window.removeEventListener("cartUpdated", refreshProfile);
    };
  }, []);

  return (
    <div style={{ backgroundColor: "#FDFCFE", minHeight: "100vh" }}>
      <Navbar />

      <div style={styles.pageContainer} className="page-container">
        {/* HEADER */}
        <header style={styles.header} className="profile-header">
          <span style={styles.eyebrow}>EXECUTIVE PROFILE</span>
          <h1 style={styles.title}>MY ACCOUNT</h1>
          <p style={styles.subtitle}>Manage your details &amp; preferences</p>
        </header>

        <div style={styles.mainGrid} className="profile-grid">
          {/* SIDEBAR */}
          <aside style={styles.sidebarColumn} className="sidebar-column">
            <div style={styles.profileCard} className="profile-card">
              <div style={styles.avatarSection}>
                <div style={styles.avatarCircle}>
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <h2 style={styles.userName}>{user?.name || "Guest"}</h2>
                <p style={styles.userTier}>GOLD MEMBER</p>
              </div>

              {/* SIDEBAR NAV */}
              <div style={styles.navGroup} className="nav-group">
                <SidebarLink icon={<User size={17} />} label="Personal Data" active />

                <SidebarLink
                  icon={<Package size={17} />}
                  label="Orders"
                  onClick={() => navigate("/orders")}
                />

                <SidebarLink
                  icon={<Heart size={17} />}
                  label="Wishlist"
                  onClick={() => navigate("/wishlist")}
                />
              </div>

              {/* LOGOUT */}
              <button onClick={handleLogout} style={styles.logoutBtn} className="logout-btn">
                <LogOut size={15} />
                Logout
              </button>
            </div>
          </aside>

          {/* CONTENT */}
          <div style={styles.contentColumn}>
            {/* PROFILE SECTION */}
            <div style={styles.infoSection} className="info-section">
              <div style={styles.sectionHeader} className="section-header">
                <h3 style={styles.sectionTitle}>Profile Information</h3>

                <button
                  style={styles.editBtn}
                  className="edit-btn"
                  onClick={() => {
                    if (editing) {
                      handleSaveProfile();
                    } else {
                      setEditing(true);
                    }
                  }}
                >
                  {saved ? (
                    <>
                      <Check size={15} /> Saved
                    </>
                  ) : editing ? (
                    <>
                      <Save size={15} />
                      {loading ? "Saving..." : "Save"}
                    </>
                  ) : (
                    <>
                      <Edit3 size={15} />
                      Edit
                    </>
                  )}
                </button>
              </div>

              <DataField label="Full Name" value={name} editing={editing} onChange={(e) => setName(e.target.value)} />

              <DataField label="Email" value={email} icon={<Mail size={13} />} />

              <DataField
                label="Phone"
                value={phone}
                editing={editing}
                onChange={(e) => setPhone(e.target.value)}
                icon={<Phone size={13} />}
              />

              <DataField
                label="Full Address"
                value={fullAddress}
                editing={editing}
                onChange={(e) => setFullAddress(e.target.value)}
              />

              <div style={styles.fieldRow} className="field-row">
                <DataField label="City" value={city} editing={editing} onChange={(e) => setCity(e.target.value)} />
                <DataField label="State" value={state} editing={editing} onChange={(e) => setState(e.target.value)} />
              </div>

              <div style={styles.fieldRow} className="field-row">
                <DataField
                  label="Pincode"
                  value={pincode}
                  editing={editing}
                  onChange={(e) => setPincode(e.target.value)}
                />
                <DataField
                  label="Country"
                  value={country}
                  editing={editing}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>

            {/* METRICS */}
            <div style={styles.metricsRow} className="metrics-row">
              <MetricTile icon={<ShoppingBag size={19} />} val={cartCount} label="Cart Items" />
              <MetricTile icon={<Heart size={19} />} val={wishlistCount} label="Wishlist" />
              <MetricTile icon={<Package size={19} />} val={orderCount} label="Orders" />
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        .logout-btn:hover { background: ${THEME_COLOR}; }
        .edit-btn:hover { background: #50025f; }
        .nav-item:hover { color: ${THEME_COLOR} !important; }

        @media (max-width: 900px) {
          .profile-grid {
            flex-direction: column;
          }

          .sidebar-column {
            width: 100% !important;
            flex: 1 1 auto !important;
          }

          .metrics-row {
            flex-wrap: wrap !important;
          }

          .metric-tile {
            min-width: 150px !important;
          }
        }

        @media (max-width: 560px) {
          .page-container {
            padding: 110px 16px 60px !important;
          }

          .profile-header {
            text-align: center;
          }

          .info-section,
          .profile-card {
            padding: 22px !important;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 14px;
          }

          .edit-btn {
            width: 100%;
            justify-content: center;
          }

          .field-row {
            grid-template-columns: 1fr !important;
          }

          .metrics-row {
            flex-direction: column !important;
          }

          .nav-group {
            flex-direction: row !important;
            flex-wrap: wrap;
            gap: 8px !important;
          }

          .nav-item {
            flex: 1 1 auto;
            justify-content: center;
            padding: 10px !important;
            border-left: none !important;
            border-bottom: 2px solid transparent;
          }
        }
      `}</style>
    </div>
  );
}

// =========================
// COMPONENTS
// =========================

const SidebarLink = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className="nav-item"
    style={{
      ...styles.navItem,
      color: active ? THEME_COLOR : "#444",
      borderLeft: active ? `2px solid ${THEME_COLOR}` : "2px solid transparent",
    }}
  >
    {icon}
    <span>{label}</span>
  </div>
);

const DataField = ({ label, value, editing, onChange, icon }) => (
  <div style={styles.fieldBox}>
    <label style={styles.fieldLabel}>{label}</label>

    {editing ? (
      <input value={value || ""} onChange={onChange} style={styles.input} />
    ) : (
      <div style={styles.valueRow}>
        {icon}
        <p style={styles.fieldValue}>{value || "Not Added"}</p>
      </div>
    )}
  </div>
);

const MetricTile = ({ icon, val, label }) => (
  <div style={styles.metricTile} className="metric-tile">
    <div style={{ color: THEME_COLOR }}>{icon}</div>

    <div>
      <h4 style={styles.metricValue}>{val}</h4>
      <p style={styles.metricLabel}>{label}</p>
    </div>
  </div>
);

// =========================
// STYLES
// =========================

const styles = {
  pageContainer: {
    padding: "140px 20px 80px",
    maxWidth: "1300px",
    margin: "0 auto",
  },

  header: {
    marginBottom: "50px",
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
    fontSize: "clamp(28px, 4vw, 40px)",
    fontWeight: "900",
    letterSpacing: "3px",
    margin: "10px 0 8px",
    color: "#1a1a1a",
    textTransform: "uppercase",
  },

  subtitle: {
    color: "#888",
    fontSize: "13px",
    letterSpacing: "0.5px",
  },

  mainGrid: {
    display: "flex",
    gap: "40px",
    alignItems: "flex-start",
  },

  sidebarColumn: {
    flex: "0 0 280px",
    width: "280px",
  },

  contentColumn: {
    flex: 1,
    minWidth: 0,
  },

  profileCard: {
    background: "#fff",
    padding: "30px",
    border: "1px solid #1a1a1a",
  },

  avatarSection: {
    textAlign: "center",
    marginBottom: "28px",
    paddingBottom: "28px",
    borderBottom: "1px solid #eee",
  },

  avatarCircle: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    margin: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    backgroundColor: THEME_COLOR,
    fontSize: "26px",
    fontWeight: "800",
  },

  userName: {
    marginTop: "14px",
    fontWeight: "800",
    fontSize: "17px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#1a1a1a",
  },

  userTier: {
    color: THEME_COLOR,
    fontSize: "11px",
    marginTop: "5px",
    letterSpacing: "1.5px",
    fontWeight: "700",
  },

  navGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  navItem: {
    display: "flex",
    gap: "12px",
    cursor: "pointer",
    fontWeight: "700",
    alignItems: "center",
    padding: "12px 14px",
    fontSize: "12px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    transition: "0.3s",
  },

  logoutBtn: {
    marginTop: "30px",
    padding: "14px",
    width: "100%",
    border: "none",
    background: "#1a1a1a",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontWeight: "800",
    fontSize: "11px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    transition: "0.3s",
  },

  infoSection: {
    background: "#fff",
    padding: "34px",
    border: "1px solid #1a1a1a",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
    paddingBottom: "20px",
    borderBottom: "1px solid #eee",
  },

  sectionTitle: {
    fontWeight: "800",
    fontSize: "16px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#1a1a1a",
    margin: 0,
  },

  editBtn: {
    border: "none",
    background: THEME_COLOR,
    color: "#fff",
    padding: "11px 18px",
    cursor: "pointer",
    display: "flex",
    gap: "8px",
    alignItems: "center",
    fontWeight: "800",
    fontSize: "11px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    transition: "0.3s",
  },

  fieldRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0 24px",
  },

  fieldBox: {
    marginTop: "24px",
  },

  fieldLabel: {
    fontSize: "11px",
    color: "#999",
    fontWeight: "800",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },

  fieldValue: {
    marginTop: "6px",
    fontSize: "14px",
    color: "#1a1a1a",
  },

  valueRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    marginTop: "6px",
    color: "#999",
  },

  input: {
    width: "100%",
    marginTop: "8px",
    padding: "12px",
    border: "1px solid #1a1a1a",
    outline: "none",
    fontSize: "14px",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },

  metricsRow: {
    display: "flex",
    gap: "20px",
    marginTop: "24px",
  },

  metricTile: {
    background: "#fff",
    padding: "22px",
    border: "1px solid #1a1a1a",
    display: "flex",
    gap: "14px",
    flex: 1,
    alignItems: "center",
  },

  metricValue: {
    fontSize: "22px",
    fontWeight: "900",
    color: "#1a1a1a",
    margin: 0,
  },

  metricLabel: {
    color: "#888",
    fontSize: "11px",
    marginTop: "3px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
};
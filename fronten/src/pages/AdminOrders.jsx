import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Users,
  LogOut,
  Loader2,
  PackageSearch,
  ShieldCheck,
  Mail,
  UserMinus,
  Search,
  X,
  Check,
  Menu,
  AlertTriangle,
} from "lucide-react";
import API from "../api";

const THEME_COLOR = "#6E026F";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("inventory");
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState("");

  const [productSearch, setProductSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
    category: "Casual",
    description: "",
    stock: "",
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user || !user.isAdmin) navigate("/home");
    fetchProducts();
    fetchUsers();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/auth/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_preset");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/davlmhbpm/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setProduct((prev) => ({ ...prev, image: data.secure_url }));
      showToast("Image uploaded");
    } catch (err) {
      showToast("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!product.image) return showToast("Upload an image first");
    if (!product.name || !product.price) return showToast("Name and price are required");

    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, product);
        showToast("Product updated");
        setEditingId(null);
      } else {
        await API.post("/products", product);
        showToast("Product added");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      showToast("Something went wrong");
    }
  };

  const resetForm = () => {
    setProduct({ name: "", price: "", image: "", category: "Casual", description: "", stock: "" });
    setEditingId(null);
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Delete product?")) {
      await API.delete(`/products/${id}`);
      showToast("Product deleted");
      fetchProducts();
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Permanently delete this user?")) {
      await API.delete(`/auth/users/${id}`);
      showToast("User deleted");
      fetchUsers();
    }
  };

  const makeAdmin = async (id) => {
    await API.put(`/auth/users/admin/${id}`);
    showToast("Role updated");
    fetchUsers();
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* MOBILE TOPBAR */}
      <div style={styles.mobileTopbar} className="mobile-topbar">
        <div style={styles.mobileLogo}>
          <ShieldCheck size={20} />
          Admin Panel
        </div>
        <div onClick={() => setSidebarOpen(!sidebarOpen)} style={{ cursor: "pointer" }}>
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </div>
      </div>

      {/* SIDEBAR */}
      <aside style={styles.sidebar} className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div style={{ padding: "30px 22px" }}>
          <h2 style={styles.logo}>
            <ShieldCheck size={24} />
            Admin Panel
          </h2>

          <nav style={styles.nav}>
            <div
              style={activeTab === "inventory" ? styles.activeNavItem : styles.navItem}
              onClick={() => {
                setActiveTab("inventory");
                setSidebarOpen(false);
              }}
            >
              <PackageSearch size={18} /> Inventory
            </div>

            <div
              style={activeTab === "customers" ? styles.activeNavItem : styles.navItem}
              onClick={() => {
                setActiveTab("customers");
                setSidebarOpen(false);
              }}
            >
              <Users size={18} /> Customers
            </div>

            <div style={styles.exitItem} onClick={() => navigate("/home")}>
              <LogOut size={18} /> Exit Store
            </div>
          </nav>
        </div>
      </aside>

      {sidebarOpen && (
        <div style={styles.mobileOverlay} className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* MAIN CONTENT */}
      <main style={styles.main} className="main-content">
        <header style={styles.header} className="page-header">
          <h1 style={styles.pageTitle}>
            {activeTab === "inventory" ? "Product Management" : "User Directory"}
          </h1>

          <div style={styles.statRow} className="stat-row">
            <StatCard label="Products" value={products.length} />
            <StatCard label="Users" value={users.length} />
          </div>
        </header>

        {activeTab === "inventory" ? (
          <div style={styles.grid} className="dashboard-grid">
            {/* PRODUCT FORM */}
            <section style={styles.card} className="dashboard-card">
              <div style={styles.formHeader}>
                <h3 style={styles.cardTitle}>{editingId ? "Edit Item" : "New Item"}</h3>
                {editingId && (
                  <button style={styles.cancelEditBtn} onClick={resetForm}>
                    <X size={13} /> Cancel
                  </button>
                )}
              </div>

              <div style={styles.formStack}>
                <input
                  name="name"
                  style={styles.input}
                  placeholder="Product Name"
                  value={product.name}
                  onChange={handleChange}
                />

                <div style={styles.fieldRow} className="field-row">
                  <input
                    name="price"
                    style={styles.input}
                    placeholder="Price (₹)"
                    value={product.price}
                    onChange={handleChange}
                  />
                  <input
                    name="stock"
                    style={styles.input}
                    placeholder="Stock Qty"
                    type="number"
                    value={product.stock}
                    onChange={handleChange}
                  />
                </div>

                <label style={styles.uploadLabel} className="upload-label">
                  {uploading ? <Loader2 size={17} className="spin" /> : <Upload size={17} />}
                  {product.image ? "Change Image" : "Upload Image"}
                  <input type="file" hidden onChange={(e) => handleImageUpload(e.target.files[0])} />
                </label>

                {product.image && (
                  <div style={styles.previewWrap}>
                    <img src={product.image} style={styles.preview} alt="preview" />
                    <button
                      style={styles.removeImgBtn}
                      onClick={() => setProduct((prev) => ({ ...prev, image: "" }))}
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}

                <select name="category" style={styles.input} value={product.category} onChange={handleChange}>
                  <option>Casual</option>
                  <option>Oversized</option>
                  <option>Premium</option>
                </select>

                <textarea
                  name="description"
                  style={{ ...styles.input, height: "80px", resize: "vertical" }}
                  placeholder="Description"
                  value={product.description}
                  onChange={handleChange}
                />

                <button onClick={handleSubmit} style={styles.primaryBtn} className="primary-btn">
                  {editingId ? <Edit2 size={16} /> : <Plus size={16} />}
                  {editingId ? "Update Product" : "Add Product"}
                </button>
              </div>
            </section>

            {/* PRODUCT LIST */}
            <section style={styles.card} className="dashboard-card">
              <div style={styles.listHeader} className="list-header">
                <h3 style={styles.cardTitle}>Live Inventory ({filteredProducts.length})</h3>

                <div style={styles.searchBox} className="search-box">
                  <Search size={14} color="#999" />
                  <input
                    style={styles.searchInput}
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.productGrid} className="product-grid">
                {filteredProducts.map((p) => {
                  const lowStock = p.stock !== undefined && p.stock !== "" && Number(p.stock) <= 5;

                  return (
                    <div key={p._id} style={styles.productCard} className="product-card">
                      <div style={styles.productImgWrap}>
                        <img src={p.image} alt="" style={styles.productImg} />
                        {lowStock && (
                          <span style={styles.lowStockBadge}>
                            <AlertTriangle size={10} /> Low Stock
                          </span>
                        )}
                      </div>

                      <div style={{ padding: "14px" }}>
                        <p style={styles.productCategory}>{p.category}</p>
                        <h5 style={styles.productName}>{p.name}</h5>
                        <p style={styles.productPrice}>₹{p.price}</p>

                        {p.stock !== undefined && p.stock !== "" && (
                          <p style={styles.stockText}>{p.stock} in stock</p>
                        )}

                        <div style={styles.actionGroup}>
                          <button
                            onClick={() => {
                              setProduct(p);
                              setEditingId(p._id);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            style={styles.iconBtn}
                            className="icon-btn"
                          >
                            <Edit2 size={13} />
                          </button>

                          <button
                            onClick={() => deleteProduct(p._id)}
                            style={{ ...styles.iconBtn, color: "#c0392b" }}
                            className="icon-btn-danger"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <p style={styles.emptyText}>No products match your search.</p>
                )}
              </div>
            </section>
          </div>
        ) : (
          /* CUSTOMERS SECTION */
          <section style={styles.card} className="dashboard-card">
            <div style={styles.listHeader} className="list-header">
              <h3 style={styles.cardTitle}>All Users ({filteredUsers.length})</h3>

              <div style={styles.searchBox} className="search-box">
                <Search size={14} color="#999" />
                <input
                  style={styles.searchInput}
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            {/* DESKTOP/TABLET TABLE VIEW */}
            <div style={{ overflowX: "auto" }} className="user-table-wrap">
              <table style={styles.table}>
                <thead>
                  <tr style={styles.theadRow}>
                    <th style={styles.th}>Customer</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id} style={styles.tr} className="table-row">
                      <td style={styles.td}>
                        <div style={styles.tdFlex}>
                          <Users size={15} color={THEME_COLOR} />
                          {u.name}
                        </div>
                      </td>

                      <td style={styles.td}>
                        <div style={styles.tdFlex}>
                          <Mail size={15} color="#999" />
                          {u.email}
                        </div>
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.roleBadge,
                            borderColor: u.isAdmin ? THEME_COLOR : "#1a8a3a",
                            color: u.isAdmin ? THEME_COLOR : "#1a8a3a",
                          }}
                        >
                          {u.isAdmin ? "Admin" : "Customer"}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          {!u.isAdmin && (
                            <button
                              onClick={() => makeAdmin(u._id)}
                              style={styles.tableBtn}
                              className="table-btn-promote"
                              title="Promote to admin"
                            >
                              <ShieldCheck size={15} />
                            </button>
                          )}

                          <button
                            onClick={() => deleteUser(u._id)}
                            style={{ ...styles.tableBtn, color: "#c0392b" }}
                            className="table-btn-delete"
                            title="Delete user"
                          >
                            <UserMinus size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ ...styles.td, textAlign: "center", color: "#999" }}>
                        No users match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="user-cards-mobile">
              {filteredUsers.map((u) => (
                <div key={u._id} style={styles.userCard} className="user-card">
                  <div style={styles.userCardTop}>
                    <div style={styles.userCardAvatar}>
                      <Users size={16} color={THEME_COLOR} />
                    </div>

                    <div style={styles.userCardInfo}>
                      <p style={styles.userCardName}>{u.name}</p>
                      <div style={styles.userCardEmailRow}>
                        <Mail size={12} color="#999" />
                        <span style={styles.userCardEmail}>{u.email}</span>
                      </div>
                    </div>

                    <span
                      style={{
                        ...styles.roleBadge,
                        borderColor: u.isAdmin ? THEME_COLOR : "#1a8a3a",
                        color: u.isAdmin ? THEME_COLOR : "#1a8a3a",
                      }}
                    >
                      {u.isAdmin ? "Admin" : "Customer"}
                    </span>
                  </div>

                  <div style={styles.userCardActions}>
                    {!u.isAdmin && (
                      <button
                        onClick={() => makeAdmin(u._id)}
                        style={styles.userCardBtn}
                        className="table-btn-promote"
                      >
                        <ShieldCheck size={14} /> Make Admin
                      </button>
                    )}

                    <button
                      onClick={() => deleteUser(u._id)}
                      style={{ ...styles.userCardBtn, color: "#c0392b", borderColor: "#f5c6c0" }}
                      className="table-btn-delete"
                    >
                      <UserMinus size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <p style={{ ...styles.emptyText, textAlign: "center" }}>No users match your search.</p>
              )}
            </div>
          </section>
        )}
      </main>

      {/* TOAST */}
      {toast && (
        <div style={styles.toast} className="admin-toast">
          <Check size={15} /> {toast}
        </div>
      )}

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .primary-btn:hover { background: #50025f !important; }
        .icon-btn:hover { background: #ececec !important; }
        .icon-btn-danger:hover { background: #fdecea !important; }
        .table-row:hover { background: #fafafa; }
        .table-btn-promote:hover { background: #e8f8ee !important; }
        .table-btn-delete:hover { background: #fdecea !important; }
        .product-card:hover { border-color: ${THEME_COLOR} !important; }
        .user-card:hover { border-color: ${THEME_COLOR} !important; }

        .admin-toast {
          animation: toastIn 0.3s ease;
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        .mobile-topbar { display: none; }
        .mobile-overlay { display: none; }

        /* Mobile card view hidden by default; shown only on small screens */
        .user-cards-mobile { display: none; }

        /* ============================
           TABLET / SMALL LAPTOP
        ============================ */
        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }

          .main-content {
            padding: 28px 24px !important;
          }
        }

        /* ============================
           MOBILE — SIDEBAR SWITCH
        ============================ */
        @media (max-width: 768px) {
          .mobile-topbar {
            display: flex !important;
          }

          .sidebar {
            position: fixed !important;
            top: 0;
            left: 0;
            height: 100vh;
            width: 260px;
            transform: translateX(-100%);
            transition: transform 0.35s ease;
            z-index: 1000;
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .mobile-overlay {
            display: block !important;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 999;
          }

          .main-content {
            padding: 20px 16px !important;
          }

          .page-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 14px !important;
            margin-bottom: 24px !important;
          }

          .stat-row {
            width: 100%;
            gap: 10px !important;
          }

          .dashboard-card {
            padding: 18px !important;
          }

          .list-header {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .search-box {
            width: 100% !important;
            min-width: 0 !important;
            box-sizing: border-box;
          }

          .upload-label {
            font-size: 11px !important;
            padding: 14px 10px !important;
            text-align: center;
            flex-wrap: wrap;
          }

          /* Swap table for cards on mobile */
          .user-table-wrap {
            display: none !important;
          }

          .user-cards-mobile {
            display: flex !important;
            flex-direction: column;
            gap: 12px;
          }
        }

        /* ============================
           SMALL PHONES
        ============================ */
        @media (max-width: 560px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }

          .field-row {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }

          .main-content {
            padding: 16px 12px !important;
          }

          .dashboard-card {
            padding: 14px !important;
          }
        }

        @media (max-width: 400px) {
          .product-grid {
            grid-template-columns: 1fr !important;
          }

          .admin-toast {
            left: 12px !important;
            right: 12px !important;
            transform: none !important;
            bottom: 16px !important;
            width: auto !important;
            max-width: none !important;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statLabel}>{label}</p>
      <h2 style={styles.statValue}>{value}</h2>
    </div>
  );
}

// =========================================
// STYLES
// =========================================
const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    minHeight: "100vh",
    backgroundColor: "#FDFCFE",
    fontFamily: "'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },

  mobileTopbar: {
    width: "100%",
    background: "#1a1a1a",
    color: "#fff",
    padding: "16px 20px",
    alignItems: "center",
    justifyContent: "space-between",
  },

  mobileLogo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "800",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  sidebar: {
    flex: "1 1 250px",
    maxWidth: "260px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
  },

  mobileOverlay: {},

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "36px",
    fontSize: "16px",
    fontWeight: "800",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px 14px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.65)",
    borderLeft: "2px solid transparent",
    transition: "0.2s",
  },

  activeNavItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px 14px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#fff",
    borderLeft: `2px solid ${THEME_COLOR}`,
    backgroundColor: "rgba(110,2,111,0.25)",
  },

  exitItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px 14px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.65)",
    marginTop: "30px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: "20px",
  },

  main: {
    flex: "10 1 600px",
    padding: "36px",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    gap: "20px",
  },

  pageTitle: {
    fontSize: "22px",
    fontWeight: "900",
    letterSpacing: "0.5px",
    color: "#1a1a1a",
    margin: 0,
    textTransform: "uppercase",
  },

  statRow: {
    display: "flex",
    gap: "14px",
  },

  statCard: {
    backgroundColor: "#fff",
    padding: "12px 20px",
    border: "1px solid #1a1a1a",
    borderLeft: `3px solid ${THEME_COLOR}`,
  },

  statLabel: {
    margin: 0,
    fontSize: "10px",
    color: "#999",
    fontWeight: "800",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },

  statValue: {
    margin: 0,
    color: "#1a1a1a",
    fontSize: "20px",
    fontWeight: "900",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(280px, 360px) 1fr",
    gap: "24px",
  },

  card: {
    backgroundColor: "#fff",
    padding: "26px",
    border: "1px solid #1a1a1a",
  },

  cardTitle: {
    fontSize: "13px",
    fontWeight: "800",
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#1a1a1a",
    margin: 0,
  },

  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  cancelEditBtn: {
    border: "1px solid #ddd",
    background: "#fff",
    padding: "6px 12px",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1px",
    textTransform: "uppercase",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#555",
  },

  formStack: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  fieldRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },

  input: {
    padding: "12px",
    border: "1px solid #ddd",
    fontSize: "13px",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    width: "100%",
  },

  uploadLabel: {
    border: `2px dashed ${THEME_COLOR}`,
    color: THEME_COLOR,
    padding: "12px",
    cursor: "pointer",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },

  previewWrap: {
    position: "relative",
  },

  preview: {
    width: "100%",
    border: "1px solid #eee",
    display: "block",
  },

  removeImgBtn: {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    width: "24px",
    height: "24px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryBtn: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
    padding: "15px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "11px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    transition: "0.3s",
  },

  listHeader: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    marginBottom: "20px",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid #ddd",
    padding: "9px 14px",
    minWidth: "220px",
  },

  searchInput: {
    border: "none",
    outline: "none",
    fontSize: "13px",
    width: "100%",
    fontFamily: "inherit",
  },

  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "16px",
  },

  productCard: {
    border: "1px solid #eee",
    transition: "0.3s",
  },

  productImgWrap: {
    position: "relative",
  },

  productImg: {
    width: "100%",
    height: "120px",
    objectFit: "cover",
    display: "block",
  },

  lowStockBadge: {
    position: "absolute",
    top: "8px",
    left: "8px",
    background: "#c0392b",
    color: "#fff",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "0.5px",
    padding: "4px 8px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    textTransform: "uppercase",
  },

  productCategory: {
    fontSize: "10px",
    color: "#999",
    margin: 0,
    fontWeight: "700",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },

  productName: {
    margin: "5px 0",
    fontSize: "13px",
    fontWeight: "800",
    color: "#1a1a1a",
  },

  productPrice: {
    fontWeight: "800",
    color: THEME_COLOR,
    fontSize: "13px",
    margin: "0 0 4px",
  },

  stockText: {
    fontSize: "11px",
    color: "#888",
    margin: "0 0 8px",
  },

  actionGroup: {
    display: "flex",
    gap: "6px",
    marginTop: "10px",
  },

  iconBtn: {
    flex: 1,
    padding: "8px",
    cursor: "pointer",
    border: "1px solid #eee",
    backgroundColor: "#fafafa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.2s",
  },

  emptyText: {
    color: "#999",
    fontSize: "13px",
    padding: "20px 0",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "560px",
  },

  theadRow: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
  },

  th: {
    padding: "14px 16px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },

  tr: {
    transition: "0.2s",
  },

  td: {
    padding: "14px 16px",
    borderBottom: "1px solid #eee",
    fontSize: "13px",
    color: "#333",
  },

  tdFlex: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  roleBadge: {
    border: "1px solid",
    padding: "4px 12px",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },

  tableBtn: {
    border: "1px solid #eee",
    backgroundColor: "#fafafa",
    cursor: "pointer",
    padding: "7px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // ============================
  // MOBILE USER CARD STYLES
  // ============================
  userCard: {
    border: "1px solid #eee",
    padding: "14px",
    transition: "0.2s",
  },

  userCardTop: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "12px",
  },

  userCardAvatar: {
    width: "34px",
    height: "34px",
    minWidth: "34px",
    borderRadius: "50%",
    backgroundColor: "rgba(110,2,111,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  userCardInfo: {
    flex: 1,
    minWidth: 0,
  },

  userCardName: {
    margin: 0,
    fontSize: "13px",
    fontWeight: "800",
    color: "#1a1a1a",
  },

  userCardEmailRow: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginTop: "4px",
  },

  userCardEmail: {
    fontSize: "11px",
    color: "#888",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  userCardActions: {
    display: "flex",
    gap: "8px",
  },

  userCardBtn: {
    flex: 1,
    border: "1px solid #eee",
    backgroundColor: "#fafafa",
    cursor: "pointer",
    padding: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.3px",
    textTransform: "uppercase",
    color: "#333",
  },

  toast: {
    position: "fixed",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#1a1a1a",
    color: "#fff",
    padding: "13px 22px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    zIndex: 2000,
    maxWidth: "90vw",
  },
};
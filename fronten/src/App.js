import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import ProductDetail from "./pages/ProductDetail";
import ExploreCollection from "./pages/ExploreCollection";
import Profile from "./pages/Profile";
import CartPage from "./pages/CartPage";
import Wishlist from "./pages/Wishlist";
import CheckoutPage from "./pages/CheckoutPage";
import SuccessPage from "./pages/SuccessPage";
import NewArrivals from "./pages/NewArrivals";
// 🆕 ORDERS (NEW PAGES YOU NEED TO CREATE)
import OrdersPage from "./pages/OrdersPage";
import OrderDetails from "./pages/OrderDetails";

// ======================
// PRIVATE ROUTE
// ======================
const PrivateRoute = ({ children }) => {
  let userInfo = null;

  try {
    userInfo = JSON.parse(localStorage.getItem("userInfo"));
  } catch (err) {
    userInfo = null;
  }

  console.log("userInfo:", userInfo);

  const isAuthed =
    userInfo &&
    (userInfo.token || userInfo._id || userInfo.email);

  console.log("isAuthed:", isAuthed);

  return isAuthed ? children : <Navigate to="/login" />;
};
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ======================
            AUTH / DEFAULT
        ====================== */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ======================
            MAIN PAGES
        ====================== */}
        <Route path="/collection" element={<ExploreCollection />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />

        {/* ======================
            PROTECTED USER AREA
        ====================== */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* ======================
            🧾 ORDERS SYSTEM (NEW)
        ====================== */}

        {/* ORDERS LIST PAGE */}
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          }
        />

        {/* ORDER DETAILS PAGE */}
        <Route
          path="/orders/:id"
          element={
            <PrivateRoute>
              <OrderDetails />
            </PrivateRoute>
          }
        />
<Route path="/new-arrivals" element={<NewArrivals />} />
        {/* ======================
            ADMIN
        ====================== */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* ======================
            404
        ====================== */}
        <Route path="*" element={<h1>404 Not Found</h1>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
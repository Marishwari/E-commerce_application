import axios from "axios";

// ==============================
// ✅ CREATE AXIOS INSTANCE
// ==============================
const API = axios.create({
  baseURL: "https://e-commerce-application-y2cs.onrender.com/api",
  withCredentials: true,
});

// ==============================
// ✅ REQUEST INTERCEPTOR (TOKEN)
// ==============================
API.interceptors.request.use(
  (req) => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      if (user?.token) {
        req.headers.Authorization = `Bearer ${user.token}`;
      }

      // ✅ FIX: Only set JSON header if NOT FormData
      if (!(req.data instanceof FormData)) {
        req.headers["Content-Type"] = "application/json";
      }

    } catch (err) {
      console.log("Token parse error:", err);
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ==============================
// ✅ RESPONSE INTERCEPTOR
// ==============================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - logging out");
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }

    if (error.response?.status === 403) {
      console.log("Access denied");
    }

    if (error.response?.status === 500) {
      console.log("Server error");
    }

    return Promise.reject(error);
  }
);

// ==============================
// ✅ API METHODS
// ==============================
export const fetchCart = () => API.get("/cart");

export const updateCartItem = (productId, qty) =>
  API.put("/cart/update", { productId, qty });



export const getReviews = (productId) =>
  API.get(`/reviews/${productId}`);

// ==============================
export default API;
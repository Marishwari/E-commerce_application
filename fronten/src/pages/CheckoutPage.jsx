import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, Check } from "lucide-react";
import API from "../api";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ==========================================
// 1. EMBEDDED CSS (Scroll-Safe & Premium)
// ==========================================
const injectedCSS = `
  :root {
    --theme-plum: #6E026F;
    --theme-plum-dark: #4a014b;
    --pure-white: #ffffff;
    --bg-light: #FDFCFE;
    --text-dark: #1a1a1a;
    --text-gray: #777777;
    --border-light: #EEEEEE;
    --transition-smooth: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .checkout-page-wrapper {
    background-color: var(--bg-light);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  .checkout-main-content {
    flex: 1;
    padding: 140px 20px 80px; 
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .checkout-container {
    background-color: var(--pure-white);
    padding: 50px;
    border: 2px solid var(--text-dark);
    position: relative;
    box-shadow: 15px 15px 0px rgba(110, 2, 111, 0.05);
    box-sizing: border-box;
    animation: fadeIn 0.8s ease-out forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .checkout-card-accent {
    position: absolute;
    top: -2px;
    left: -2px;
    width: 40px;
    height: 40px;
    border-top: 6px solid var(--theme-plum);
    border-left: 6px solid var(--theme-plum);
  }

  .checkout-title {
    font-size: clamp(24px, 4vw, 32px);
    font-weight: 900;
    color: var(--text-dark);
    margin: 0 0 40px 0;
    letter-spacing: 4px;
    text-transform: uppercase;
    text-align: center;
  }

  .address-section {
    margin-bottom: 40px;
  }

  .address-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .section-heading {
    font-size: 12px;
    font-weight: 800;
    color: #AAAAAA;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
  }

  .edit-address-btn {
    background: none;
    border: none;
    color: var(--theme-plum);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 5px 10px;
    transition: var(--transition-smooth);
    border-radius: 4px;
  }

  .edit-address-btn:hover {
    background-color: rgba(110, 2, 111, 0.05);
    transform: translateY(-1px);
  }

  .address-display {
    width: 100%;
    min-height: 80px;
    padding: 20px;
    border: 1px solid var(--border-light);
    background-color: #FAFAFA;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-dark);
    box-sizing: border-box;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    line-height: 1.6;
    white-space: pre-wrap;
  }

  .address-textarea {
    width: 100%;
    height: 120px;
    padding: 20px;
    border: 1px solid var(--theme-plum);
    background-color: var(--pure-white);
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-dark);
    resize: none;
    outline: none;
    transition: var(--transition-smooth);
    box-sizing: border-box;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    line-height: 1.5;
    box-shadow: 0 0 0 3px rgba(110, 2, 111, 0.08);
  }

  .address-textarea::placeholder {
    color: #CCCCCC;
  }

  .cart-items-section {
    margin-bottom: 40px;
  }

  .empty-cart-msg {
    text-align: center;
    padding: 30px;
    font-size: 12px;
    font-weight: 700;
    color: var(--text-gray);
    text-transform: uppercase;
    letter-spacing: 1px;
    border: 1px dashed var(--border-light);
  }

  .cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid var(--border-light);
    transition: var(--transition-smooth);
  }

  .cart-item:hover {
    background-color: rgba(110, 2, 111, 0.02);
    padding-left: 10px;
    padding-right: 10px;
  }

  .item-left {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  .item-image {
    width: 70px;
    height: 80px;
    object-fit: cover;
    border: 1px solid var(--border-light);
    background-color: #fff;
  }

  .item-name {
    font-size: 13px;
    font-weight: 800;
    color: var(--text-dark);
    margin: 0 0 8px 0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .item-qty {
    font-size: 10px;
    font-weight: 700;
    color: var(--text-gray);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0;
  }

  .item-price {
    color: var(--theme-plum);
    font-size: 14px;
    font-weight: 900;
    letter-spacing: 1px;
  }

  .summary-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 25px;
    border-top: 2px solid var(--text-dark);
    margin-bottom: 35px;
  }

  .summary-title {
    font-size: 14px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
  }

  .summary-total {
    color: var(--theme-plum);
    font-size: 22px;
    font-weight: 900;
    letter-spacing: 1px;
    margin: 0;
  }

  .pay-btn {
    width: 100%;
    padding: 20px;
    background: linear-gradient(135deg, var(--theme-plum), var(--theme-plum-dark));
    color: var(--pure-white);
    border: none;
    font-size: 12px;
    font-weight: 900;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 2px;
    transition: var(--transition-smooth);
    box-shadow: 0 10px 20px rgba(110, 2, 111, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pay-btn:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(110, 2, 111, 0.3);
    letter-spacing: 3px;
    background: linear-gradient(135deg, var(--theme-plum-dark), var(--theme-plum));
  }

  .pay-btn:disabled {
    background: #CCCCCC;
    box-shadow: none;
    cursor: not-allowed;
    color: #999999;
  }

  /* --- RESPONSIVE QUERIES --- */
  @media (max-width: 600px) {
    .checkout-container {
      padding: 30px 20px;
      border: none;
      box-shadow: none;
    }
    .checkout-card-accent {
      display: none;
    }
    .item-image {
      width: 50px;
      height: 60px;
    }
    .summary-total {
      font-size: 18px;
    }
  }
`;

// ==========================================
// 2. REACT COMPONENT
// ==========================================
export default function CheckoutPage() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = user?.token;

  const [cart, setCart] = useState([]);
  
  // =========================================
  // UI STATES
  // =========================================
  const [loading, setLoading] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const THEME_COLOR = "#6E026F";

  // =========================================
  // PRE-FILL ADDRESS FROM PROFILE
  // =========================================
  const [address, setAddress] = useState(() => {
    if (user?.address) {
      const { fullAddress, city, state, pincode, country } = user.address;
      return [fullAddress, city, state, pincode, country]
        .filter(Boolean)
        .join(", ");
    }
    return "";
  });

  // If the user has no address saved at all, default to editing mode
  useEffect(() => {
    if (!address) {
      setIsEditingAddress(true);
    }
  }, [address]);

  // -----------------------------------
  // SCROLL ON MOUNT ONLY
  // -----------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // -----------------------------------
  // LOAD CART
  // -----------------------------------
  useEffect(() => {
    const loadCart = async () => {
      try {
        const { data } = await API.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(data.items || []);
      } catch (err) {
        console.log("Backend cart failed");
        // LOCAL FALLBACK
        const localCart = JSON.parse(localStorage.getItem(`cart_${user?._id}`)) || [];
        setCart(localCart);
      }
    };
    loadCart();
  }, [token, user?._id]);

  // -----------------------------------
  // TOTAL PRICE
  // -----------------------------------
  const totalPrice = cart.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.qty || 1),
    0
  );

  // -----------------------------------
  // PAYMENT
  // -----------------------------------
  const handlePayment = async () => {
    if (!address.trim()) {
      alert("Please enter a valid delivery address.");
      setIsEditingAddress(true);
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post(
        "/payment/create-order",
        { amount: Number(totalPrice) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: "rzp_test_SoQK6mMZ3QJwVo",
        amount: data.amount,
        currency: data.currency,
        name: "LuxyAttire",
        description: "Secure Order Payment",
        order_id: data.id,

        handler: async function (response) {
          try {
            const verifyData = await API.post("/payment/verify", response);

            if (verifyData.data.success) {
              await API.post(
                "/orders",
                {
                  orderItems: cart.map((item) => ({
                    name: item.name,
                    qty: Number(item.qty) || 1,
                    image: item.image,
                    price: Number(item.price) || 0,
                    product: item.product || item.productId || item._id,
                  })),
                  shippingAddress: {
                    fullAddress: address, 
                    city: "", 
                    state: "",
                    pincode: "",
                    country: "India",
                  },
                  paymentMethod: "Razorpay",
                  paymentResult: {
                    id: response.razorpay_payment_id,
                    status: "Paid",
                    update_time: new Date().toISOString(),
                    email_address: user.email,
                  },
                  itemsPrice: Number(totalPrice),
                  taxPrice: 0,
                  shippingPrice: 0,
                  totalPrice: Number(totalPrice),
                  isPaid: true,
                  paidAt: new Date(),
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              localStorage.removeItem(`cart_${user._id}`);
              await API.delete("/cart/clear", {
                headers: { Authorization: `Bearer ${token}` },
              });

              setCart([]);
              window.dispatchEvent(new Event("cartUpdated"));
              window.dispatchEvent(new Event("orderPlaced"));
              setLoading(false);
              navigate("/success");
            } else {
              alert("Payment verification failed");
              setLoading(false);
            }
          } catch (err) {
            console.log(err);
            alert("Order saving failed");
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: THEME_COLOR,
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error);
      alert("Payment failed");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{injectedCSS}</style>

      <div className="checkout-page-wrapper">
        <Navbar />

        <main className="checkout-main-content">
          <div className="checkout-container">
            <div className="checkout-card-accent"></div>

            {/* TITLE */}
            <h1 className="checkout-title">Secure Checkout</h1>

            {/* ADDRESS SECTION WITH EDIT TOGGLE */}
            <div className="address-section">
              <div className="address-header">
                <span className="section-heading">Delivery Destination</span>
                <button 
                  className="edit-address-btn" 
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                >
                  {isEditingAddress ? (
                    <><Check size={14} /> SAVE</>
                  ) : (
                    <><Edit3 size={14} /> EDIT</>
                  )}
                </button>
              </div>

              {isEditingAddress ? (
                <textarea
                  className="address-textarea"
                  placeholder="ENTER FULL DELIVERY ADDRESS INCLUDING PINCODE..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  autoFocus
                />
              ) : (
                <div className="address-display">
                  {address || "NO ADDRESS PROVIDED. PLEASE EDIT TO ADD."}
                </div>
              )}
            </div>

            {/* CART ITEMS */}
            <div className="cart-items-section">
              <span className="section-heading">Order Summary</span>
              
              {cart.length === 0 ? (
                <div className="empty-cart-msg">Your selection is empty</div>
              ) : (
                <div className="cart-items-list">
                  {cart.map((item) => (
                    <div key={item.product || item.productId || item._id} className="cart-item">
                      
                      {/* LEFT */}
                      <div className="item-left">
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          className="item-image"
                        />
                        <div className="item-details">
                          <h4 className="item-name">{item.name}</h4>
                          <p className="item-qty">QTY: {item.qty || 1}</p>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <strong className="item-price">
                        ₹{(Number(item.price) * Number(item.qty || 1)).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TOTAL */}
            <div className="summary-section">
              <h2 className="summary-title">Total Investment</h2>
              <h2 className="summary-total">
                ₹{Number(totalPrice).toLocaleString("en-IN")}
              </h2>
            </div>

            {/* BUTTON */}
            <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={loading || cart.length === 0}
            >
              {loading
                ? "PROCESSING TRANSACTION..."
                : `AUTHORIZE PAYMENT — ₹${Number(totalPrice).toLocaleString("en-IN")}`}
            </button>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
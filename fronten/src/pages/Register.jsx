import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { GoogleLogin } from "@react-oauth/google";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";

// ==========================================
// 1. EMBEDDED CSS (Scroll-Safe & Premium)
// ==========================================
const injectedCSS = `
  :root {
    --theme-plum: #6E026F;
    --theme-plum-dark: #4a014b;
    --theme-plum-light: rgba(110, 2, 111, 0.08);
    --pure-white: #ffffff;
    --text-dark: #1a1a1a;
    --text-gray: #555555;
    --bg-light: #FDFCFE;
    --border-light: #EEEEEE;
    --transition-smooth: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .register-page-wrapper {
    display: flex;
    min-height: 100vh; /* FIXED: Was height: 100vh */
    width: 100%;
    background-color: var(--bg-light);
    overflow-x: hidden;
    font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  /* --- LEFT: EDITORIAL BRAND PANEL --- */
  .brand-panel {
    flex: 1;
    background-color: var(--theme-plum);
    color: var(--pure-white);
    display: flex;
    padding: 60px;
    box-sizing: border-box;
    min-height: 100vh; /* FIXED */
  }

  .brand-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    width: 100%;
  }

  .brand-badge {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 3px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;
  }

  .brand-logo {
    font-weight: 900;
    letter-spacing: 5px;
    font-size: 24px;
    margin: 0;
    text-transform: uppercase;
  }

  .brand-logo-light {
    font-weight: 200;
  }

  .brand-slogan {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 900;
    line-height: 1.1;
    margin: 20px 0;
    letter-spacing: -2px;
    text-transform: uppercase;
  }

  .brand-accent-line {
    width: 60px;
    height: 4px;
    background-color: var(--pure-white);
    margin-bottom: 20px;
  }

  .brand-sub {
    opacity: 0.8;
    font-size: 14px;
    letter-spacing: 1px;
    max-width: 300px;
    line-height: 1.6;
  }

  .brand-copyright {
    font-size: 10px;
    opacity: 0.5;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  /* --- RIGHT: REGISTRATION INTERFACE --- */
  .form-side {
    flex: 1.2;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    box-sizing: border-box;
    min-height: 100vh; /* FIXED */
  }

  .form-card {
    width: 100%;
    max-width: 460px;
    padding: 50px;
    background-color: var(--pure-white);
    border: 2px solid var(--text-dark);
    position: relative;
    box-shadow: 15px 15px 0px rgba(110, 2, 111, 0.1);
    box-sizing: border-box;
    animation: slideUp 0.8s ease-out forwards;
    opacity: 0;
    transform: translateY(20px);
  }

  @keyframes slideUp {
    to { opacity: 1; transform: translateY(0); }
  }

  .card-accent {
    position: absolute;
    top: -2px;
    left: -2px;
    width: 40px;
    height: 40px;
    border-top: 6px solid var(--theme-plum);
    border-left: 6px solid var(--theme-plum);
  }

  .form-header {
    margin-bottom: 35px;
  }

  .form-title {
    color: var(--text-dark);
    font-size: 26px;
    font-weight: 900;
    margin: 0;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .form-title-light {
    font-weight: 300;
    color: var(--theme-plum);
  }

  .form-subtitle {
    color: #999999;
    font-size: 11px;
    margin-top: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
  }

  .register-form {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .input-label {
    font-size: 10px;
    font-weight: 800;
    color: #BBBBBB;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 15px;
    color: var(--text-dark);
    font-size: 16px;
  }

  .form-input {
    width: 100%;
    padding: 15px 15px 15px 45px;
    border: 1px solid var(--border-light);
    font-size: 13px;
    font-weight: 600;
    outline: none;
    background-color: #FAFAFA;
    transition: var(--transition-smooth);
    text-transform: uppercase;
    box-sizing: border-box;
    font-family: inherit;
    letter-spacing: 0.5px;
  }

  .form-input:focus {
    border-color: var(--theme-plum);
    background-color: var(--pure-white);
    box-shadow: 0 0 0 3px var(--theme-plum-light);
  }

  .form-input::placeholder {
    color: #CCCCCC;
  }

  .password-input {
    padding-right: 50px;
  }

  .eye-btn {
    position: absolute;
    right: 15px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-dark);
    display: flex;
    transition: color 0.2s ease;
  }

  .eye-btn:hover {
    color: var(--theme-plum);
  }

  .submit-btn {
    background-color: var(--text-dark);
    color: var(--pure-white);
    padding: 18px;
    border: none;
    font-size: 11px;
    font-weight: 800;
    cursor: pointer;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    letter-spacing: 1.5px;
    transition: var(--transition-smooth);
    text-transform: uppercase;
    font-family: inherit;
  }

  .submit-btn:hover:not(:disabled) {
    background-color: var(--theme-plum);
    letter-spacing: 2.5px;
    box-shadow: 0 8px 20px rgba(110, 2, 111, 0.2);
  }

  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: var(--pure-white);
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .divider-wrapper {
    display: flex;
    align-items: center;
    margin: 8px 0;
    gap: 15px;
  }

  .divider-line {
    flex: 1;
    height: 1px;
    background-color: var(--border-light);
  }

  .divider-text {
    font-size: 9px;
    color: #AAAAAA;
    font-weight: 800;
    letter-spacing: 2px;
  }

  .google-login-wrapper {
    display: flex;
    justify-content: center;
    border: 1px solid var(--border-light);
    transition: var(--transition-smooth);
  }

  .google-login-wrapper:hover {
    border-color: #DDDDDD;
  }

  .footer-text {
    text-align: center;
    margin-top: 30px;
    font-size: 10px;
    color: #999999;
    letter-spacing: 1px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .footer-link {
    color: var(--theme-plum);
    font-weight: 900;
    cursor: pointer;
    margin-left: 5px;
    text-decoration: underline;
    transition: color 0.2s ease;
  }

  .footer-link:hover {
    color: var(--theme-plum-dark);
  }

  /* --- RESPONSIVE QUERIES --- */
  @media (max-width: 900px) {
    .brand-panel {
      display: none;
    }
    
    .form-side {
      flex: 1;
      padding: 40px 20px;
    }
    
    .form-card {
      border: none;
      box-shadow: none;
      padding: 0;
      background: transparent;
      max-width: 100%;
    }
    
    .card-accent {
      display: none;
    }
    
    .form-title {
      font-size: 22px;
    }
  }

  @media (max-width: 480px) {
    .form-side {
      padding: 30px 15px;
    }
    
    .submit-btn {
      padding: 15px;
    }
  }
`;

// ==========================================
// 2. REACT COMPONENT
// ==========================================
const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", form);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{injectedCSS}</style>
      
      <div className="register-page-wrapper">
        {/* LEFT: EDITORIAL BRAND PANEL (Desktop Only) */}
        <div className="brand-panel">
          <div className="brand-content">
            <div>
              <div className="brand-badge">
                <HiOutlineSparkles /> EST. 2026
              </div>
              <h1 className="brand-logo">
                LUXY <span className="brand-logo-light">PREMIUM</span>
              </h1>
            </div>
            
            <div>
              <h2 className="brand-slogan">DEFINING <br/> THE STANDARD.</h2>
              <div className="brand-accent-line"></div>
              <p className="brand-sub">
                Experience the executive collection of high-performance essentials.
              </p>
            </div>

            <p className="brand-copyright">PRIVACY SECURED • 2026 EDITION</p>
          </div>
        </div>

        {/* RIGHT: REGISTRATION INTERFACE */}
        <div className="form-side">
          <div className="form-card">
            <div className="card-accent"></div>
            
            <header className="form-header">
              <h2 className="form-title">
                CLIENT <span className="form-title-light">REGISTRATION</span>
              </h2>
              <p className="form-subtitle">Enter your details to access the selection</p>
            </header>

            <form onSubmit={submitHandler} className="register-form">
              <div className="input-group">
                <label className="input-label">FULL NAME</label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input 
                    name="name" 
                    placeholder="E.G. ALEXANDER VOGUE" 
                    onChange={handleChange} 
                    className="form-input" 
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">EMAIL ADDRESS</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input 
                    name="email" 
                    type="email" 
                    placeholder="NAME@DOMAIN.COM" 
                    onChange={handleChange} 
                    className="form-input" 
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">SECURE PASSWORD</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    onChange={handleChange} 
                    className="form-input password-input" 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="eye-btn"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? <div className="spinner"></div> : <>CREATE ACCOUNT <FiArrowRight /></>}
              </button>

              <div className="divider-wrapper">
                <div className="divider-line"></div>
                <span className="divider-text">SECURE PROTOCOL</span>
                <div className="divider-line"></div>
              </div>

              <div className="google-login-wrapper">
                <GoogleLogin 
                  onSuccess={(res) => console.log(res)} 
                  onError={() => console.log("Failed")}
                  width="100%" 
                />
              </div>
            </form>

            <p className="footer-text">
              ALREADY A CLIENT?{" "}
              <span onClick={() => navigate("/login")} className="footer-link">
                LOGIN HERE
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
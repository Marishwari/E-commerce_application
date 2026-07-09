import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, ShieldCheck, Zap } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();
  const THEME_COLOR = "#6E026F";

  return (
    <section style={styles.heroContainer}>
      <div style={styles.wrapper} className="hero-wrapper">
        
        {/* TEXT CONTENT SIDE */}
        <div style={styles.contentSide} className="content-side">
          <div className="fade-in" style={styles.badgeContainer}>
            <span style={styles.badgeText}>ELITE SELECTION 2026</span>
          </div>

          <h1 style={styles.mainTitle} className="hero-title">
            Defining the <br />
            <span style={styles.highlightText}>Executive</span> Standard
          </h1>

          <p style={styles.description}>
            Meticulously tailored from 100% long-staple cotton. 
            A silhouette designed for the modern boardroom and private events. 
            Experience the pinnacle of professional comfort.
          </p>

          <div style={styles.buttonGroup} className="btn-group">
            <button 
              style={styles.primaryBtn} 
              className="btn-primary"
              onClick={() => navigate("/collection")}
            >
              EXPLORE THE EDIT
            </button>
            <button style={styles.secondaryBtn} className="btn-secondary">
               OUR HERITAGE
            </button>
          </div>

          <div style={styles.statsRow} className="stats-row">
            <div style={styles.statItem}>
              <p style={styles.statNum}>50K+</p>
              <p style={styles.statLabel}>CLIENTS</p>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}>
              <p style={styles.statNum}>4.9<Star size={12} fill="#1a1a1a" color="#1a1a1a" style={{marginLeft:'5px'}}/></p>
              <p style={styles.statLabel}>RATING</p>
            </div>
          </div>
        </div>

        {/* DESIGNER IMAGE SIDE */}
        <div style={styles.imageSide} className="image-side">
          <div style={styles.imageLayerWrapper}>
            {/* The Outer Architectural Frame */}
            <div style={styles.imageFrame} className="image-frame"></div>
            
            <div style={styles.imageMainCard}>
              <img 
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" 
                alt="Premium White T-Shirt" 
                style={styles.heroImg}
              />
            </div>
            
            {/* Floating Authenticity Badge */}
            <div style={styles.detailCard} className="detail-card">
              <ShieldCheck size={18} color={THEME_COLOR} />
              <span style={styles.detailTitle}>ORIGINAL LUXURY</span>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        /* Global X-Lock */
        html, body { width: 100%; overflow-x: hidden; margin: 0; padding: 0; }

        .fade-in { animation: fadeInRight 1s ease-out forwards; }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .btn-primary { transition: all 0.3s ease; border: 2px solid #1a1a1a !important; }
        .btn-primary:hover { 
            background: #1a1a1a !important; 
            color: #fff !important;
            padding-left: 40px !important;
            padding-right: 40px !important;
        }
        
        .btn-secondary:hover { 
            background: #fcfcfc !important;
            border-color: #1a1a1a !important;
            color: #1a1a1a !important;
        }

        /* Mobile Breakpoints */
        @media (max-width: 950px) {
          .hero-wrapper { flex-direction: column !important; padding: 120px 20px 60px !important; text-align: center; }
          .content-side { order: 2; padding: 0 !important; width: 100% !important; align-items: center !important; }
          .image-side { order: 1; width: 100% !important; margin-bottom: 50px; }
          .hero-title { font-size: 2.8rem !important; }
          .btn-group { justify-content: center; width: 100%; }
          .stats-row { justify-content: center; width: 100%; margin-top: 20px; }
          .image-frame { display: none; }
          .detail-card { left: 50% !important; transform: translateX(-50%) !important; bottom: -15px !important; min-width: 180px; }
        }
      `}</style>
    </section>
  );
}

const styles = {
  heroContainer: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#FFFFFF", 
    overflow: "hidden",
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
    maxWidth: "1300px",
    width: "100%",
    padding: "0 5%",
    gap: "60px",
  },
  contentSide: {
    flex: "1.2",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  badgeContainer: {
    marginBottom: "20px",
    borderLeft: "2px solid #6E026F",
    paddingLeft: "15px",
  },
  badgeText: { color: "#1a1a1a", fontWeight: "700", fontSize: "11px", letterSpacing: "3px" },
  mainTitle: {
    fontSize: "clamp(42px, 5.5vw, 80px)",
    lineHeight: "1.05",
    color: "#1a1a1a",
    fontWeight: "900",
    margin: "0 0 25px 0",
    letterSpacing: "-1.5px",
  },
  highlightText: { color: "#6E026F", fontWeight: "200" },
  description: {
    fontSize: "17px",
    color: "#666",
    lineHeight: "1.8",
    marginBottom: "45px",
    maxWidth: "500px",
  },
  buttonGroup: { display: "flex", gap: "15px", marginBottom: "60px", flexWrap: "wrap" },
  primaryBtn: {
    backgroundColor: "transparent", color: "#1a1a1a", border: "2px solid #1a1a1a",
    padding: "16px 35px", borderRadius: "0px",
    fontWeight: "800", fontSize: "12px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "2px"
  },
  secondaryBtn: {
    backgroundColor: "transparent", color: "#999", border: "1px solid #eee",
    padding: "16px 35px", borderRadius: "0px", fontWeight: "700", fontSize: "12px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px"
  },
  statsRow: { display: "flex", gap: "40px", alignItems: "center" },
  statNum: { fontSize: "22px", fontWeight: "900", color: "#1a1a1a", margin: 0, display:'flex', alignItems:'center' },
  statLabel: { fontSize: "10px", color: "#AAA", textTransform: "uppercase", letterSpacing: "2px", marginTop: "4px" },
  statDivider: { width: "1px", height: "30px", backgroundColor: "#eee" },

  imageSide: { flex: "1", position: "relative", display: "flex", justifyContent: "center" },
  imageLayerWrapper: { position: "relative", width: "100%", maxWidth: "420px", aspectRatio: "0.82/1" },
  imageFrame: {
    position: "absolute", width: "100%", height: "100%",
    border: "1px solid #1a1a1a", top: "-15px", right: "-15px", zIndex: 1
  },
  imageMainCard: {
    position: "absolute", width: "100%", height: "100%",
    backgroundColor: "#f9f9f9", zIndex: 2, overflow: "hidden",
    border: "1px solid #f0f0f0"
  },
  heroImg: { width: "100%", height: "100%", objectFit: "cover" },
  detailCard: {
    position: "absolute", bottom: "20px", left: "-30px",
    backgroundColor: "#FFFFFF", padding: "12px 24px", display: "flex",
    alignItems: "center", gap: "12px", zIndex: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    border: "1px solid #f0f0f0"
  },
  detailTitle: { margin: 0, fontSize: "10px", fontWeight: "900", color: "#1a1a1a", letterSpacing: "1px" },
};
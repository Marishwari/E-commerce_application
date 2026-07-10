import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, ShieldCheck, Zap } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();
  const THEME_COLOR = "#6E026F";

  // =========================
  // 3D TILT STATE
  // =========================
  const wrapperRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const el = wrapperRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const ry = (px - 0.5) * 24;
    const rx = (0.5 - py) * 18;

    setTilt({ rx, ry });
  };

  const handleMouseEnter = () => setIsHovering(true);

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ rx: 0, ry: 0 });
  };

  const tiltTransform = `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(${
    isHovering ? 1.03 : 1
  }, ${isHovering ? 1.03 : 1}, 1)`;

  return (
    <section style={styles.heroContainer}>
      <div style={styles.wrapper} className="hero-wrapper">
        
        {/* TEXT CONTENT SIDE */}
        <div style={styles.contentSide} className="content-side">
          <div className="fade-in" style={styles.badgeContainer}>
            <span style={styles.badgeText}>ELITE SELECTION 2026</span>
          </div>

          <h1 style={styles.mainTitle} className="hero-title fade-in-up delay-1">
            Defining the <br />
            <span style={styles.highlightText}>Executive</span> Standard
          </h1>

          <p style={styles.description} className="fade-in-up delay-2">
            Meticulously tailored from 100% long-staple cotton. 
            A silhouette designed for the modern boardroom and private events. 
            Experience the pinnacle of professional comfort.
          </p>

          <div style={styles.buttonGroup} className="btn-group fade-in-up delay-3">
            <button 
              style={styles.primaryBtn} 
              className="btn-primary"
              onClick={() => navigate("/collection")}
            >
              <span className="btn-primary-label">EXPLORE THE EDIT</span>
            </button>
            <button style={styles.secondaryBtn} className="btn-secondary">
               OUR HERITAGE
            </button>
          </div>

          <div style={styles.statsRow} className="stats-row fade-in-up delay-4">
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

        {/* DESIGNER IMAGE SIDE — 3D TILT */}
        <div style={styles.imageSide} className="image-side">
          <div
            ref={wrapperRef}
            style={{
              ...styles.imageLayerWrapper,
              transform: tiltTransform,
              transition: isHovering
                ? "transform 0.12s ease-out"
                : "transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)",
            }}
            className="image-layer-wrapper"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              style={{
                ...styles.groundShadow,
                transform: `translate(${-tilt.ry * 1.2}px, ${8 - tilt.rx * 0.6}px)`,
                opacity: isHovering ? 0.35 : 0.2,
              }}
            />

            <div style={styles.imageFrame} className="image-frame"></div>
            
            <div style={styles.imageMainCard} className="image-main-card">
              <img 
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" 
                alt="Premium White T-Shirt" 
                style={styles.heroImg}
              />

              <div
                style={{
                  ...styles.glare,
                  transform: `translate(${tilt.ry * 3}%, ${-tilt.rx * 3}%)`,
                  opacity: isHovering ? 0.55 : 0,
                }}
              />
            </div>
            
            <div style={styles.detailCard} className="detail-card float-idle">
              <ShieldCheck size={18} color={THEME_COLOR} />
              <span style={styles.detailTitle}>ORIGINAL LUXURY</span>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        /* Global X-Lock */
        html, body { width: 100%; overflow-x: hidden; margin: 0; padding: 0; }

        /* Entrance Animations */
        .fade-in { animation: fadeInRight 1s ease-out forwards; }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.22s; }
        .delay-3 { animation-delay: 0.34s; }
        .delay-4 { animation-delay: 0.46s; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* --- 3D ENTRANCE FOR THE IMAGE CARD --- */
        .image-layer-wrapper {
          transform-style: preserve-3d;
          animation: cardEnter 1.1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: perspective(1200px) rotateY(28deg) rotateX(6deg) translateY(30px) scale3d(0.94, 0.94, 1);
          }
          to {
            opacity: 1;
            transform: perspective(1200px) rotateY(0deg) rotateX(0deg) translateY(0) scale3d(1, 1, 1);
          }
        }

        .image-frame {
          transform: translateZ(-40px);
          transition: transform 0.4s ease;
        }

        .image-main-card {
          transform: translateZ(0px);
        }

        .detail-card {
          transform: translateZ(70px);
        }

        .float-idle {
          animation: floatIdle 3.4s ease-in-out infinite;
        }
        @keyframes floatIdle {
          0%, 100% { transform: translateZ(70px) translateY(0px); }
          50% { transform: translateZ(70px) translateY(-8px); }
        }

        /* --- BUTTON SHINE SWEEP --- */
        .btn-primary { 
          transition: all 0.3s ease; 
          border: 2px solid #1a1a1a !important; 
          position: relative;
          overflow: hidden;
        }
        .btn-primary-label { position: relative; z-index: 2; }
        .btn-primary::before {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 60%;
          height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.5), transparent);
          transform: skewX(-20deg);
          transition: left 0.65s ease;
          z-index: 1;
        }
        .btn-primary:hover::before { left: 130%; }
        .btn-primary:hover { 
            background: #1a1a1a !important; 
            color: #fff !important;
            padding-left: 40px !important;
            padding-right: 40px !important;
            box-shadow: 0 12px 30px rgba(0,0,0,0.18);
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
          .detail-card { left: 50% !important; transform: translateX(-50%) translateZ(70px) !important; bottom: -15px !important; min-width: 180px; }
          .float-idle { animation: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-in, .fade-in-up, .image-layer-wrapper, .float-idle {
            animation: none !important;
            opacity: 1 !important;
          }
          .image-layer-wrapper { transform: none !important; }
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
    position: "relative",
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
    maxWidth: "1300px",
    width: "100%",
    padding: "0 5%",
    gap: "60px",
    position: "relative",
    zIndex: 1,
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
  imageLayerWrapper: {
    position: "relative",
    width: "100%",
    maxWidth: "420px",
    aspectRatio: "0.82/1",
    willChange: "transform",
  },
  groundShadow: {
    position: "absolute",
    width: "80%",
    height: "40px",
    left: "10%",
    bottom: "-25px",
    background: "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 70%)",
    filter: "blur(6px)",
    zIndex: 0,
    transition: "transform 0.15s ease-out, opacity 0.3s ease",
  },
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
  glare: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(115deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 45%)",
    pointerEvents: "none",
    transition: "transform 0.12s ease-out, opacity 0.3s ease",
  },
  detailCard: {
    position: "absolute", bottom: "20px", left: "-30px",
    backgroundColor: "#FFFFFF", padding: "12px 24px", display: "flex",
    alignItems: "center", gap: "12px", zIndex: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    border: "1px solid #f0f0f0"
  },
  detailTitle: { margin: 0, fontSize: "10px", fontWeight: "900", color: "#1a1a1a", letterSpacing: "1px" },
};
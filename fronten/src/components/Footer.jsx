import React from "react";
import {
  FaInstagram, FaFacebookF, FaLinkedinIn, FaTwitter,
  FaArrowRight, FaArrowUp, FaRegEnvelope,
} from "react-icons/fa";
import {
  MdOutlineLocalShipping, MdOutlineCached, MdOutlineVerifiedUser,
} from "react-icons/md";

const THEME_COLOR = "#6E026F";

export default function LuxyResponsiveFooter() {
  const currentYear = new Date().getFullYear();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        {/* ── ROW 1: BRAND + NEWSLETTER ── */}
        <div style={styles.topRow} className="footer-top">
          {/* BRAND */}
          <div style={styles.brandBox}>
            <div style={styles.eyebrow}>EST. 2026</div>
            <h2 style={styles.logo}>
              LUXY<span style={styles.logoLight}>ATTIRE</span>
            </h2>
            <p style={styles.tagline}>Executive Style Without Compromise</p>
            <div style={styles.socialRow}>
              <SocialIcon icon={<FaInstagram size={15} />} />
              <SocialIcon icon={<FaFacebookF size={13} />} />
              <SocialIcon icon={<FaTwitter size={15} />} />
              <SocialIcon icon={<FaLinkedinIn size={15} />} />
            </div>
          </div>

          {/* NEWSLETTER */}
          <div style={styles.newsletterBox} className="newsletter-box">
            <div style={styles.nlHeader}>
              <FaRegEnvelope size={14} />
              <span style={styles.nlTitle}>JOIN THE ELITE LIST</span>
            </div>
            <p style={styles.nlSub}>Exclusive drops & member-only access.</p>
            <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="YOUR EMAIL ADDRESS" style={styles.input} />
              <button style={styles.joinBtn} className="join-btn">
                <FaArrowRight size={13} />
              </button>
            </form>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div style={styles.divider} />

        {/* ── ROW 2: LINKS + TRUST ── */}
        <div style={styles.grid} className="footer-grid">
          <LinkGroup
            title="Shop"
            links={["All Products", "New Arrivals", "Casual", "Oversized", "Premium"]}
          />
          <LinkGroup
            title="Service"
            links={["Track Order", "Returns", "Size Guide", "Contact Us"]}
          />
          <LinkGroup
            title="Company"
            links={["Our Story", "Careers", "Press", "Privacy Policy", "Terms"]}
          />

          <div>
            <h4 style={styles.groupHeading}>Why Luxy</h4>
            <TrustItem icon={<MdOutlineLocalShipping size={15} />} text="Free Express Delivery" />
            <TrustItem icon={<MdOutlineCached size={15} />} text="7-Day Easy Returns" />
            <TrustItem icon={<MdOutlineVerifiedUser size={15} />} text="100% Authentic" />
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div style={styles.bottomBar} className="footer-bottom">
          <p style={styles.copyright}>
            © {currentYear} LUXYATTIRE STUDIO. ALL RIGHTS RESERVED.
          </p>
          <button onClick={scrollToTop} style={styles.topBtn} className="top-btn">
            BACK TO TOP <FaArrowUp size={10} />
          </button>
        </div>
      </div>

      <style>{`
        .join-btn:hover { background: rgba(255,255,255,0.15) !important; }
        .top-btn:hover { opacity: 1 !important; }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-link {
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          display: block;
          margin-bottom: 10px;
          transition: 0.2s;
        }

        .footer-link:hover {
          color: #fff;
          padding-left: 6px;
        }

        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }

          .footer-top {
            flex-direction: column;
            align-items: stretch;
          }

          .newsletter-box {
            border-left: none !important;
            padding-left: 0 !important;
          }
        }

        @media (max-width: 560px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }

          .footer-bottom {
            flex-direction: column !important;
            gap: 16px;
            text-align: center;
          }
        }

        @media (max-width: 400px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}

// ── SUB COMPONENTS ──

const LinkGroup = ({ title, links }) => (
  <div>
    <h4 style={styles.groupHeading}>{title}</h4>
    {links.map((link) => (
      <a key={link} href="/" className="footer-link">{link}</a>
    ))}
  </div>
);

const SocialIcon = ({ icon }) => (
  <div style={styles.socialIconBox} className="social-icon">{icon}</div>
);

const TrustItem = ({ icon, text }) => (
  <div style={styles.trustItem}>
    <span style={{ color: "rgba(255,255,255,0.7)" }}>{icon}</span>
    <span>{text}</span>
  </div>
);

// ── STYLES ──

const styles = {
  footer: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: "60px 0 30px",
    fontFamily: "'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
  },

  // TOP ROW
  topRow: {},

  brandBox: {
    flex: "1",
  },

  eyebrow: {
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "3px",
    color: THEME_COLOR,
    marginBottom: "10px",
    textTransform: "uppercase",
  },

  logo: {
    fontSize: "22px",
    fontWeight: "900",
    letterSpacing: "5px",
    margin: "0 0 8px",
    textTransform: "uppercase",
    color: "#fff",
  },

  logoLight: {
    fontWeight: "200",
    color: "rgba(255,255,255,0.7)",
  },

  tagline: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.45)",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    fontWeight: "600",
    margin: "0 0 20px",
  },

  socialRow: {
    display: "flex",
    gap: "10px",
  },

  socialIconBox: {
    width: "34px",
    height: "34px",
    border: "1px solid rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "rgba(255,255,255,0.6)",
    transition: "0.2s",
  },

  newsletterBox: {
    flex: "0 0 320px",
    borderLeft: "1px solid rgba(255,255,255,0.1)",
    paddingLeft: "40px",
  },

  nlHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
    color: "#fff",
  },

  nlTitle: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },

  nlSub: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.45)",
    marginBottom: "18px",
    letterSpacing: "0.5px",
  },

  form: {
    display: "flex",
    borderBottom: "1px solid rgba(255,255,255,0.25)",
    paddingBottom: "8px",
  },

  input: {
    background: "none",
    border: "none",
    color: "#fff",
    outline: "none",
    fontSize: "11px",
    fontWeight: "600",
    flex: 1,
    letterSpacing: "1px",
    fontFamily: "inherit",
  },

  joinBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    padding: "4px 8px",
    transition: "0.2s",
    display: "flex",
    alignItems: "center",
  },

  // DIVIDER
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.08)",
    marginBottom: "40px",
  },

  // LINKS
  groupHeading: {
    fontSize: "10px",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "2px",
    marginBottom: "18px",
    color: "#fff",
  },

  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    color: "rgba(255,255,255,0.55)",
    marginBottom: "14px",
  },

  // BOTTOM BAR
  bottomBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "24px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },

  copyright: {
    fontSize: "9px",
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    margin: 0,
  },

  topBtn: {
    background: "none",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    fontSize: "9px",
    fontWeight: "800",
    cursor: "pointer",
    opacity: 0.5,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    padding: "8px 14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "0.2s",
  },
};
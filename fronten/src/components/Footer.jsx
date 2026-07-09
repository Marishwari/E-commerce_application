import React from "react";
import { 
  FaInstagram, FaFacebookF, FaLinkedinIn, FaTwitter, 
  FaArrowRight, FaArrowUp, FaRegEnvelope 
} from "react-icons/fa";
import { 
  MdOutlineLocalShipping, MdOutlineCached, MdOutlineVerifiedUser 
} from "react-icons/md";

export default function LuxyResponsiveFooter() {
  const currentYear = new Date().getFullYear();


  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        
        {/* ROW 1: BRAND & NEWSLETTER (SLIM) */}
        <div style={styles.topRow} className="footer-flex">
          <div style={styles.brandBox}>
            <h2 style={styles.logo}>LUXY<span style={{ fontWeight: "200" }}>ATTIRE</span></h2>
            <div style={styles.socialRow}>
              <SocialIcon icon={<FaInstagram size={16}/>} />
              <SocialIcon icon={<FaFacebookF size={14}/>} />
              <SocialIcon icon={<FaTwitter size={16}/>} />
              <SocialIcon icon={<FaLinkedinIn size={16}/>} />
            </div>
          </div>

          <div style={styles.newsletterBox}>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom: '8px'}}>
               <FaRegEnvelope size={14} />
               <span style={styles.miniHeading}>JOIN THE ELITE LIST</span>
            </div>
            <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="EMAIL ADDRESS" style={styles.input} />
              <button style={styles.joinBtn}><FaArrowRight /></button>
            </form>
          </div>
        </div>

        <div style={styles.divider} />

        {/* ROW 2: COMPACT LINKS */}
        <div className="footer-grid" style={styles.grid}>
          <LinkGroup title="Shop" links={["Heritage", "Executive", "Signature"]} />
          <LinkGroup title="Service" links={["Tailoring", "Orders", "Returns"]} />
          <LinkGroup title="Company" links={["Our Story", "Stores", "Terms"]} />
          
          <div style={styles.trustColumn}>
            <TrustItem icon={<MdOutlineLocalShipping />} text="EXPRESS DELIVERY" />
            <TrustItem icon={<MdOutlineCached />} text="EASY RETURNS" />
            <TrustItem icon={<MdOutlineVerifiedUser />} text="SECURE" />
          </div>
        </div>

        {/* ROW 3: MINI BOTTOM BAR */}
        <div style={styles.bottomBar}>
          <p style={styles.copyright}>© {currentYear} LUXYATTIRE STUDIO.</p>
          <button onClick={scrollToTop} style={styles.topBtn} className="back-to-top">
             TOP <FaArrowUp size={10} style={{marginLeft: '5px'}} />
          </button>
        </div>
      </div>

      <style>{`
        .footer-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .footer-link { color: rgba(255, 255, 255, 0.6); text-decoration: none; font-size: 12px; transition: 0.2s; display: block; margin-bottom: 8px; }
        .footer-link:hover { color: #FFFFFF; transform: translateX(3px); }
        .footer-flex { display: flex; justify-content: space-between; align-items: flex-end; }
        
        @media (max-width: 850px) {
          .footer-flex { flex-direction: column; align-items: center; text-align: center; gap: 30px; }
          .footer-grid { grid-template-columns: 1fr 1fr; text-align: center; }
          .newsletter-box { border: none !important; padding: 0 !important; width: 100% !important; }
        }
      `}</style>
    </footer>
  );
}

const LinkGroup = ({ title, links }) => (
  <div>
    <h4 style={styles.groupHeading}>{title}</h4>
    {links.map(link => <a key={link} href="#" className="footer-link">{link}</a>)}
  </div>
);

const SocialIcon = ({ icon }) => (
  <div style={styles.socialIconBox}>{icon}</div>
);

const TrustItem = ({ icon, text }) => (
  <div style={styles.trustItem}>{icon} <span>{text}</span></div>
);

const styles = {
  footer: { backgroundColor: "#6E026F", color: "#FFFFFF", padding: "40px 0 20px 0", fontFamily: "'Inter', sans-serif" },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "0 20px" },
  
  topRow: { marginBottom: "30px" },
  logo: { fontSize: "20px", fontWeight: "900", letterSpacing: "3px", margin: "0 0 10px 0" },
  socialRow: { display: "flex", gap: "12px" },
  socialIconBox: { width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },

  newsletterBox: { width: "280px" },
  miniHeading: { fontSize: "10px", fontWeight: "800", letterSpacing: "1.5px" },
  form: { display: "flex", borderBottom: "1px solid rgba(255,255,255,0.4)", paddingBottom: "5px" },
  input: { background: "none", border: "none", color: "white", outline: "none", fontSize: "11px", flex: 1 },
  joinBtn: { background: "none", border: "none", color: "white", cursor: "pointer", padding: "0 5px" },

  divider: { height: "1px", background: "rgba(255,255,255,0.1)", margin: "30px 0" },
  
  grid: { marginBottom: "30px" },
  groupHeading: { fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "15px", opacity: 0.9 },
  
  trustColumn: { display: 'flex', flexDirection: 'column', gap: '10px' },
  trustItem: { display: "flex", alignItems: "center", gap: "8px", fontSize: "9px", fontWeight: "700", letterSpacing: "1px", opacity: 0.8 },

  bottomBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' },
  copyright: { fontSize: "9px", color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase" },
  topBtn: { background: "none", border: "none", color: "#fff", fontSize: "9px", fontWeight: "900", cursor: "pointer", opacity: 0.6, letterSpacing: "1px" }
};
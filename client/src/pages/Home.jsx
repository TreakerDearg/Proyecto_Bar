import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { motion } from "framer-motion";
import "../styles/page/Home.css";

const Home = () => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    playing ? audioRef.current.pause() : audioRef.current.play();
    setPlaying(!playing);
  };

  return (
    <div className="tn-wrapper">

      {/* ======================================================
          AUDIO PLAYER
      ====================================================== */}
      <audio ref={audioRef} src="/audio/synthwave-tech.mp3" loop />

      <button className="tn-audio-toggle" onClick={toggleAudio} aria-label="Control de audio">
        {playing ? <FiVolume2 size={24} /> : <FiVolumeX size={24} />}
      </button>

      {/* ======================================================
          GLOBAL DECORATIONS
      ====================================================== */}

      {/* Glow orbs */}
      <div className="tn-orb orb-1"></div>
      <div className="tn-orb orb-2"></div>

      {/* Light beams */}
      <div className="tn-beam beam-left"></div>
      <div className="tn-beam beam-right"></div>

      {/* Radial neon behind card */}
      <div className="tn-radial"></div>

      {/* Floating vertical neon lines */}
      <div className="tn-lines"></div>

      {/* Edge rainbow borders */}
      <div className="tn-edge-left"></div>
      <div className="tn-edge-right"></div>

      {/* Floating synthwave symbols */}
      {["✦", "✹", "✶", "✧", "✺", "✪"].map((sym, i) => (
        <div key={i} className={`tn-float-symbol fs${i + 1}`}>{sym}</div>
      ))}

      {/* VHS Effects */}
      <div className="tn-scanlines"></div>
      <div className="tn-vhs-flicker"></div>
      <div className="tn-vhs-noise"></div>

      {/* HUD Corner Decorations */}
      {["tl", "tr", "bl", "br"].map((pos) => (
        <svg key={pos} className={`tn-corner-deco ${pos}`} viewBox="0 0 140 140">
          <defs>
            <linearGradient id={`grad-${pos}`} x1="0" x2="1">
              <stop offset="0" stopColor="#0ff" />
              <stop offset="1" stopColor="#ff00e1" />
            </linearGradient>
          </defs>
          <polyline
            points="10,10 130,10 130,30 30,30 30,130 10,130 10,10"
            fill="none"
            stroke={`url(#grad-${pos})`}
            strokeWidth="2"
          />
        </svg>
      ))}

      {/* ======================================================
          MAIN CARD CONTENT
      ====================================================== */}
      <motion.main
        className="tn-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Retro SVG Logo */}
        <svg className="tn-logo" viewBox="0 0 200 60">
          <defs>
            <linearGradient id="logoGrad" x1="0" x2="1">
              <stop offset="0" stopColor="#0ff" />
              <stop offset="1" stopColor="#ff00e1" />
            </linearGradient>
          </defs>

          <text
            x="100"
            y="38"
            fontSize="28"
            textAnchor="middle"
            fill="url(#logoGrad)"
            fontFamily="Orbitron, sans-serif"
          >
            RETROBAR
          </text>
        </svg>

        <h1 className="tn-title">RETROBAR</h1>
        <p className="tn-lead">Neon Nights • Tech Noir • Future Drinks</p>

        {/* Divider */}
        <div className="tn-divider">
          <span></span>
          <svg width="40" height="8">
            <rect width="100%" height="2" fill="#0ff" opacity="0.7"></rect>
          </svg>
          <span></span>
        </div>

        {/* Buttons */}
        <div className="tn-actions">
          <Link to="/tragos" className="tn-btn solid">Ver Tragos</Link>
          <Link to="/ruleta" className="tn-btn outline">Ruleta</Link>
        </div>

        {/* Tags */}
        <motion.div
          className="tn-meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <span>Estética Synthwave · </span>
          <span> Neon Dreams · </span>
          <span> Beats 80's</span>
        </motion.div>

        {/* Decorative quote */}
        <motion.div
          className="tn-quote"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <p>“The night belongs to neon.”</p>
        </motion.div>
      </motion.main>

      {/* ======================================================
          RETRO FUTURE GRID
      ====================================================== */}
      <svg className="tn-grid" viewBox="0 0 800 200">
        <defs>
          <linearGradient id="gridGrad" x1="0" x2="1">
            <stop offset="0" stopColor="#00eaff" stopOpacity="0.25" />
            <stop offset="1" stopColor="#ff00e1" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <g stroke="url(#gridGrad)" fill="none" strokeWidth="1">
          {[...Array(10)].map((_, i) => (
            <line key={`h-${i}`} x1="0" x2="800" y1={40 + i * 16} y2={40 + i * 16} />
          ))}

          {[...Array(18)].map((_, i) => (
            <line key={`v-${i}`} x1={i * 50} x2="400" y1="200" y2="40" />
          ))}
        </g>
      </svg>


      

      {/* ======================================================
          FOOTER
      ====================================================== */}
      <footer className="tn-footer">
        RETROBAR • 2025 • Por leandro Ferreira
      </footer>
    </div>
  );
};

export default Home;

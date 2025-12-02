import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tragoCard.css";

export default function DigitalCard({ trago }) {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [phase, setPhase] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ===========================================================
     MATRIX EFFECT
  ============================================================ */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const columns = Math.floor(width / 14);
    const drops = Array(columns).fill(1);

    const fontSize = 14;
    const characters = "01";

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#ffffff";
      ctx.font = fontSize + "px Share Tech Mono";

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ===========================================================
     PHASE TIMING
  ============================================================ */
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 700),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 2100),
      setTimeout(() => setPhase(4), 2400),
      setTimeout(() => setPhase(5), 3400),
      setTimeout(() => setPhase(6), 4200)
    ];

    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  /* ===========================================================
     ACTION — CLICK EN CARD → MOSTRAR CONFIRMACIÓN
  ============================================================ */
  const handleCardClick = () => {
    setShowConfirm(true);
  };

  const confirmPedido = () => {
    navigate(`/pedido/${trago.id}`);
  };

  return (
    <>
      {/* CARD */}
      <div className="digital-card" onClick={handleCardClick}>
        {/* Fog */}
        <div className="volumetric-fog">
          <div className="fog-layer purple"></div>
          <div className="fog-layer blue"></div>
        </div>

        {/* Matrix */}
        <div className="matrix-rain">
          <canvas ref={canvasRef}></canvas>
        </div>

        {/* Crack */}
        {phase >= 1 && <div className="crack-layer"></div>}

        {/* Scramble */}
        {phase >= 2 && <div className="pixel-scramble"></div>}

        {/* Light sweep */}
        {phase >= 3 && <div className="light-sweep"></div>}

        {/* Img reveal */}
        {phase >= 4 && (
          <img src={trago.img} alt={trago.nombre} className="trago-img" />
        )}

        {/* Dissolve */}
        {phase >= 5 && <div className="img-dissolve"></div>}

        {/* Info */}
        {phase >= 6 && (
          <div className="info-section">
            <h3 className="trago-title">{trago.nombre}</h3>

            <ul className="ingredientes-list">
              {trago.ingredientes.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ===========================================================
          MODAL DE CONFIRMACIÓN
      ============================================================ */}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>¿Deseas pedir este trago?</h3>
            <p>{trago.nombre}</p>

            <div className="confirm-buttons">
              <button className="btn-si" onClick={confirmPedido}>
                Sí, pedir
              </button>
              <button className="btn-no" onClick={() => setShowConfirm(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

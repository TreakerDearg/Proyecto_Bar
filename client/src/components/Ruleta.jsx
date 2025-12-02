import React, { useEffect, useRef } from "react";
import { Howl } from "howler";
import "../styles/ruleta.css";

export default function Ruleta({ tragos, girando, angulo }) {
  const tickRef = useRef(null);
  const lastSectorRef = useRef(null);

  // Inicializar sonido tick
  useEffect(() => {
    tickRef.current = new Howl({
      src: ["https://freesound.org/data/previews/256/256113_3263906-lq.mp3"], // Sonido ejemplo
      volume: 0.5
    });
  }, []);

  // Reproducir tick al pasar de sector
  useEffect(() => {
    if (!girando || !tickRef.current) return;

    const sectorAngle = 360 / tragos.length;
    let lastSector = lastSectorRef.current ?? Math.floor((360 - (angulo % 360)) / sectorAngle);

    const interval = setInterval(() => {
      const currentSector = Math.floor((360 - (angulo % 360)) / sectorAngle);

      if (currentSector !== lastSector) {
        tickRef.current.play();
        lastSector = currentSector;
      }
    }, 50); // cada 50ms

    return () => clearInterval(interval);
  }, [girando, angulo, tragos.length]);

  return (
    <div className="ruleta-wrapper">
      {/* HALO glow */}
      <div className={`ruleta-halo ${girando ? "active" : ""}`}></div>

      {/* RGB ring exterior */}
      <div className={`ruleta-rgb-ring ${girando ? "spin" : ""}`}></div>

      <div className="ruleta-container">
        {/* Ruleta principal */}
        <div
          className={`ruleta ${girando ? "girando" : ""}`}
          style={{ transform: `rotate(${angulo}deg)` }}
        >
          {tragos.map((t, i) => (
            <div
              key={i}
              className="ruleta-item"
              style={{ transform: `rotate(${(360 / tragos.length) * i}deg)` }}
            >
              <span>{t.nombre}</span>
            </div>
          ))}
        </div>

        {/* Disco interior */}
        <div className="ruleta-inner-disc"></div>

        {/* LEDs alrededor */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`ruleta-led led-${i + 1} ${girando ? "active" : ""}`}></div>
        ))}

        {/* Puntero HUD */}
        <div className={`ruleta-puntero ${girando ? "active" : ""}`}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <polygon
              points="20,0 30,20 20,16 10,20"
              fill="#ff2bd7"
              filter="url(#glow)"
            />
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>

        {/* Chispa al detenerse */}
        <div className={`ruleta-spark ${girando ? "" : "active"}`}></div>
      </div>
    </div>
  );
}

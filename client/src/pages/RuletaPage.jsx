import React, { useState } from "react";
import { Howl } from "howler";
import Ruleta from "../components/Ruleta";
import RuletaButton from "../components/RuletaButton";
import RuletaResultado from "../components/RuletaResultado";
import PedidoForm from "../components/PedidoForm";
import "../styles/page/ruletaPage.css";

const tragos = [
  { nombre: "Neon Mojito", descripcion: "Menta radiante + glow ácido" },
  { nombre: "Electric Sunset", descripcion: "Vodka, naranja y un final eléctrico" },
  { nombre: "Vaporwave Tonic", descripcion: "Gin + Tónica retro futurista" },
  { nombre: "Pink Nebula", descripcion: "Frutos rojos con cosmos dulce" },
  { nombre: "Blue Galaxy", descripcion: "Lima + azul profundo espacial" },
  { nombre: "Cyber Daiquiri", descripcion: "Daiquiri versión digital" }
];

// Instancia de Howler para el sonido de la ruleta
const sonidoRuleta = new Howl({
  src: ["/audio/synthwave-tech.mp3"],
  loop: true,
  volume: 0.5
});

export default function RuletaPage() {
  const [girando, setGirando] = useState(false);
  const [angulo, setAngulo] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [confirmado, setConfirmado] = useState(false);

  const girarRuleta = () => {
    if (girando) return;

    // Reset
    setResultado(null);
    setConfirmado(false);
    setGirando(true);

    // Reproducir sonido
    sonidoRuleta.play();

    const vueltas = 360 * 5;
    const anguloRandom = Math.floor(Math.random() * 360);
    const anguloFinal = vueltas + anguloRandom;

    setAngulo(anguloFinal);

    // Termina el giro
    setTimeout(() => {
      sonidoRuleta.stop();
      const index = Math.floor(
        ((360 - (anguloFinal % 360)) % 360) / (360 / tragos.length)
      );
      setResultado(tragos[index]);
      setGirando(false);
    }, 4500);
  };

  // Función para reiniciar la ruleta sin iniciar el giro
  const reiniciarRuleta = () => {
    setResultado(null);
    setConfirmado(false);
    setAngulo(0);
    setGirando(false);
  };

  // Función para reiniciar y girar automáticamente
  const reiniciarYGirar = () => {
    reiniciarRuleta();
    setTimeout(() => girarRuleta(), 100);
  };

  if (confirmado && resultado) {
    return <PedidoForm tragoSeleccionado={resultado} />;
  }

  return (
    <div className="ruleta-page">

      {/* Decoración láser superior */}
      <div className="ruleta-laser-line"></div>

      {/* Título principal */}
      <h1 className="titulo-retro">
        Ruleta de Tragos
        <span className="titulo-brillo"></span>
      </h1>
      <p className="ruleta-sub">
        Girá y deja que el destino elija tu trago 💫
      </p>

      {/* Contenedor estilo panel arcade */}
      <div className="ruleta-panel">

        {/* Glow de fondo */}
        <div className="ruleta-aura"></div>

        {/* Ruleta */}
        <div className="ruleta-wrapper">
          <Ruleta tragos={tragos} girando={girando} angulo={angulo} />
        </div>

        {/* Botón de girar */}
        {!resultado && (
          <div className="ruleta-btn-wrapper">
            <RuletaButton onClick={girarRuleta} disabled={girando} />
          </div>
        )}

        {/* Resultado con botón de volver a tirar */}
        {resultado && (
          <div className="ruleta-res-wrapper">
            <RuletaResultado
              trago={resultado}
              onConfirm={() => setConfirmado(true)}
              onRetry={reiniciarYGirar} // Botón volver a tirar
            />
          </div>
        )}

      </div>

      {/* LED decorativos inferiores */}
      <div className="ruleta-led-strip">
        <span className="led led-1"></span>
        <span className="led led-2"></span>
        <span className="led led-3"></span>
        <span className="led led-4"></span>
      </div>
    </div>
  );
}

import React from "react";
import "./main.css";
import { Button } from "../components/button/button";

export function Main() {
  return (
    <div className="main">
      <div className="main__info">
        <h1 className="main__title">HUNDRED</h1>
        <span className="main__description">
          ¡Tu asistente con IA sin relación con el restaurante HUNDRED favorito!
        </span>
      </div>
      <div className="main__functions">
        <h3 className="main__functions__description">
          Herramientas disponibles
        </h3>
        <span></span>
      </div>
      <Button onClick={() => { console.log('a')}} text="Grabar" disabled={false} />
    </div>
  );
}

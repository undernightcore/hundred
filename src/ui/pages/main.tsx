import React, { useEffect, useState } from "react";
import "./main.css";
import { Button } from "../components/button/button";

export function Main() {
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    getStream();
  }, []);

  async function getStream() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorder.ondataavailable = submitAudio

    setRecorder(mediaRecorder);
  }

  async function submitAudio(event: BlobEvent) {
    const audio = await event.data.arrayBuffer();
    const response = await window.functions.prompt(audio);

    const message = new SpeechSynthesisUtterance(response);
    speechSynthesis.speak(message);
  }

  async function startRecording() {
    recorder.start();
    setRecording(true);
  }

  async function stopRecording() {
    recorder.stop();
    setRecording(false);
  }

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
      <Button
        onClick={() => (recording ? stopRecording() : startRecording())}
        text={recording ? "Escuchando..." : "Hablar"}
        disabled={!recorder}
      />
    </div>
  );
}

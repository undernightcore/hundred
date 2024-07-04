import React, { useEffect, useState } from "react";
import "./main.css";
import { Button } from "../components/button/button";

export function Main() {
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [recording, setRecording] = useState(false);
  const [tools, setTools] = useState<{ name: string; description: string }[]>(
    [],
  );

  useEffect(() => {
    getStream();
    getTools();
  }, []);

  async function getStream() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorder.ondataavailable = submitAudio;

    setRecorder(mediaRecorder);
  }

  async function getTools() {
    setTools(await window.functions.getAll())
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
        <div className="main__functions__list">
          {tools.map((tool) => <div>
            <h4>{ tool.name }</h4>
            <span>{ tool.description }</span>
          </div>)}
        </div>
      </div>
      <Button
        onClick={() => (recording ? stopRecording() : startRecording())}
        text={recording ? "Escuchando..." : "Hablar"}
        disabled={!recorder}
      />
    </div>
  );
}

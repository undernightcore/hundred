export async function transcribeAudio(audio: ArrayBuffer) {
  const formData = new FormData();
  formData.set("audio_file", new Blob([audio]));

  const response = await fetch("http://localhost:9001/asr?language=es", {
    method: "POST",
    body: formData,
  });

  return response.text();
}

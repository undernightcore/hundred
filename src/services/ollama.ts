export async function inferFromLLM(prompt: string, raw: boolean) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    body: JSON.stringify({
      model: "mistral",
      stream: false,
      prompt,
      raw,
      options: {
        temperature: 1
      }
    }),
  });

  const result: { response: string } = await response.json();
  return result.response;
}

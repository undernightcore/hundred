export async function inferFromLLM(
  prompt: string,
  raw: boolean,
  model: string,
) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    body: JSON.stringify({
      model,
      stream: false,
      prompt,
      raw,
      keep_alive: '60m'
    }),
  });

  const result: { response: string } = await response.json();
  return result.response;
}

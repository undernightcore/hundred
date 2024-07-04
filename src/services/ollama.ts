import {parseMistralToolCall, prepareMistralToolPrompt} from "../helpers/tools";

export async function inferFromMistral(
  prompt: string,
) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    body: JSON.stringify({
      model: 'mistral',
      stream: false,
      prompt: prepareMistralToolPrompt(prompt),
      raw: true,
    }),
  });

  const result: { response: string } = await response.json();
  return parseMistralToolCall(result.response);
}

export async function inferFromLlama (
    prompt: string,
) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    body: JSON.stringify({
      model: 'llama3',
      stream: false,
      prompt,
    }),
  });

  const result: { response: string } = await response.json();
  return result.response;
}

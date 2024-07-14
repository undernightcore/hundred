import { tools } from "../helpers/tools";
import { OllamaFunctions } from "@langchain/community/experimental/chat_models/ollama_functions";
import { HumanMessage } from "@langchain/core/messages";
import { Ollama } from "@langchain/community/llms/ollama";

const functionModel = new OllamaFunctions({
  temperature: 0.1,
  model: "gemma2",
}).bind({
  functions: Object.values(tools).map((tool) => tool.schema),
});

const chatModel = new Ollama({ model: "gemma2" });

export async function getFunctionCall(prompt: string) {
  const response = await functionModel.invoke([
    new HumanMessage({
      content: prompt,
    }),
  ]);

  return response.additional_kwargs.function_call;
}

export function getLLMResponse(prompt: string) {
  return chatModel.invoke([
    new HumanMessage({
      content: prompt,
    }),
  ]);
}

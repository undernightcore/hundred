import OpenAI from "openai";
import * as process from "node:process";
import { tools } from "../helpers/tools";
import { configDotenv } from "dotenv";

configDotenv();

const openai = new OpenAI({
  apiKey: process.env.OPEANAI_API,
});

export async function inferFromOpenAI(prompt: string) {
  const functions = Object.values(tools).map((tool) => tool.schema);
  const data = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo-0125",
    tools: functions,
  });

  const call = data.choices[0].message.tool_calls?.[0].function;
  return { name: call.name, arguments: JSON.parse(call.arguments) };
}

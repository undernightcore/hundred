import { getWeatherTool } from "../tools/weather";
import { getHundredTool } from "../tools/hundred";

const tools = {
  get_current_weather: getWeatherTool,
  order_burgers: getHundredTool,
};

export function prepareToolPrompt(question: string) {
  const toolList = Object.values(tools).map(({ schema }) => schema);
  const prompt = question
    .trim()
    .replace(/\n|\r/g, "")
    .replace(/ +(?= )/g, "");
  return `[AVAILABLE_TOOLS]${JSON.stringify(toolList)}[/AVAILABLE_TOOLS][INST] ${prompt} [/INST]`;
}

export function parseToolCall(text: string) {
  const toolCall = text.replace("[TOOL_CALLS]", "").match(/\[(.*)\]/)[1];
  return JSON.parse(toolCall);
}

export function executeFunction(name: keyof typeof tools, args: any) {
  return tools[name].implementation(args)
}

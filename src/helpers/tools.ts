import { getWeatherTool } from "../tools/weather";

const tools = {
  weather: getWeatherTool,
};

export function prepareToolPrompt(question: string) {
  const toolList = Object.values(tools).map(({ schema }) => schema);
  return `[AVAILABLE_TOOLS]${JSON.stringify(toolList)}[/AVAILABLE_TOOLS][INST] ${question} [/INST]`;
}

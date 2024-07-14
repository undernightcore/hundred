import { getWeatherTool } from "../tools/weather";
import { getHundredTool } from "../tools/hundred";

export const tools = [getWeatherTool, getHundredTool];

export function executeFunction(name: string, args: any) {
  return tools.find((tool) => tool.schema.name === name).implementation(args);
}

import * as process from "node:process";
import OpenAI from "openai";
import ChatCompletionTool = OpenAI.ChatCompletionTool;

const schema: ChatCompletionTool = {
  type: "function",
  function: {
    name: "get_current_weather",
    description: "Get the current weather",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description:
            "The city and country, if the country is not present infer from city e.g. Madrid, Spain",
        },
        format: {
          type: "string",
          enum: ["metric", "imperial"],
          description:
            "The unit to use. U.S., Liberia and Myanmar use imperial and the rest metric, ALWAYS infer this from the country or guess",
        },
      },
      required: ["location", "format"],
    },
  },
};

interface ImplementationProps {
  location: string;
  format: string;
}

const implementation = async ({ location, format }: ImplementationProps) => {
  const geolocation = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${process.env.WEATHER_API}`,
  ).then((res) => res.json());

  const coordinates = { lat: geolocation[0].lat, lon: geolocation[0].lon };

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=${format ?? "metric"}&appid=${process.env.WEATHER_API}`,
  ).then((res) => res.text());

  return (question: string) =>
    `Responde la pregunta del usuario ${question} con la información del tiempo ${response}`;
};

export const getWeatherTool = { schema, implementation };

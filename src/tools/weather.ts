import * as process from "node:process";

const schema = {
  type: "function",
  function: {
    name: "get_current_weather",
    description: "Get the current weather",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. Madrid, Spain",
        },
        format: {
          type: "string",
          enum: ["metric", "imperial"],
          description:
            "The unit to use. U.S., Liberia and Myanmar use imperial and the rest metric, infer this from the user",
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
    `http://api.openweathermap.org/geo/1.0/direct?q=Sevilla, España&limit=5&appid=${process.env.WEATHER_API}`,
  ).then((res) => res.json());

  const coordinates = { lat: geolocation[0].lat, lon: geolocation[0].lon };

  const weather = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${process.env.WEATHER_API}`,
  ).then((res) => res.json());


};

export const getWeatherTool = { schema, implementation };

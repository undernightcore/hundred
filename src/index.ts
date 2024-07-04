import { app, BrowserWindow, ipcMain } from "electron";
import { transcribeAudio } from "./services/whisper";
import { inferFromLlama, inferFromMistral } from "./services/ollama";
import { executeFunction, tools } from "./helpers/tools";
import { configDotenv } from "dotenv";
import { inferFromOpenAI } from "./services/openai";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

configDotenv();

if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 400,
    width: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.setMenu(null);
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("prompt", async (_, audio: ArrayBuffer) => {
  console.clear();

  const transcription = await transcribeAudio(audio);
  console.log(transcription);

  const toolCall = await inferFromOpenAI(transcription);
  console.log(JSON.stringify(toolCall, null, 2));

  const tool = await executeFunction(
    toolCall.name as keyof typeof tools,
    toolCall.arguments,
  );
  const cookedResponse = tool(transcription);
  console.log(cookedResponse);

  const response = await inferFromLlama(cookedResponse);
  console.log(response);

  return response;
});

ipcMain.handle("getAll", () =>
  Object.values(tools).map((tool) => ({
    name: tool.schema.function.name,
    description: tool.schema.function.description,
  })),
);

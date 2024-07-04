import { pipeline } from "@xenova/transformers";
import * as process from "node:process";

export async function textToSpeech(text: string) {
  const pipe = await pipeline("text-to-speech", "Xenova/mms-tts-spa", {
    cache_dir: `${process.cwd()}/models`,
    quantized: false,
  });

  return pipe(text, {});
}

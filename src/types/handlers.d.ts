interface FunctionsInterface {
  prompt: (audio: ArrayBuffer) => Promise<string>;
  getAll: () => Promise<{ name: string; description: string }[]>;
}

export declare global {
  interface Window {
    functions: FunctionsInterface;
  }
}

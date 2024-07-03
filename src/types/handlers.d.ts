interface FunctionsInterface {
    prompt: (audio: ArrayBuffer) => Promise<string>;
}

export declare global {
    interface Window {
        functions: FunctionsInterface;
    }
}
import { pipeline } from '@xenova/transformers';

export async function textToSpeech(message: string) {
    let pipe = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');

    return pipe('I love you dude!');
}
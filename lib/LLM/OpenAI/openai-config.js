// const { nlp } = require("./lib/LLM/OpenAI/openai-connector");
module.exports = {
    DEFAULT_MODELS:{
        completions:'gpt-4-turbo-2024-04-09',
        embedding:'text-embedding-3-small',
        classification:'text-moderation-007',
        fineTune:'gpt-3.5-turbo-0125',
        textToSpeech:'tts-1',
        speech:'whisper-1',
        vision:'gpt-4-vision-preview',
        imageCreate:'dall-e-3',
        image:'dall-e-2'
    },
    DEFAULT_VOICE : 'onyx'
}
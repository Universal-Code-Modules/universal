// const tr = require('./lib/EMAIL/translations');
// console.log(tr('en', 'passwordResetSubject', {domain: 'domain.com'}))
// console.log(tr('ru', 'passwordResetSubject', {domain: 'domain.com'}))
// console.log(tr('en', 'passwordResetContent', {username: 'John', link: 'https://domain.com', domain: 'domain.com'}))
// console.log(tr('ru', 'passwordResetContent', {username: 'John', link: 'https://domain.com', domain: 'domain.com'}))
// console.log(tr('en', 'emailConfirmationSubject', {domain: 'domain.com'}))
// console.log(tr('ru', 'emailConfirmationSubject', {domain: 'domain.com'}))
// console.log(tr('en', 'emailConfirmationContent', {username: 'John', link: 'https://domain.com', domain: 'domain.com'}))
// console.log(tr('ru', 'emailConfirmationContent', {username: 'John', link: 'https://domain.com', domain: 'domain.com'}))

// const ollamaConnector = require('./lib/LLM/Ollama/ollama-connector');
// const HFConnector = require('./lib/LLM/Huggingface/huggingface-connector');
const ELConnector = require('./lib/LLM/Elevenlabs/elevenlabs-connector');
const test = async () => {  
    // const res = await ollamaConnector.completeon([{ role: 'user', content: 'Why is the sky blue?' }]);
    // console.log(res);
    // const res = await HFConnector.textTranslation();
    // console.log(res);
    // const res = await ELConnector.textToSpeech('Hello, how can I help you?', './temp/audio.mp3');
    const res = await ELConnector.getVoice();
    
}
test();
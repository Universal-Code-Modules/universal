// const tr = require('./lib/EMAIL/translations');
// console.log(tr('en', 'passwordResetSubject', {domain: 'domain.com'}))
// console.log(tr('ru', 'passwordResetSubject', {domain: 'domain.com'}))
// console.log(tr('en', 'passwordResetContent', {username: 'John', link: 'https://domain.com', domain: 'domain.com'}))
// console.log(tr('ru', 'passwordResetContent', {username: 'John', link: 'https://domain.com', domain: 'domain.com'}))
// console.log(tr('en', 'emailConfirmationSubject', {domain: 'domain.com'}))
// console.log(tr('ru', 'emailConfirmationSubject', {domain: 'domain.com'}))
// console.log(tr('en', 'emailConfirmationContent', {username: 'John', link: 'https://domain.com', domain: 'domain.com'}))
// console.log(tr('ru', 'emailConfirmationContent', {username: 'John', link: 'https://domain.com', domain: 'domain.com'}))
// const sendgrid = require('./lib/EMAIL/sendgrid_email');
// const openaiConnector = require('./lib/LLM/OpenAI/openai-connector');
// const HFConnector = require('./lib/LLM/Huggingface/huggingface-connector');
// const ollamaConnector = require('./lib/LLM/Ollama/ollama-connector');
// const ELConnector = require('./lib/LLM/Elevenlabs/elevenlabs-connector');

// const test = (...args) => { console.log(...args)}
// const _ = require('lodash');

// const obj = {
//     foo: 'bar',
//     test: function () {
//         return this.foo;
//     },
//     test1: () => {
//         return this.foo;
//     },
//     child: {
//         foo: 'baz',
//         test: function () {
//             return this.foo;
//         },
//         test1: () => {
//             return this.foo;
//         }
//     }
// };


(async () => {
    // const res = await ollamaConnector.completeon([{ role: 'user', content: 'Why is the sky blue?' }]);
    // console.log(res);
    // const res = await HFConnector.textTranslation();
    // console.log(res);
    // const res = await ELConnector.textToSpeech('Hello, how can I help you?', './temp/audio.mp3');
    // const res = await require('./lib/LLM/Elevenlabs/elevenlabs-connector').getVoice();
    // test({foo:'bar'})
    // const link = obj['test'];
    // const link1 = obj['test1'];
    // console.log(obj.test(), obj.test1(), link.call(obj), link1());
    // console.log('aaa')
    const res = await require('./lib/LLM/OpenAI/openai-connector').completion([{ role: 'user', content: 'How are you?' }]);
    console.log(res);

})();
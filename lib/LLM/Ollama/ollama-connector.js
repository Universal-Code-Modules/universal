require('dotenv').config();
const ut = require('../../utilities');
const { Ollama } = require('ollama');
const TEST = process.env.NODE_ENV == 'test';

const ollama = new Ollama({ host: 'http://localhost:11434' })

class OllamaConnector {
    constructor() {
        
    }
    
    /*
        (messages = [{ role: 'user', content: 'Why is the sky blue?' }],

    */
    async completeon(messages = [], 
            system =`You are a useful assistant. You can answer questions, provide information, and help with tasks.`, model = 'llama2', stream = false) {
        
        const result =  await ollama.chat({
            messages:[
                {
                  "role": "system",
                  "content": system
                },
                ...messages
              ],
            model
          })
          if (TEST) console.log(result);
          return result.message;
    }
    
}
module.exports = new OllamaConnector();
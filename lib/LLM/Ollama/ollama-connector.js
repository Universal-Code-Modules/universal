require('dotenv').config();
const ut = require(process.cwd() + '/utilities');
const { Ollama } = require('ollama');


let ollama;
  try {
    ollama = new Ollama({ host: 'http://localhost:11434' })
  }
  catch (error) { 
    throw new Error('Ollama is not running')
    process.exit(1)
  }
  
    /*
        (messages = [{ role: 'user', content: 'Why is the sky blue?' }],

    */
    const completion = async (messages = [], 
      system = `You are a useful assistant. You can answer questions, provide information, and help with tasks.`,
      model = 'llama2',
      stream = false) => {
      
        const response = await ut.callAPI(ollama, 'ollama.chat', {
            messages:[
                {
                  "role": "system",
                  "content": system
                },
                ...messages
              ],
            model
          })
          
          return response.message;
    }
    


module.exports = {
  completion
}
const OAIConnector = require('./lib/LLM/OpenAI/openai-connector');

const testOA = async()=>{
    const data = await OAIConnector.completion([{
        "role": "user",
        "content": "how are you doing?"
    }]);
    console.log(data)
}

testOA();
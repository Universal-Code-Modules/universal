const {
    completion
    
}  = require('../ollama-connector');
console.log(completion)

// Default timeout
jest.setTimeout(20000);

// Ollama
describe('Ollama Connector', () => {
    test('Completion', async () => {
        const data = await completion([{
            "role": "user",
            "content": "how are you doing?"
        }]);
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
})



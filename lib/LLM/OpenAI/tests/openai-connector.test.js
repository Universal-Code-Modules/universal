const OAIConnector = require('../openai-connector');

test('Openai Completion', async () => {
    const data = await OAIConnector.completion([{
        "role": "user",
        "content": "how are you doing?"
    }]);
    // console.log(data)
    expect(data.message.role).toBe('assistant');
  });
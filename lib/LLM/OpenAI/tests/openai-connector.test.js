const {
    completion,
    textModeration,
    textToSpeech,
    speechToText,
    speechTranslation,
    createImage,
    test,
    createAssistant,
    retrieveAssistant,
    updateAssistant,
    createThread,
    retrieveThread,
    addMessageToThread,
    runThread,
    retrieveRun,
    retrieveThreadMessages,
    cleanThreadMessages,
    getRunLogs
}
    = require('../openai-connector');

const assistant = { id: '', 'threads': [], } 
const thread = { id: '', runs: [] }
const run = { id: '' }

// Default timeout
jest.setTimeout(20000);

//  
describe('Openai Connector', () => {

    test('Completion', async () => {
        const data = await completion([{
            "role": "user",
            "content": "how are you doing?"
        }]);
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });


    test('textModeration', async () => {
        const data = await textModeration('I will kill you sailor');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
  


    test('textToSpeech', async () => {
        const data = await textToSpeech('I will kill you sailor');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });

    test('speechToText', async () => {
        const data = await speechToText('I will kill you sailor');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });

    test('speechTranslation', async () => {
        const data = await speechTranslation('I will kill you sailor');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });

    test('createImage', async () => {
        const data = await createImage('I will kill you sailor');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });

    test('createAssistant', async () => {
        const data = await createAssistant('I will kill you sailor');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });

    test('retrieveAssistant', async () => {
        const data = await retrieveAssistant('I will kill you sailor');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
    test('updateAssistant', async () => {
        const data = await updateAssistant('I will kill you sailor');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
  
    test('createThread', async () => {
        const data = await createThread('I will kill you sailor');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
    test('retrieveThread', async () => {
        const data = await retrieveThread('I will kill you sailor');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });

    test('addMessageToThread', async () => {
        const data = await addMessageToThread('I will kill you sailor');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
  
    test('runThread', async () => {
        const data = await runThread('I will kill you sailor');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
  
    test('retrieveRun', async () => {
        const data = await retrieveRun('I will kill you sailor');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
    test('retrieveRun', async () => {
        const data = await retrieveRun('I will kill you sailor');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
    test('retrieveThreadMessages', async () => {
        const data = await retrieveThreadMessages('I will kill you sailor');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
    test('cleanThreadMessages', async () => {
        const data = await cleanThreadMessages('I will kill you sailor');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
  
    test('getRunLogs', async () => {
        const data = await getRunLogs('I will kill you sailor');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
    
})

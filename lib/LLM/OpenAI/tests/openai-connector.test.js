const {
    //TEXT
    completion,

    functionCall,
    fineTune,
    makeEmbedding,
  
    textModeration,
    //AUDIO
    textToSpeech,
    speechToText,
    speechTranslation,
    //IMAGES
    createImage,
    editImage,
    imageVariation,
    //VISION


    //ASSISTANTS
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
    getRunLogs,

    test
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
        expect(data.message.role).toBe('assistant');
    });


    test('textModeration', async () => {
        const data = await textModeration('I will kill you boatman');
        expect(data.flagged).toBe(true);
        expect(data.categories.violence).toBe(true);
        expect(data.category_scores).toHaveProperty('violence');
    });
  


    test('textToSpeech', async () => {
        const data = await textToSpeech('Hello there', './tests/test-speech.mp3');
        expect(Buffer.isBuffer(data)).toBe(true);
    });

    test('speechToText', async () => {
        const data = await speechToText('./tests/test-speech.mp3');
        expect(data).toBe('Hello there.');
    });

    test('speechTranslation', async () => {
        const data = await speechTranslation('./tests/test-speech.mp3');
        expect(data).toBe('Hello there.');
    });

    test('createImage', async () => {
        const data = await createImage("a white siamese cat");
        expect(data).toHaveProperty('url');
    });

    test('editImage', async () => {
        const data = await editImage("a white siamese cat", './tests/test_original.png');
        expect(data).toHaveProperty('url');
    });

    test('imageVariation', async () => {
        const data = await imageVariation('./tests/test-image.png');
        expect(data).toHaveProperty('url');
    });

    test('imageRecognition', async () => {
        const data = await imageRecognition('https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg');
        expect(data).toHaveProperty('message');
    });


    test('createAssistant', async () => {
        const data = await createAssistant('I will kill you boatman');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });

    test('retrieveAssistant', async () => {
        const data = await retrieveAssistant('I will kill you boatman');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
    test('updateAssistant', async () => {
        const data = await updateAssistant('I will kill you boatman');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
  
    test('createThread', async () => {
        const data = await createThread('I will kill you boatman');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
    test('retrieveThread', async () => {
        const data = await retrieveThread('I will kill you boatman');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });

    test('addMessageToThread', async () => {
        const data = await addMessageToThread('I will kill you boatman');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
  
    test('runThread', async () => {
        const data = await runThread('I will kill you boatman');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
  
    test('retrieveRun', async () => {
        const data = await retrieveRun('I will kill you boatman');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
    test('retrieveRun', async () => {
        const data = await retrieveRun('I will kill you boatman');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
    test('retrieveThreadMessages', async () => {
        const data = await retrieveThreadMessages('I will kill you boatman');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
    test('cleanThreadMessages', async () => {
        const data = await cleanThreadMessages('I will kill you boatman');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
  
    test('getRunLogs', async () => {
        const data = await getRunLogs('I will kill you boatman');
        // console.log(data)
        expect(data.message.role).toBe('assistant');
    });
    
})

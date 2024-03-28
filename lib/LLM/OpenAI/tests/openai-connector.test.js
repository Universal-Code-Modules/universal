const {
    //TEXT
   
    textGeneration,
    
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
    imageRecognition,
    videoRecognition,

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

    

    test('textGeneration', async () => {
        const data = await textGeneration({text:'Hello'});
        expect(data).toHaveProperty('message');
        expect(data).toHaveProperty('messages');
        expect(data).toHaveProperty('usages');
    });
   
    test('textGeneration with functionCall', async () => {
        const testLibrary = require('./tools/test-library');
        const data = await textGeneration({text: "What's the weather like in San Francisco, Tokyo, and Paris?", tools:testLibrary.tools});
        expect(data).toHaveProperty('message');
        expect(data).toHaveProperty('messages');
        expect(data).toHaveProperty('usages');
    });

    test('fineTune', async () => {
        const data = await fineTune({data:'Hello'});
        expect(data).toHaveProperty('embedding');
        expect(data).toHaveProperty('usage');
    });


    test('makeEmbedding', async () => {
        const data = await makeEmbedding({text:'Hello'});
        expect(data).toHaveProperty('embedding');
        expect(data).toHaveProperty('usage');
    });


    test('textModeration', async () => {
        const data = await textModeration({text:'I will kill you boatman'});
        expect(data.flagged).toBe(true);
        expect(data.categories.violence).toBe(true);
        expect(data.category_scores).toHaveProperty('violence');
    });
  


    test('textToSpeech', async () => {
        const data = await textToSpeech({text:'Hello there', pathToFile:'./test-speech.mp3'});
        expect(Buffer.isBuffer(data)).toBe(true);
    });

    test('speechToText', async () => {
        const data = await speechToText({pathToFile:'./test-speech.mp3'});
        expect(data).toBe('Hello there.');
    });

    test('speechTranslation', async () => {
        const data = await speechTranslation({pathToFile:'./test-speech.mp3'});
        expect(data).toBe('Hello there.');
    });

    test('createImage', async () => {
        const data = await createImage({text:"a white siamese cat"});
        expect(data).toHaveProperty('url');
    });

    test('editImage', async () => {
        const data = await editImage({text:"a white siamese cat", pathToFile:'./test_original.png'});
        expect(data).toHaveProperty('url');
    });

    test('imageVariation', async () => {
        const data = await imageVariation({pathToFile:'./test-image.png'});
        expect(data).toHaveProperty('url');
    });

    test('imageRecognitionLocal', async () => {
        const data = await imageRecognition({urlOrPath:'./test-image.jpg'});
        expect(data).toHaveProperty('message');
    });
    /*
    too heavy
    */
    // test('videoRecognition', async () => {
    //     const data = await videoRecognition('./test-video.mp4', './video-frames');
    //     expect(data).toHaveProperty('message');
    // });
    


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

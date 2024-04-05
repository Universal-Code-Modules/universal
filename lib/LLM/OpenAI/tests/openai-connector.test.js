const fs  = require ("fs");
const {
    //TEXT
   
    Chat, //class Chat
    // chat.message({text}) => {message, messages, usages} => string
    // chat.voiceMessage({inputFilePath, outputFilePath, voice}) => {inputText, outputText, outputFilePath}
    tokens,
    // tokens.count({text, model}) => integer
    nlp,
    // nlp.generate({text, messages, system, model, tools, tool_choice}) => {message, messages, usages}
    // nlp.embedding({text, model}) => {embedding, usage}
    // nlp.classification({text, model}) => responce
    files,
    // files.create({pathToFile, purpose}) => responce
    // files.list() => data (array)
    // files.retrieve({file_id}) => responce
    // files.content({file_id}) => responce
    // files.del({file_id}) => responce
    fineTune,
    // fineTune.create({pathToFile, training_file, hyperparameters, suffix, model, deleteFile, maxTokens}) => responce
    // fineTune.list() => data (array)
    // fineTune.events({id, limit}) => responce - does not work
    // fineTune.retrieve({id}) => responce
    // fineTune.cancel{({id}) => responce
    models,
    // models.list() => responce
    // models.retrieve({model_id}) => responce
    // models.del({model_id}) => responce
    images, 
    // images.create({text, pathToFile, size, quality, n, model}) => {url, local}
    // images.edit({text, pathToFile, pathToMask, size, n, model}) => responce
    // images.variation({pathToFile, size, n, model}) => responce
    speech,
    // speech.textToSpeech({text, pathToFile, voice, model}) => buffer
    // speech.speechToText({pathToFile, model}) => string
    // speech.speechTranslation({pathToFile, model}) => string // does not translate
    recognition,
    // recognition.image({url, pathToFile, prompt, max_tokens, model}) => {message, usage}
    // recognition.video({pathToFile, outputDir, max_tokens, model}) => {message, usage}
    assistants //test
    // assistants.create({name, instructions, tools, model}) => responce
    // assistants.list() => data (array)
    // assistants.retrieve({assistant_id}) => responce
    // assistants.update({assistant_id, name, instructions, tools, model, file_ids}) => responce
    // assistants.del({assistant_id}) => responce
  
   // assistants.files.create({file_id}) => responce
    // assistants.files.list({assistant_id}) => data (array)
    // assistants.files.retrieve({assistant_id, file_id}) => responce
    // assistants.files.del({assistant_id, file_id}) => responce
  
    // assistants.threads.create({messages = []}) => responce
    // assistants.threads.createAndRun({assistant_id, thread = {messages:[]}}) => responce
    // assistants.threads.retrieve({thread_id}) => responce
    // assistants.threads.update({thread_id, messages}) => responce
    // assistants.threads.del({thread_id}) => responce
  
    // assistants.threads.messages.create({thread_id, role, content}) => responce
    // assistants.threads.messages.list({thread_id, clean}) => data(array)
    // assistants.threads.messages.listFiles({thread_id, message_id}) => data (array) //does not work
    // assistants.threads.messages.retrieve({thread_id, message_id}) => responce
    // assistants.threads.messages.retrieveFile({thread_id, message_id, file_id}) => responce
    // assistants.threads.messages.update({thread_id, message_id, user_id}) => responce
   
    // assistants.threads.runs.create({thread_id, assistant_id}) => responce
    // assistants.threads.runs.list({thread_id}) => responce
    // assistants.threads.runs.retrieve({thread_id, run_id}) => responce
    // assistants.threads.runs.listRunSteps({thread_id, run_id, limit, clean}) => responce
    // assistants.threads.runs.retrieveRunStep({thread_id, run_id, step_id}) => responce
    // assistants.threads.runs.update({thread_id, run_id, data}) => responce
    // assistants.threads.runs.submitToolOutput({thread_id, run_id, output}) => responce
    // assistants.threads.runs.cancel({thread_id, run_id}) => responce
  
}
    = require('../openai-connector');



// Default timeout
jest.setTimeout(50000);
const chat = new Chat({});
const tested = {
    chat: new Chat({}),
    fineTune:{
        id:'',
        file:{id:''}
    },
    model:{
        id:''
    },
    assistant:{
        id: '',
        thread: {id:''},
        message:{id:''},
        run:{id:''},
        step:{id:''},
        file:{id:''},
        added_file:{id:''}
    }
} 
const clean = async () => {

}
let file_id = 'file-X4ZR3WmEyxJKOEuyuthIIj9T';
let ftJobId = 'ftjob-WUootDAvgqK1iJlpTn1XZmoO';
let modelId = 'gpt-3.5-turbo-16k';
//  
describe('Openai Connector', () => {

    

    test('Chat message', async () => {
        const data = await chat.message({text: "Hello"});
        expect(typeof data).toBe('string');
    });

    test('Text completeon', async () => {

        const res = await nlp.generate({text:'hello'});
        expect(res).toHaveProperty('message');
        expect(res).toHaveProperty('messages');
        expect(res).toHaveProperty('usage');
    });
   
    test('Text completeon with function call', async () => {
        const testLibrary = require('./tools/test-library');
        const res = await nlp.generate({text: "What's the weather like in San Francisco, Tokyo, and Paris?", tools:testLibrary.tools});
        expect(res).toHaveProperty('message');
        expect(res).toHaveProperty('messages');
        expect(res).toHaveProperty('usages');
    });

    test('Text Embedding', async () => {
       
        res = await nlp.embedding({text:'hello'});
        expect(res).toHaveProperty('embedding');
        expect(res).toHaveProperty('usage');
    });

    test('Text Classification', async () => {
        const res = await nlp.classification({text:'I will kill you boatman'});
        expect(res.flagged).toBe(true);
        expect(res.categories.violence).toBe(true);
        expect(res.category_scores).toHaveProperty('violence');
    });

    test('Count file tokens', async () => {
        const res = await files.countFileTokens({pathToFile:'./lib/LLM/OpenAI/tests/fine-tune/test-fine-tune-24.jsonl'});
        // const res = await files.create({pathToFile:'./lib/LLM/OpenAI/tests/fine-tune/test-fine-tune-24.jsonl', purpose:'fine-tune'});
        expect(res).toBe(1889);
    });

    test('Creare fine-tune file', async () => {
        const res = await files.create({pathToFile:'./lib/LLM/OpenAI/tests/fine-tune/test-fine-tune-24.jsonl', purpose:'fine-tune'});
        expect(res).toHaveProperty('id');
        expect(res.status).toBe('processed');
        tested.fineTune.file.id = res.id
    });
    test('Creare assistant file', async () => {
        const res = await files.create({pathToFile:'./lib/LLM/OpenAI/tests/assistants/test.csv', purpose:'assistants'});;
        expect(res).toHaveProperty('id');
        expect(res.status).toBe('processed');
        tested.assistant.file.id = res.id;
    });

    test('List files', async () => {
        const res = await files.list();
        expect(Array.isArray(res)).toBe(true);
    });

    test('Retrieve file', async () => {
    //    let file_id = tested.fineTune.file.id;
      
       const res = await files.retrieve({file_id});
        expect(res).toHaveProperty('id');
        expect(res.id).toBe(file_id);
    });
   
    test('Retrieve file content', async () => {
        // let file_id = tested.fineTune.file.id;
        
        const res = await files.content({file_id});
        expect(typeof res).toBe('string');
     });

     test('Delete file', async () => {
        // let file_id = tested.fineTune.file.id;
       
        const res = await files.del({file_id});
        expect(res).toHaveProperty('id');
        expect(res.id).toBe(file_id);
        expect(res.deleted).toBe(true);
     });

     test('Create Fine Tune job', async () => {
        // let file_id = tested.fineTune.file.id;
       
        const res = await fineTune.create({pathToFile:'./lib/LLM/OpenAI/tests/fine-tune/test-fine-tune-24.jsonl'})
        expect(res).toHaveProperty('id');
        expect(res.error.error).toBe(null);
        tested.fineTune.id = res.id;
        tested.fineTune.file.id = res.training_file;
     });
     test('Create Fine Tune from training file', async () => {
        // let file_id = tested.fineTune.file.id;
        const res = await fineTune.create({training_file:file_id})
        expect(res).toHaveProperty('id');
        expect(res.error.error).toBe(null);
        // tested.fineTune.id = res.id;
     });
    //  Does not work
    //  test('Get Fine Tune events', async () => {
    //     // let ftJobId = tested.fineTune.id;
    //     const res = await fineTune.events({id:ftJobId})
    //  });
    test('List Fine Tune jobs', async () => {
        const res = await fineTune.list();
        expect(Array.isArray(res)).toBe(true);
    });
    test('Retrieve Fine Tune job', async () => {
        //    let ftJobId = tested.fineTune.id;
        const res = await fineTune.retrieve({id:ftJobId});
        expect(res).toHaveProperty('id');
        expect(res.id).toBe(ftJobId);
     });
    //  Require to catch error if job is completed
    //  test('Cancel Fine Tune job', async () => {
    //     //    let ftJobId = tested.fineTune.id;
    //     const fn = async () => await fineTune.cancel({id:ftJobId});
    //     expect(fn).toThrow(TypeError);
        
    //  });

    test('List models', async () => {
        const res = await models.list();
        expect(Array.isArray(res)).toBe(true);
        const custom_model = res.find(model => model.id.startsWith('ft'));
        tested.model.id = custom_model.id;
    });
    test('Retrieve model', async () => {
        const res = await models.retrieve({model_id:modelId});
        expect(res).toHaveProperty('id');
        expect(res.id).toBe(modelId);
    });
    // test('Delete model', async () => {
    //     const res = await models.del({model_id:modelId});
    //     expect(res).toHaveProperty('deleted');
    //     expect(res.deleted).toBe(true);
    // });
    test('textToSpeech', async () => {
        const pathToFile = './lib/LLM/OpenAI/tests/speech/test-speech-output-en.mp3';
        await fs.promises.unlink(pathToFile).catch(err => console.error(err));
        const res = await speech.textToSpeech({text:'Hello, how can I help you?', pathToFile});
        const stat = await fs.promises.stat(pathToFile);
        expect(Buffer.isBuffer(res)).toBe(true);
        expect(stat).toHaveProperty('uid');
    });
    test('speechToText', async () => {
        const pathToFile = './lib/LLM/OpenAI/tests/speech/test-speech-input-en.mp3';
        const res = await speech.speechToText({pathToFile});
        expect(typeof res).toBe('string');
    });
    test('Speech Translation', async () => {
        const pathToFile = './lib/LLM/OpenAI/tests/speech/test-speech-input-ru.mp3';
        const res = await speech.speechTranslation({pathToFile});
        expect(typeof res).toBe('string');
    });

    test('Image Generation', async () => {
        const saveAs = './lib/LLM/OpenAI/tests/images/test-image-create-result.jpg';
        // try {
        //     await fs.promises.unlink(pathToFile)
        // } catch (error) {}
       
        const res = await images.create({text:"a white siamese cat", saveAs});
        // const stat = await fs.promises.stat(pathToFile);
        expect(res).toHaveProperty('url');
        expect(res).toHaveProperty('local');
        // expect(stat).toHaveProperty('uid');
    });

    test('Image Edit', async () => {
        const saveAs = './lib/LLM/OpenAI/tests/images/test-edit-image-result.jpg';
        // try {
        //     await fs.promises.unlink(saveAs)
        // } catch (error) {}
       
        const res = await images.edit({text:"A futuristic landscape behind a foregraund emoticon", 
                                  pathToFile:'./lib/LLM/OpenAI/tests/images/test-edit-image.png', 
                                  pathToMask: './lib/LLM/OpenAI/tests/images/test-edit-image.png', 
                                  saveAs,
                                  size: "256x256"});
        // const stat = await fs.promises.stat(saveAs);
        expect(res).toHaveProperty('url');
        expect(res).toHaveProperty('local');
        // expect(stat).toHaveProperty('uid');
    });

    test('Image Variation', async () => {
        const pathToFile = './lib/LLM/OpenAI/tests/images/test-edit-image.png';
        const saveAs = './lib/LLM/OpenAI/tests/images/test-image-variation-result.jpg';
        // try {
        //     await fs.promises.unlink(saveAs)
        // } catch (error) {}
       
        const res = await images.variation({pathToFile, saveAs}); 
        // const stat = await fs.promises.stat(saveAs);
        expect(res).toHaveProperty('url');
        expect(res).toHaveProperty('local');
        // expect(stat).toHaveProperty('uid');
    });

    test('Image Recognition', async () => {
        const pathToFile = './lib/LLM/OpenAI/tests/images/test-image.jpg';
        const res = await recognition.image({pathToFile});
        expect(res).toHaveProperty('message');
        expect(res).toHaveProperty('usage');
    });

    // .....Too heavy for testing
    // test('Video Recognition', async () => {
    //     const pathToFile = './lib/LLM/OpenAI/tests/videos/cat-no.mp4';
    //     const outputDir = './lib/LLM/OpenAI/tests/videos/video-frames'
    //     const res = await recognition.video({pathToFile, outputDir, frameRate: 5});
    //     expect(res).toHaveProperty('message');
    //     expect(res).toHaveProperty('usage');
    // });

    




})

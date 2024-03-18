const { readFileSync } = require('node:fs');
const path = require('node:path');

const huggingFaceConnector = require('./hugginface-connector');

const testAudioFile = readFileSync(path.join(__dirname, './test-speech.mp3'));
const testCatFile = readFileSync(path.join(__dirname, './test-cat.jpg'));
const testSeeFile = readFileSync(path.join(__dirname, './test-see.jpeg'));
const testInvoiceFile = readFileSync(path.join(__dirname, './test-invoice.png'));

// Default timeout
jest.setTimeout(20000);

describe('HuggingFace Connector', () => {

    test("FillMask", async () => {
        const res = await huggingFaceConnector.FillMask('[MASK] world!');
        
        // console.log(res)
        expect(res).toBeArray();

        const expectedObject = {
            score: expect.any(Number),
            sequence: expect.any(String),
            token: expect.any(Number),
            token_str: expect.any(String),
        };
        for (const item of res) {
            expect(item).toMatchObject(expectedObject);
        }
    });

    test("Summarization", async () => {
        const res = await huggingFaceConnector.Summarization(`The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. 
        Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest`);
        
        // console.log(res);
        expect(res).toMatchObject({ summary_text: expect.any(String) });
    });

    test("QuestionAnswering", async () => {
        const res = await huggingFaceConnector.QuestionAnswering({
            question: 'What is the capital of France?',
            context: 'The capital of France is Paris.'
        });
        
        // console.log(res);
        expect(res).toMatchObject({ 
            score: expect.any(Number),
            start: expect.any(Number),
            end: expect.any(Number),
            answer: "Paris",
        });
    });

    test("TableQuestionAnswering", async () => {
        const res = await huggingFaceConnector.TableQuestionAnswering({
            query: 'How many stars does the transformers repository have?',
            table: {
                Repository: ['Transformers', 'Datasets', 'Tokenizers'],
                Stars: ['36542', '4512', '3934'],
                Contributors: ['651', '77', '34'],
                'Programming language': ['Python', 'Python', 'Rust, Python and NodeJS']
            }
        });
        
        // console.log(res);
        expect(res).toMatchObject({ 
            answer: expect.any(String),
            coordinates: [ [ 0, 1 ] ],
            cells: [ expect.any(String) ],
            aggregator: "AVERAGE",
        });
    });

    test("TextClassification", async () => {
        const res = await huggingFaceConnector.TextClassification('I like you. I love you.');
        
        // console.log(res);
        expect(res).toIncludeSameMembers([{
            label: 'POSITIVE',
            score: expect.any(Number),
        }, {
            label: 'NEGATIVE',
            score: expect.any(Number),
        }]);
    });

    test("TextGeneration", async () => {
        const res = await huggingFaceConnector.TextGeneration('The answer to the universe is');
        
        // console.log(res);
        expect(res).toMatchObject({ 
            generated_text: expect.any(String),
        });
    });

    test("TextGenerationStream", async () => {
        const res = await huggingFaceConnector.TextGenerationStream('repeat "one two three four"', { max_new_tokens: 250 });
        
        // console.log(res);
        expect(res).toBeObject();
    });

    test("TokenClassification", async () => {
        const res = await huggingFaceConnector.TokenClassification('My name is Sarah Jessica Parker but you can call me Jessica');
        
        // console.log(res);
        expect(res).toBeArray();

        const expectedObject = {
            start: expect.any(Number),
            end: expect.any(Number),
            entity_group: expect.any(String),
            score: expect.any(Number),
            word: expect.any(String),
        };
        for (const item of res) {
            expect(item).toMatchObject(expectedObject);
        }
    });

    test("Translation", async () => {
        const res = await huggingFaceConnector.Translation('My name is Wolfgang and I live in Amsterdam', {"src_lang": "en_XX", "tgt_lang": "fr_XX"});
        
        // console.log(res);

        expect(res).toMatchObject({
            translation_text: 'Mein Name ist Wolfgang und ich lebe in Amsterdam',
        });
    });

    test("ZeroShotClassification", async () => {
        const res = await huggingFaceConnector.ZeroShotClassification([
            'Hi, I recently bought a device from your company but it is not working as advertised and I would like to get reimbursed!'
        ], { candidate_labels: ['refund', 'legal', 'faq'] });
        
        // console.log(res);

        expect(res).toBeArrayOfSize(1);

        expect(res[0]).toMatchObject({
            sequence: 'Hi, I recently bought a device from your company but it is not working as advertised and I would like to get reimbursed!',
            labels: [ 'refund', 'faq', 'legal' ],
            scores: [ expect.any(Number), expect.any(Number), expect.any(Number) ],
        });
    });

    // TODO: fix test, response is undefined for some reason
    test.skip("Conversational", async () => {
        const res = await huggingFaceConnector.Conversational({
            past_user_inputs: ['Which movie is the best ?'],
            generated_responses: ['It is Die Hard for sure.'],
            text: 'Can you explain why ?'
        });
        
        console.log(res);
    });

    test("SentenceSimilarity", async () => {
        const res = await huggingFaceConnector.SentenceSimilarity({
            source_sentence: 'That is a happy person',
            sentences: [
                'That is a happy dog',
                'That is a very happy person',
                'Today is a sunny day'
            ]
        });
        
        // console.log(res);

        expect(res).toIncludeAllMembers([ expect.any(Number), expect.any(Number), expect.any(Number) ]);
    });

    test("AutomaticSpeechRecognition", async () => {
        const res = await huggingFaceConnector.AutomaticSpeechRecognition(testAudioFile);
        
        // console.log(res);
        expect(res).toMatchObject({
            text: expect.any(String),
        });
    });

    test("AudioClassification", async () => {
        const res = await huggingFaceConnector.AudioClassification(testAudioFile);
        
        // console.log(res);
        expect(res).toBeArray();

        const expectedObject = {
            label: expect.any(String),
            score: expect.any(Number),
        };
        for (const item of res) {
            expect(item).toMatchObject(expectedObject);
        }
    });

    test("TextToSpeech", async () => {
        const res = await huggingFaceConnector.TextToSpeech('Hello world!');
        
        // console.log(res);
        expect(res).toBeInstanceOf(Blob);
        expect(res.size).toBeNumber();
        expect(res.type).toBe('audio/flac');
    });

    // TODO: fix test, response is undefined for some reason
    test.skip("AudioToAudio", async () => {
        const res = await huggingFaceConnector.AudioToAudio(testAudioFile);
        
        console.log(res);
    }, 20000);

    test("ImageClassification", async () => {
        const res = await huggingFaceConnector.ImageClassification(testCatFile);
        
        // console.log(res);
        const expectedObject = {
            label: expect.any(String),
            score: expect.any(Number),
        };
        for (const item of res) {
            expect(item).toMatchObject(expectedObject);
        }
    });

    test("ObjectDetection", async () => {
        const res = await huggingFaceConnector.ObjectDetection(testCatFile);
        
        // console.log(res);
        expect(res).toBeArrayOfSize(1);

        expect(res[0]).toMatchObject({
            box: { xmin: expect.any(Number), ymin: expect.any(Number), xmax: expect.any(Number), ymax: expect.any(Number) },
            label: 'cat',
            score: expect.any(Number),
        });
    });

    test("ImageSegmentation", async () => {
        const res = await huggingFaceConnector.ImageSegmentation(testCatFile);
        
        // console.log(res);
        expect(res).toBeArray();

        const expectedObject = {
            score: expect.any(Number),
            label: expect.any(String),
            mask: expect.any(String),
        };
        for (const item of res) {
            expect(item).toMatchObject(expectedObject);
        }
    });

    test("ImageToText", async () => {
        const res = await huggingFaceConnector.ImageToText(new Blob([testSeeFile]));
        
        // console.log(res);
        expect(res).toMatchObject({
            generated_text: expect.any(String),
        });
    });

    test("TextToImage", async () => {
        const inputs = 'award winning high resolution photo of a giant tortoise/((ladybird)) hybrid, [trending on artstation]';
        const res = await huggingFaceConnector.TextToImage(inputs, {negative_prompt: 'blurry'});
        
        // console.log(res);
        expect(res).toBeInstanceOf(Blob);
        expect(res.size).toBeNumber();
        expect(res.type).toBe('image/jpeg');
    }, 60000);

    test("ImageToImage", async () => {
        const res = await huggingFaceConnector.ImageToImage(new Blob([testSeeFile]), {prompt: "test picture"});
        
        // console.log(res);
        expect(res).toBeInstanceOf(Blob);
        expect(res.size).toBeNumber();
        expect(res.type).toBe('image/jpeg');
    }, 60000);

    // TODO: fix test, response is undefined for some reason
    test.skip("ZeroShotImageClassification", async () => {
        const res = await huggingFaceConnector.ZeroShotImageClassification(new Blob([testCatFile]), { candidate_labels: ['cat', 'dog'] });
        
        console.log(res);
    });

    test("FeatureExtraction", async () => {
        const res = await huggingFaceConnector.FeatureExtraction("That is a happy person");
        
        // console.log(res);
        expect(res).toSatisfyAll(el => typeof el === 'number');
    }, 20000);

    test("VisualQuestionAnswering", async () => {
        const inputs = {
            question: 'How many cats are lying down?',
            image: new Blob([testCatFile]),
        };
        const res = await huggingFaceConnector.VisualQuestionAnswering(inputs);
        
        // console.log(res);
        expect(res).toMatchObject({
            score: expect.any(Number),
            answer: '1',
        });
    });

    test("DocumentQuestionAnswering", async () => {
        const inputs = {
            question: 'Invoice number?',
            image: new Blob([testInvoiceFile]),
        };
        const res = await huggingFaceConnector.DocumentQuestionAnswering(inputs);
        
        // console.log(res);
        expect(res).toMatchObject({
            score: expect.any(Number),
            start: expect.any(Number),
            end: expect.any(Number),
            answer: 'us-001',
        });
    });

    // TODO: fix test, timeout
    test.skip("TabularRegression", async () => {
        const inputs = {
            data: {
                "Height": ["11.52", "12.48", "12.3778"],
                "Length1": ["23.2", "24", "23.9"],
                "Length2": ["25.4", "26.3", "26.5"],
                "Length3": ["30", "31.2", "31.1"],
                "Species": ["Bream", "Bream", "Bream"],
                "Width": ["4.02", "4.3056", "4.6961"]
            },
        };
        const res = await huggingFaceConnector.TabularRegression(inputs);
        
        console.log(res);
    }, 60000);

    // TODO: fix test, timeout
    test.skip("TabularClassification", async () => {
        const inputs = {
            data: {
                "fixed_acidity": ["7.4", "7.8", "10.3"],
                "volatile_acidity": ["0.7", "0.88", "0.32"],
                "citric_acid": ["0", "0", "0.45"],
                "residual_sugar": ["1.9", "2.6", "6.4"],
                "chlorides": ["0.076", "0.098", "0.073"],
                "free_sulfur_dioxide": ["11", "25", "5"],
                "total_sulfur_dioxide": ["34", "67", "13"],
                "density": ["0.9978", "0.9968", "0.9976"],
                "pH": ["3.51", "3.2", "3.23"],
                "sulphates": ["0.56", "0.68", "0.82"],
                "alcohol": ["9.4", "9.8", "12.6"]
            },
        };
        const res = await huggingFaceConnector.TabularClassification(inputs);
        
        console.log(res);
    }, 60000);

    // TODO: fix test, response is undefined for some reason
    test.skip("CustomCall", async () => {
        const res = await huggingFaceConnector.CustomCall('hello world');
        
        console.log(res);
    });

    test("CustomCallStreaming", async () => {
        const res = await huggingFaceConnector.CustomCallStreaming('hello world');
        
        // console.log(res);
        expect(res).toBeObject();
    });

    // TODO: To test this one we need to have own inference endpoint
    test.skip("CustomInferenceEndpoint", async () => {
        const endpoint = 'https://xyz.eu-west-1.aws.endpoints.huggingface.cloud/gpt2';
        const res = await huggingFaceConnector.CustomInferenceEndpoint('The answer to the universe is', endpoint);
        
        console.log(res);
    });
});
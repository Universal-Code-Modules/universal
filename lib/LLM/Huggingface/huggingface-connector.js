require('dotenv').config();
const{ HfInference } = require("@huggingface/inference");

const ut = require(process.cwd() + '/utilities');

const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN;

const hf = new HfInference(HUGGINGFACE_TOKEN);

// You can also omit "model" to use the recommended model for the task
class HuggingFaceConnector {
    // constructor() {
        
    // }

    async #makeApiCall(method, ...args) {
        const start = ut.logTime();
        let res;
        try {
            res = await hf[method](...args);
        } catch(err) {
            console.error(err);
            throw new Error(`Error occured while triggering "${method}" method`, { cause: err });
        }
        ut.logTime(method, start);
        return res;
    }

    //......Natural Language Processing
    /*
        inputs = '[MASK] world!'
    */
    async FillMask(inputs, model = 'bert-base-uncased'){
        const args = {inputs, model};
        const res = await this.#makeApiCall('fillMask', args);
        return res;
    }
    /*
        inputs = `The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. 
        Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest`,
        model = 'facebook/bart-large-cnn'   
    */
    async Summarization(inputs, parameters = {max_length: 100}, model = 'facebook/bart-large-cnn'){
        const args = {inputs, parameters, model};
        const res = await this.#makeApiCall('summarization', args);
        return res;
    }
    /*
        inputs = {
            question: 'What is the capital of France?',
            context: 'The capital of France is Paris.'
        }, 
    */
    async QuestionAnswering(inputs, model = 'deepset/roberta-base-squad2'){
        const args = {inputs, model};
        const res = await this.#makeApiCall('questionAnswering', args);
        return res;
    }
    /*
        inputs = {
            query: 'How many stars does the transformers repository have?',
            table: {
            Repository: ['Transformers', 'Datasets', 'Tokenizers'],
            Stars: ['36542', '4512', '3934'],
            Contributors: ['651', '77', '34'],
            'Programming language': ['Python', 'Python', 'Rust, Python and NodeJS']
            }
        }, 
    */
    async TableQuestionAnswering(inputs, model = 'google/tapas-base-finetuned-wtq'){
        const args = {inputs, model};
        const res = await this.#makeApiCall('tableQuestionAnswering', args);
        return res;
    }
    /*
        inputs = 'I like you. I love you.'
    */
    async TextClassification(inputs, model = 'distilbert-base-uncased-finetuned-sst-2-english'){
        const args = {inputs, model};
        const res = await this.#makeApiCall('textClassification', args);
        return res;
    }
    /*
        inputs = 'The answer to the universe is'
    */
    async TextGeneration(inputs, model = 'gpt2'){
        const args = {inputs, model};
        const res = await this.#makeApiCall('textGeneration', args);
        return res;
    }
    /*
        inputs = 'repeat "one two three four"'
        parameters = { max_new_tokens: 250 }
    */
    async TextGenerationStream(inputs, parameters = {}, model = 'google/flan-t5-xxl'){
        const args = {inputs, parameters, model};
        const res = await this.#makeApiCall('textGenerationStream', args);
        return res;
    }
    /*
        inputs = 'My name is Sarah Jessica Parker but you can call me Jessica'
    */
    async TokenClassification(inputs, model = 'dbmdz/bert-large-cased-finetuned-conll03-english'){
        const args = {inputs, model};
        const res = await this.#makeApiCall('tokenClassification', args);
        return res;
    }
    /*
        inputs = 'My name is Wolfgang and I live in Amsterdam',
        parameters = {"src_lang": "en_XX", "tgt_lang": "fr_XX"}
    */
    async Translation(inputs, parameters = {}, model = 't5-base'){
        const args = {inputs, parameters, model};
        const res = await this.#makeApiCall('translation', args);
        return res;
    }
    /*
        inputs = [
            'Hi, I recently bought a device from your company but it is not working as advertised and I would like to get reimbursed!'
        ],
        parameters = { candidate_labels: ['refund', 'legal', 'faq'] }
    */
    async ZeroShotClassification(inputs, parameters = {}, model = 'facebook/bart-large-mnli'){
        const args = {inputs, parameters, model};
        const res = await this.#makeApiCall('zeroShotClassification', args);
        return res;
    }
    /*
        inputs = {
            source_sentence: 'That is a happy person',
            sentences: [
            'That is a happy dog',
            'That is a very happy person',
            'Today is a sunny day'
            ]
        }
    */
    async SentenceSimilarity(inputs, model = 'sentence-transformers/paraphrase-xlm-r-multilingual-v1'){
        const args = {inputs, model};
        const res = await this.#makeApiCall('sentenceSimilarity', args);
        return res;
    }

    //.........Audio
    /*
        data = readFileSync('test/sample1.flac')
    */
    async AutomaticSpeechRecognition(data, model = 'facebook/wav2vec2-large-960h-lv60-self'){
        const args = {data, model};
        const res = await this.#makeApiCall('automaticSpeechRecognition', args);
        return res;
    }
    /*
        data = readFileSync('test/sample1.flac')
    */
    async AudioClassification(data, model = 'superb/hubert-large-superb-er'){
        const args = {data, model};
        const res = await this.#makeApiCall('audioClassification', args);
        return res;
    }
    /*
        inputs = 'Hello world!'
    */
    async TextToSpeech(inputs, model = 'espnet/kan-bayashi_ljspeech_vits'){
        const args = {inputs, model};
        const res = await this.#makeApiCall('textToSpeech', args);
        return res;
    }
    /*
        data = readFileSync('test/sample1.flac')
    */
    async AudioToAudio(data, model = 'speechbrain/sepformer-wham'){
        const args = {data, model};
        const res = await this.#makeApiCall('audioToAudio', args);
        return res;
    }

    //........Computer Vision
    /*
        data = readFileSync('test/cheetah.png')
    */
    async ImageClassification(data, model = 'google/vit-base-patch16-224'){
        const args = {data, model};
        const res = await this.#makeApiCall('imageClassification', args);
        return res;
    }
    /*
        data = readFileSync('test/cats.png')
    */
    async ObjectDetection(data, model = 'facebook/detr-resnet-50'){
        const args = {data, model};
        const res = await this.#makeApiCall('objectDetection', args);
        return res;
    }
    /*
        data = readFileSync('test/cats.png')
    */
    async ImageSegmentation(data, model = 'facebook/detr-resnet-50-panoptic'){
        const args = {data, model};
        const res = await this.#makeApiCall('imageSegmentation', args);
        return res;
    }
    /*
        data = await (await fetch('https://picsum.photos/300/300')).blob()
    */
    async ImageToText(data, model = 'nlpconnect/vit-gpt2-image-captioning'){
        const args = {data, model};
        const res = await this.#makeApiCall('imageToText', args);
        return res;
    }
    /*
        inputs = 'award winning high resolution photo of a giant tortoise/((ladybird)) hybrid, [trending on artstation]',
        parameters = {negative_prompt: 'blurry'}, 
    */
    async TextToImage(inputs,
                        parameters = {},         
                        model = 'stabilityai/stable-diffusion-2'){
        const args = {inputs, parameters, model};
        const res = await this.#makeApiCall('textToImage', args);
        return res;
    }
    /*
        inputs = new Blob([readFileSync("test/stormtrooper_depth.png")]),
        parameters = {prompt: "elmo's lecture"}, 
    */
    async ImageToImage(inputs, parameters = {}, model = 'lllyasviel/sd-controlnet-depth'){
        const args = {inputs, parameters, model};
        const res = await this.#makeApiCall('imageToImage', args);
        return res;
    }
    /*
        inputs = { image: await (await fetch('https://placekitten.com/300/300')).blob() },
        parameters = { candidate_labels: ['cat', 'dog'] },
    */
    async ZeroShotImageClassification(inputs, parameters = {}, model = 'openai/clip-vit-large-patch14-336'){
        const args = {inputs, parameters, model};
        const res = await this.#makeApiCall('zeroShotImageClassification', args);
        return res;
    }

    //......Multimodal
    /*
        inputs = "That is a happy person",
    */
    async  FeatureExtraction(inputs, model = 'sentence-transformers/distilbert-base-nli-mean-tokens'){
        const args = {inputs, model};
        const res = await this.#makeApiCall('featureExtraction', args);
        return res;
    }
    /*
        inputs = {
            question: 'How many cats are lying down?',
            image: await (await fetch('https://placekitten.com/300/300')).blob()
        },
    */
    async VisualQuestionAnswering(inputs, model = 'dandelin/vilt-b32-finetuned-vqa'){
        const args = {inputs, model};
        const res = await this.#makeApiCall('visualQuestionAnswering', args);
        return res;
    }
    /*
        inputs = {
            question: 'Invoice number?',
            image: await (await fetch('https://huggingface.co/spaces/impira/docquery/resolve/2359223c1837a7587402bda0f2643382a6eefeab/invoice.png')).blob(),
        },
    */
    async DocumentQuestionAnswering(inputs, model = 'impira/layoutlm-document-qa'){
        const args = {inputs, model};
        const res = await this.#makeApiCall('documentQuestionAnswering', args);
        return res;
    }

    //.....Tabular
    /*
        inputs = {
            data: {
            "Height": ["11.52", "12.48", "12.3778"],
            "Length1": ["23.2", "24", "23.9"],
            "Length2": ["25.4", "26.3", "26.5"],
            "Length3": ["30", "31.2", "31.1"],
            "Species": ["Bream", "Bream", "Bream"],
            "Width": ["4.02", "4.3056", "4.6961"]
            },
        },
    */
    async TabularRegression(inputs, model = 'scikit-learn/Fish-Weight'){
        const args = {inputs, model};
        const res = await this.#makeApiCall('tabularRegression', args);
        return res;
    }
    /*
        inputs = {
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
        },
    */
    async TabularClassification(inputs, model = 'vvmnnnkv/wine-quality'){
        const args = {inputs, model};
        const res = await this.#makeApiCall('tabularClassification', args);
        return res;
    }

    //........Custom
    /*
        inputs = "hello world",
        parameters = {
            custom_param: 'some magic',
        }
    */
    async CustomCall(inputs, parameters = {}, model = 'my-custom-model'){
        const args = {inputs, parameters, model};
        const res = await this.#makeApiCall('request', args);
        return res;
    }
    /*
        inputs = "hello world",
        parameters = {
            custom_param: 'some magic',
        }
    */
    async CustomCallStreaming(inputs, parameters = {}, model = 'my-custom-model'){
        const args = {inputs, parameters, model};
        return this.#makeApiCall('streamingRequest', args);
    }
    /*
        inputs = 'The answer to the universe is',
        endpoint = 'https://xyz.eu-west-1.aws.endpoints.huggingface.cloud/gpt2'
    */
    async CustomInferenceEndpoint(inputs, endpoint){
        const args = { inputs };
        const hfEndpoint = hf.endpoint(endpoint);
        try {
            const res = await hfEndpoint.textGeneration(args);
            return res;
        } catch (err) {
            throw new Error(`Error occured while triggering "textGeneration" method`, { cause: err });
        }
    }
}

module.exports = new HuggingFaceConnector();

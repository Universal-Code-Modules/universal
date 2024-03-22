require('dotenv').config();
const{ HfInference } = require("@huggingface/inference");

const ut = require(process.cwd() + '/utilities');

const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN;

const hf = new HfInference(HUGGINGFACE_TOKEN);
 
// You can also omit "model" to use the recommended model for the task

    // constructor() {
        
    // }

    

    //......Natural Language Processing
    /*
        inputs = '[MASK] world!'
    */
    const FillMask = async (inputs, model = 'bert-base-uncased') => {
        const args = {inputs, model};
        const res = await ut.callAPI(hf , 'hf.fillMask', args);
        return res;
    }
    /*
        inputs = `The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. 
        Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest`,
        model = 'facebook/bart-large-cnn'   
    */
    const Summarization = async (inputs, parameters = {max_length: 100}, model = 'facebook/bart-large-cnn') => {
        const args = {inputs, parameters, model};
        const res = await ut.callAPI(hf , 'hf.summarization', args);
        return res;
    }
    /*
        inputs = {
            question: 'What is the capital of France?',
            context: 'The capital of France is Paris.'
        }, 
    */
    const  QuestionAnswering = async(inputs, model = 'deepset/roberta-base-squad2') => {
        const args = {inputs, model};
        const res = await ut.callAPI(hf , 'hf.questionAnswering', args);
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
    const TableQuestionAnswering = async(inputs, model = 'google/tapas-base-finetuned-wtq') => {
        const args = {inputs, model};
        const res = await ut.callAPI(hf , 'hf.tableQuestionAnswering', args);
        return res;
    }
    /*
        inputs = 'I like you. I love you.'
    */
    const TextClassification = async(inputs, model = 'distilbert-base-uncased-finetuned-sst-2-english') => {
        const args = {inputs, model};
        const res = await ut.callAPI(hf , 'hf.textClassification', args);
        return res;
    }
    /*
        inputs = 'The answer to the universe is'
    */
    const TextGeneration= async(inputs, model = 'gpt2')  => {
        const args = {inputs, model};
        const res = await ut.callAPI(hf , 'hf.textGeneration', args);
        return res;
    }
    /*
        inputs = 'repeat "one two three four"'
        parameters = { max_new_tokens: 250 }
    */
    const TextGenerationStream = async(inputs, parameters = {}, model = 'google/flan-t5-xxl')  => {
        const args = {inputs, parameters, model};
        const res = await ut.callAPI(hf , 'hf.textGenerationStream', args);
        return res;
    }
    /*
        inputs = 'My name is Sarah Jessica Parker but you can call me Jessica'
    */
    const TokenClassification = async(inputs, model = 'dbmdz/bert-large-cased-finetuned-conll03-english')  => {
        const args = {inputs, model};
        const res = await ut.callAPI(hf , 'hf.tokenClassification', args);
        return res;
    }
    /*
        inputs = 'My name is Wolfgang and I live in Amsterdam',
        parameters = {"src_lang": "en_XX", "tgt_lang": "fr_XX"}
    */
    const Translation = async(inputs, parameters = {}, model = 't5-base')  => {
        const args = {inputs, parameters, model};
        const res = await ut.callAPI(hf , 'hf.translation', args);
        return res;
    }
    /*
        inputs = [
            'Hi, I recently bought a device from your company but it is not working as advertised and I would like to get reimbursed!'
        ],
        parameters = { candidate_labels: ['refund', 'legal', 'faq'] }
    */
    const ZeroShotClassification = async(inputs, parameters = {}, model = 'facebook/bart-large-mnli')  => {
        const args = {inputs, parameters, model};
        const res = await ut.callAPI(hf , 'hf.zeroShotClassification', args);
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
    const SentenceSimilarity = async(inputs, model = 'sentence-transformers/paraphrase-xlm-r-multilingual-v1')  => {
        const args = {inputs, model};
        const res = await ut.callAPI(hf , 'hf.sentenceSimilarity', args);
        return res;
    }

    //.........Audio
    /*
        data = readFileSync('test/sample1.flac')
    */
    const AutomaticSpeechRecognition = async (data, model = 'facebook/wav2vec2-large-960h-lv60-self')  => {
        const args = {data, model};
        const res = await ut.callAPI(hf , 'hf.automaticSpeechRecognition', args);
        return res;
    }
    /*
        data = readFileSync('test/sample1.flac')
    */
    const AudioClassification = async(data, model = 'superb/hubert-large-superb-er')  => {
        const args = {data, model};
        const res = await ut.callAPI(hf , 'hf.audioClassification', args);
        return res;
    }
    /*
        inputs = 'Hello world!'
    */
    const TextToSpeech = async(inputs, model = 'espnet/kan-bayashi_ljspeech_vits')  => {
        const args = {inputs, model};
        const res = await ut.callAPI(hf , 'hf.textToSpeech', args);
        return res;
    }
    /*
        data = readFileSync('test/sample1.flac')
    */
    const AudioToAudio = async(data, model = 'speechbrain/sepformer-wham')  => {
        const args = {data, model};
        const res = await ut.callAPI(hf , 'hf.audioToAudio', args);
        return res;
    }

    //........Computer Vision
    /*
        data = readFileSync('test/cheetah.png')
    */
    const ImageClassification = async(data, model = 'google/vit-base-patch16-224')  => {
        const args = {data, model};
        const res = await ut.callAPI(hf , 'hf.imageClassification', args);
        return res;
    }
    /*
        data = readFileSync('test/cats.png')
    */
    const ObjectDetection = async(data, model = 'facebook/detr-resnet-50')  => {
        const args = {data, model};
        const res = await ut.callAPI(hf , 'hf.objectDetection', args);
        return res;
    }
    /*
        data = readFileSync('test/cats.png')
    */
    const ImageSegmentation = async(data, model = 'facebook/detr-resnet-50-panoptic')  => {
        const args = {data, model};
        const res = await ut.callAPI(hf , 'hf.imageSegmentation', args);
        return res;
    }
    /*
        data = await (await fetch('https://picsum.photos/300/300')).blob()
    */
    const ImageToText = async(data, model = 'nlpconnect/vit-gpt2-image-captioning')  => {
        const args = {data, model};
        const res = await ut.callAPI(hf , 'hf.imageToText', args);
        return res;
    }
    /*
        inputs = 'award winning high resolution photo of a giant tortoise/((ladybird)) hybrid, [trending on artstation]',
        parameters = {negative_prompt: 'blurry'}, 
    */
    const TextToImage = async(inputs,
                        parameters = {},         
                        model = 'stabilityai/stable-diffusion-2')  => {
        const args = {inputs, parameters, model};
        const res = await ut.callAPI(hf , 'hf.textToImage', args);
        return res;
    }
    /*
        inputs = new Blob([readFileSync("test/stormtrooper_depth.png")]),
        parameters = {prompt: "elmo's lecture"}, 
    */
    const ImageToImage = async(inputs, parameters = {}, model = 'lllyasviel/sd-controlnet-depth')  => {
        const args = {inputs, parameters, model};
        const res = await ut.callAPI(hf , 'hf.imageToImage', args);
        return res;
    }
    /*
        inputs = { image: await (await fetch('https://placekitten.com/300/300')).blob() },
        parameters = { candidate_labels: ['cat', 'dog'] },
    */
    const ZeroShotImageClassification = async(inputs, parameters = {}, model = 'openai/clip-vit-large-patch14-336')  => {
        const args = {inputs, parameters, model};
        const res = await ut.callAPI(hf , 'hf.zeroShotImageClassification', args);
        return res;
    }

    //......Multimodal
    /*
        inputs = "That is a happy person",
    */
    const  FeatureExtraction = async(inputs, model = 'sentence-transformers/distilbert-base-nli-mean-tokens')  => {
        const args = {inputs, model};
        const res = await ut.callAPI(hf , 'hf.featureExtraction', args);
        return res;
    }
    /*
        inputs = {
            question: 'How many cats are lying down?',
            image: await (await fetch('https://placekitten.com/300/300')).blob()
        },
    */
    const VisualQuestionAnswering = async(inputs, model = 'dandelin/vilt-b32-finetuned-vqa')  => {
        const args = {inputs, model};
        const res = await ut.callAPI(hf , 'hf.visualQuestionAnswering', args);
        return res;
    }
    /*
        inputs = {
            question: 'Invoice number?',
            image: await (await fetch('https://huggingface.co/spaces/impira/docquery/resolve/2359223c1837a7587402bda0f2643382a6eefeab/invoice.png')).blob(),
        },
    */
    const DocumentQuestionAnswering = async(inputs, model = 'impira/layoutlm-document-qa')  => {
        const args = {inputs, model};
        const res = await ut.callAPI(hf , 'hf.documentQuestionAnswering', args);
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
    const TabularRegression = async(inputs, model = 'scikit-learn/Fish-Weight')  => {
        const args = {inputs, model};
        const res = await ut.callAPI(hf , 'hf.tabularRegression', args);
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
    const TabularClassification = async(inputs, model = 'vvmnnnkv/wine-quality')  => {
        const args = {inputs, model};
        const res = await ut.callAPI(hf , 'hf.tabularClassification', args);
        return res;
    }

    //........Custom
    /*
        inputs = "hello world",
        parameters = {
            custom_param: 'some magic',
        }
    */
    const CustomCall = async(inputs, parameters = {}, model = 'my-custom-model')  => {
        const args = {inputs, parameters, model};
        const res = await ut.callAPI(hf , 'hf.request', args);
        return res;
    }
    /*
        inputs = "hello world",
        parameters = {
            custom_param: 'some magic',
        }
    */
    const CustomCallStreaming = async(inputs, parameters = {}, model = 'my-custom-model')  => {
        const args = {inputs, parameters, model};
        return this._makeApiCall('streamingRequest', args);
    }
    /*
        inputs = 'The answer to the universe is',
        endpoint = 'https://xyz.eu-west-1.aws.endpoints.huggingface.cloud/gpt2'
    */
    const CustomInferenceEndpoint = async(inputs, endpoint) => {
        const args = { inputs };
        const hfEndpoint = hf.endpoint(endpoint);
        try {
            const res = await hfEndpoint.textGeneration(args);
            return res;
        } catch (err) {
            throw new Error(`Error occured while triggering "textGeneration" method`, { cause: err });
        }
    }


module.exports = {
    FillMask,
    Summarization,
    QuestionAnswering,     
    TableQuestionAnswering ,
    TextClassification,
    TextGeneration,
    TextGenerationStream,
    TokenClassification,
    Translation,
    ZeroShotClassification,
    SentenceSimilarity,
    
    AutomaticSpeechRecognition,
    AudioClassification,
    TextToSpeech,
    AudioToAudio,

    ImageClassification,
    ObjectDetection,
    ImageSegmentation,
    ImageToText,
    TextToImage,
    ImageToImage,
    ZeroShotImageClassification,
    FeatureExtraction,

    VisualQuestionAnswering,
    DocumentQuestionAnswering,
    TabularRegression,
    TabularClassification,
    CustomCall,
    CustomCallStreaming,
    CustomInferenceEndpoint
};

require('dotenv').config();
const{ HfInference } = require("@huggingface/inference");
import fetch from 'node-fetch';

const HUGGINFACE_TOKEN = process.env.HUGGINFACE_TOKEN;

const inference = new HfInference(HUGGINFACE_TOKEN);

// You can also omit "model" to use the recommended model for the task
class HugginfaceConnector {
    // constructor() {
        
    // }

    //......Natural Language Processing

    async FillMask(inputs = '[MASK] world!', model = 'bert-base-uncased'){
        const res = await hf.fillMask({
            model,
            inputs
        })
        return res;
    }
    async Summarization(){

    }
    async QuestionAnswering(){

    }
    async TableQuestionAnswering(){

    }
    async TextClassification(){

    }
    async TextGeneration(){

    }
    async TokenClassification(){

    }
    async Translation(inputs = 'My name is Wolfgang and I live in Amsterdam', 
                        parameters = {"src_lang": "en_XX",
                                    "tgt_lang": "fr_XX"},
                        model = 't5-base'){
                    const res = await inference.translation({
                        inputs,
                        parameters,
                        model
                    })
                    return res;
    }
    async ZeroShotClassification(){

    }
    async Conversational(){

    }
    async SentenceSimilarity(){

    }
    //.........Audio
    async AutomaticSpeechRecognition(){

    }
    async AudioClassification(){

    }
    async TextToSpeech(){

    }
    async AudioToAudio(){

    }
    //........Computer Vision
    async ImageClassification(){

    }
    async ObjectDetection(){

    }
    async ImageSegmentation(){

    }
    async ImageToText(blob, model = 'nlpconnect/vit-gpt2-image-captioning'){
        const res = await inference.imageToText({
            data: blob, //await (await fetch('https://picsum.photos/300/300')).blob(),
            model,  
        })
        return res;
    }

    async TextToImage(inputs = 'award winning high resolution photo of a giant tortoise/((ladybird)) hybrid, [trending on artstation]',
                        parameters = {negative_prompt: 'blurry'},         
                        model = 'stabilityai/stable-diffusion-2'){
                    const res = await inference.textToImage({
                        inputs,
                        parameters,
                        model
                    })
                    return res;
    }
    async ImageToImage(){

    }
    async ZeroShotImageClassification(){

    }
    //......Multimodal
    async  FeatureExtraction(){

    }
    async VisualQuestionAnswering(){

    }
    async DocumentQuestionAnswering(){

    }
    //.....Tabular
    async TabularRegression(){

    }
    async TabularClassification(){

    }
//........Custom

    async CustomCall(){

    }
   
    async CustomInferenceEndpoint(){
        const res = {};
          // Using your own dedicated inference endpoint: https://hf.co/docs/inference-endpoints/
        //     const gpt2 = inference.endpoint('https://xyz.eu-west-1.aws.endpoints.huggingface.cloud/gpt2');
        //     const { generated_text } = await gpt2.textGeneration({inputs: 'The answer to the universe is'});
        // const res = await inference.textGeneration({
        //     model: 'gpt-2',
        //     inputs: 'The answer to the universe is'
        // })
        return res;
    }
  



   
}

module.exports = new HugginfaceConnector();

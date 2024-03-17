require('dotenv').config();
const ut = require('../../../utilities');
const{ HfInference } = require("@huggingface/inference");
import { createRepo, uploadFile, deleteFiles } from "@huggingface/hub";
import {HfAgent, LLMFromHub, defaultTools} from '@huggingface/agents';
import fetch from 'node-fetch';

const HUGGINFACE_TOKEN = process.env.HUGGINFACE_TOKEN;

const inference = new HfInference(HUGGINFACE_TOKEN);

// You can also omit "model" to use the recommended model for the task
class HugginfaceConnector {
    // constructor() {
        
    // }

    //......Natural Language Processing
    /*
        inputs = '[MASK] world!'
    */
    async FillMask(inputs, model = 'bert-base-uncased'){
        const args = {inputs};
        if (model) args.model = model;
        const start = ut.logTime();
        const res = await hf.fillMask(args)
        ut.logTime('FillMask', start);
        return res;
    }
    /*
        inputs = `The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. 
        Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest`,
        model = 'facebook/bart-large-cnn'   
    */
    async Summarization(inputs, parameters = {max_length: 100}, model = 'facebook/bart-large-cnn'){
        const args = {inputs, parameters};
        if (model) args.model = model;
        const start = ut.logTime();
        const res = await hf.summarization({
            model,
            inputs,
              parameters
          })
        ut.logTime('Summarization', start);
        return res;
    }
    /*

    */
    async QuestionAnswering(){

    }
    /*

    */
    async TableQuestionAnswering(){

    }
    /*

    */
    async TextClassification(){

    /*

    */
    }
    async TextGeneration(){

    }
    /*

    */
    async TokenClassification(){

    }
    /*

    */
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
    /*

    */
    async ZeroShotClassification(){

    }
    /*

    */
    async Conversational(){

    }
    /*

    */
    async SentenceSimilarity(){

    }

    //.........Audio
    /*

    */
    async AutomaticSpeechRecognition(){

    }
    /*

    */
    async AudioClassification(){

    }
    /*

    */
    async TextToSpeech(){

    }
    /*

    */
    async AudioToAudio(){

    }

    //........Computer Vision
    /*

    */
    async ImageClassification(){

    }
    /*

    */
    async ObjectDetection(){

    }
    /*

    */
    async ImageSegmentation(){

    }
    /*
    blob = await (await fetch('https://picsum.photos/300/300')).blob()
    */
    async ImageToText(blob, model = 'nlpconnect/vit-gpt2-image-captioning'){
        const res = await inference.imageToText({
            data: blob,
            model,  
        })
        return res;
    }
    /*
        inputs = 'award winning high resolution photo of a giant tortoise/((ladybird)) hybrid, [trending on artstation]',
        parameters = {negative_prompt: 'blurry'}, 
    */
    async TextToImage(inputs,
                        parameters = {},         
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

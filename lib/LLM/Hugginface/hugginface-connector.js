require('dotenv').config();
const{ HfInference } = require("@huggingface/inference");
import fetch from 'node-fetch';

const HUGGINFACE_TOKEN = process.env.HUGGINFACE_TOKEN;

const inference = new HfInference(HUGGINFACE_TOKEN);

class HugginfaceConnector {
    // constructor() {
        
    // }

// You can also omit "model" to use the recommended model for the task
    async translate(inputs = 'My name is Wolfgang and I live in Amsterdam', model = 't5-base'){
        const res = await inference.translation({
            model,
            inputs
        })
        return res;
    }

    async textToImage(){
        const res = await inference.textToImage({
                model: 'stabilityai/stable-diffusion-2',
                inputs: 'award winning high resolution photo of a giant tortoise/((ladybird)) hybrid, [trending on artstation]',
                parameters: {
                    negative_prompt: 'blurry',
                }
        })
        return res;
    }
    
    async imageToText(){
        const res = await inference.imageToText({
            data: await (await fetch('https://picsum.photos/300/300')).blob(),
            model: 'nlpconnect/vit-gpt2-image-captioning',  
        })
        return res;
    }
    async textGeneration(){
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

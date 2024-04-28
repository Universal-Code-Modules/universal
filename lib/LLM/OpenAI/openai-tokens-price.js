const { get_encoding, encoding_for_model }  = require ("tiktoken");
const { Tiktoken } = require("tiktoken/lite");
const cl100k_base = require("tiktoken/encoders/cl100k_base.json");
const fromExponential = require('from-exponential');
// const { Readable } = require ("stream");
const { parseFile } = require ('music-metadata');
const openaiData = require('./openai-data');
const ut = require(process.cwd() + '/utilities');
const math = ut.math;

const tokens = {
    count: ({text, model = "gpt-4-turbo-2024-04-09"}) => { 
      let enc;
      try {
        enc = encoding_for_model(model);
      } 
      catch (error) {
        enc = new Tiktoken(
            cl100k_base.bpe_ranks,
            cl100k_base.special_tokens,
            cl100k_base.pat_str
          );
      }
      const tokens = enc.encode(text);
      enc.free();
      return tokens.length;
    }
    
  }

const price = {

    estimate: async ({purpose, model, text = '', pathToFile = '', 
                      options = {type: 'prompt', detail:'low', resolution:"1024x1024", quality:'standard'}}) => {
  
        const res = {price:0, tokens:0, options}
  
        let token_cost = 0, metadata;
        if (text.length) res.tokens = tokens.count({text, model});
  
        
        const usedModel = openaiData.models[purpose][model];
        const prices = {}
        for (let key in usedModel.prices){
          if (['training', 'prompt', 'completion'].includes(key)) prices[key] = math.divide(usedModel.prices[key], 1000000);
        }
        // console.log(usedModel.prices)
  
        switch (purpose){
  
          case 'completeon':
            token_cost = options.type == 'prompt' ? prices.prompt : prices.completion;
            res.price = math.multiply(res.tokens, token_cost);
          break;
          case 'embedding':
            token_cost = prices.prompt;
            res.price = math.multiply(res.tokens, token_cost);
          break;
          case 'recognition':
            res.tokens += usedModel.tokens.base;
            if (options.detail !== 'low')  {
                metadata = await sharp(pathToFile).metadata();
                const scaled = price._scaleAndMeasureImage(metadata.width, metadata.height);
                // console.log(metadata.width, metadata.height, scaled);
                res.tokens += scaled.numberOfSquares * usedModel.tokens.block;
            }
           
            res.price = math.multiply(res.tokens, prices.prompt);
          break;
  
          case 'images':
            res.price = usedModel.prices[options.quality][options.resolution];
          break;
  
          case 'fineTune':
            if(options.type === 'training'){
              res.tokens = await files.countFileTokens({pathToFile, model});
              res.price = math.multiply(res.tokens, prices.training);
            }
            else {
              token_cost = options.type == 'prompt' ? prices.prompt : prices.completion;
              res.price = math.multiply(res.tokens, token_cost);
            }
          break
  
          case 'speech':
              if (model === 'whisper-1'){
                metadata = await parseFile(pathToFile);
                res.duration = Math.round(metadata.format.duration);
                res.price = math.multiply(res.duration, usedModel.prices.minute/60);
                // console.log(inspect(metadata, { showHidden: false, depth: null }));
              }
              else {
                res.price = math.multiply(res.tokens, prices.prompt);
              }
          
          break;
  
      }
        // res.string = res.price.toFixed(20).replace(/[0]+$/, '');
        res.string = fromExponential(res.price)
        return res;
    },
  
    calculateByUsage: ({purpose, model, usage, usages}) => {
      const usedModel = openaiData.models[purpose][model];
      const prices = {}
      for (let key in usedModel.prices){
        if (['training', 'prompt', 'completion'].includes(key)) prices[key] = math.divide(usedModel.prices[key], 1000000);
      }

      let tokens = {prompt_tokens:0, completion_tokens:0, total_tokens:0}, total = 0, prompt = 0, completion = 0, res = {};

      if (usage){
        const {prompt_tokens, completion_tokens} = usage;
        prompt = math.multiply(prompt_tokens, prices.prompt);
        completion = math.multiply(completion_tokens, prices.completion);
        total = math.add(prompt, completion);
        res = {...usage};
      }
      else if (usages){
        for (let usage of usages){
          const {prompt_tokens, completion_tokens} = usage;
          tokens.prompt_tokens += prompt_tokens;
          tokens.completion_tokens += completion_tokens;
          tokens.total_tokens += math.add(prompt_tokens, completion_tokens);
          prompt += math.multiply(prompt_tokens, prices.prompt);
          completion += math.multiply(completion_tokens, prices.completion);
        }
        total = math.add(prompt, completion);
        res = tokens;
      }
      res.prompt_price = prompt;
      res.completion_price = completion;
      res.total_price = total;
      // res.prices = { prompt, completion, total };
      // res.strings = { prompt:fromExponential(prompt), completion:fromExponential(completion), total:fromExponential(total) };
       return res;
    },


  
    _scaleAndMeasureImage(width, height) {
      // Define the constraints
      const maxLongSide = 2048;
      const maxShortSide = 768;
      const squareSize = 512;
    
      // Step 1: Scale down if the longest side is more than 2048 pixels
      let aspectRatio = width / height;
      if (width > height) {
        if (width > maxLongSide) {
          width = maxLongSide;
          height = width / aspectRatio;
        }
      } else {
        if (height > maxLongSide) {
          height = maxLongSide;
          width = height * aspectRatio;
        }
      }
    
      // Step 2: Scale down further if the shortest side is more than 768 pixels after step 1
      if (Math.min(width, height) > maxShortSide) {
        if (width < height) {
          width = maxShortSide;
          height = width / aspectRatio;
        } else {
          height = maxShortSide;
          width = height * aspectRatio;
        }
      }
    
      // Make sure the final dimensions are rounded to avoid fractional pixels
      width = Math.round(width);
      height = Math.round(height);
    
      // Step 3: Calculate the number of squares needed
      const squaresWidth = Math.ceil(width / squareSize);
      const squaresHeight = Math.ceil(height / squareSize);
      const totalSquares = squaresWidth * squaresHeight;
    
      return {
        scaledWidth: width,
        scaledHeight: height,
        numberOfSquares: totalSquares
      };
    }
  
  }



  module.exports = {price, tokens}
require('dotenv').config()
const ut = require(process.cwd() + '/utilities');

const OpenAI = require ("openai");
const fs  = require ("fs");
const path = require('path');




const util = require('util')
const stream = require('stream')
const { spawn } = require('node:child_process');
const pipeline = util.promisify(stream.pipeline);
const sharp = require('sharp');

const {DEFAULT_MODELS, DEFAULT_VOICE} = require('./openai-config');
const {tokens, price} = require('./openai-tokens-price');
const openai = new OpenAI({apiKey: process.env['OPENAI_API_KEY']});


//  console.log(openai.name, openai.constructor.name);
// process.exit(0);


class Chat{
  //, temperature = 0.7, topP = 1, frequencyPenalty = 0, presencePenalty = 0, stop = ["\n", ""]
  constructor({system, model = DEFAULT_MODELS.completions, tools, maxTokens = 1000, maxPrice = 0.1}){
    this.system = system;
    this.model = model;
    this.tools = tools;
    this.maxTokens = maxTokens;
    // this.maxPrice = maxPrice;

    this.messages = [];
    this.tokens = 0;
    this.price = 0;
   
    // throw new Error(`Max ${maxTokens} tokens exceeded`);
  }
  async message ({text}) {
    const tokensNumber = tokens.count({text, model:this.model});
    
    if (this.tokens + tokensNumber >= this.maxTokens){
      throw new Error(`Max ${this.maxTokens} tokens exceeded`);
    }
    
    const res = await language.generate({text, messages:this.messages, system:this.system, model:this.model, tools:this.tools});

    this.messages = res.messages;
    this.tokens += res.usage.total_tokens;
    this.price += res.usage.total_price;
    
    return res.message;
  }

/*
 "text" argument - in case we do conversion on front end
 */
  async voiceMessage ({text, inputFilePath, outputFilePath, voice = DEFAULT_VOICE, returnIntermediateResult = false}) {
    let inputText, start = ut.measureTime();
    if (inputFilePath){ 
      inputText = await speech.speechToText({pathToFile:inputFilePath});
    }
    else {
      inputText = text;
    }
    const outputText = await this.message({text:inputText});
    if (returnIntermediateResult) return {inputText, outputText, outputFilePath, executionTime:ut.measureTime(start)};

    const buffer = await speech.textToSpeech({text:outputText, pathToFile:outputFilePath, voice});

    return {inputText, outputText, outputFilePath, executionTime:ut.measureTime(start)};
  }

  async voiceAnswer ({inputText, outputText, outputFilePath, voice = DEFAULT_VOICE}) {
    const start = ut.measureTime();
    const buffer = await speech.textToSpeech({text:outputText, pathToFile:outputFilePath, voice});
    return {inputText, outputText, outputFilePath, executionTime:ut.measureTime(start)};
  }

}

class Assistant {

  constructor({assistant_id, thread_id, model = DEFAULT_MODELS.completions, maxTokens = 1000, maxPrice = 0.1}){
    this.id = assistant_id;
    this.thread_id = thread_id;
    // this.model = model;
    // this.maxTokens = maxTokens;
    // this.maxPrice = maxPrice;

     this.messages = [];
    // this.tokens = 0;
    // this.price = 0;

  }

  message({text}) {
      
  }




}





  
  //......Natural Language Processing (language).......


/*
you should accumulate the messages in the conversation and send them all at once to the completion endpoint.

Example of messages:
  [{
    "role": "user",
    "content": "Hello, I'm a user."
  },{
    "role": "assistant",
    "content": "Hello, how can I help you?"
  },{
    "role": "user",
    "content": "Why roses are red?"
  }]

  Models: 
  gpt-3.5-turbo - cheaper, less advanced
  gpt-4-turbo-2024-04-09 - more advanced, more expensive

*/

const defineTools = (params = []) => {
  const tools = [], functions = {};
  let tool;
  for (f of params){
    let name = f.name || f.fn.name.replace(/([A-Z])/g, ($0, $1)=>'_' + $1.toLowerCase());
    tool = {
      type: "function",
      function: {
        name,
        description: f.description,
        parameters: {
          type: "object",
          properties: f.properties,
          required: f.required,
        },
      },
    };
    tools.push(tool);
    functions[name] = {fn:f.fn, scope:f.scope};
    // if (tool.type === 'code_interpreter'){
    //   functions.push({
    //     "type": "code_interpreter",
    //     "code": tool.code
    //   });
    // }
  }
  return {tools, functions}
}


  const language = {
    generate: async({text, 
              messages = [], 
              system = `You are a useful assistant. You can answer questions, provide information, and help with tasks.`,
              model = DEFAULT_MODELS.completions,
              tools = [],
              tool_choice = "auto"
            }) => {



        const currentMessages = [
        ...messages, 
        { 
          "role": "user",
          "content": text
        }];

        const params = {
          messages:[{
          "role": "system",
          "content": system
          }, 
          ...currentMessages
          ],
          model: model
        };

        let defs = {tools:[], functions:{}};
        if (Array.isArray(tools) && tools.length){
            defs  = defineTools(tools);
            params.tools = defs.tools; 
            params.tool_choice = tool_choice;
        }
        // return params;
        let completion = await ut.callAPI(openai.chat.completions, 'openai.chat.completions.create', params);
        if(completion.error) return completion;

        let responseMessage = completion.choices[0].message;

        const usages = [completion.usage];

        if (responseMessage.tool_calls) {

          params.messages.push(responseMessage);

          for (const toolCall of responseMessage.tool_calls) {
            const functionName = toolCall.function.name;
            const functionToCall = defs.functions[functionName];
            if (!functionToCall) throw new Error(`Function ${functionName} not found`);

            const {fn, scope}= functionToCall;
            const args = JSON.parse(toolCall.function.arguments);
            console.log({functionName, functionToCall, args});
            const functionResponse = await fn.call(scope, args)
            console.log({functionResponse});

            params.messages.push({
              tool_call_id: toolCall.id,
              role: "tool",
              name: functionName,
              content: functionResponse,
            });
          }

          completion = await ut.callAPI(openai.chat.completions, 'openai.chat.completions.create', params);
          if(completion.error) return completion;
          responseMessage = completion.choices[0].message;
          usages.push(completion.usage);

        // console.log({completion, responseMessage})
        }

        currentMessages.push(responseMessage);
        const usageAndPrices = price.calculateByUsage({purpose:'completion', model, usages});

        return {message:responseMessage.content, messages:currentMessages, usage:usageAndPrices};
    },

    embedding: async({text = "Sample text", model = DEFAULT_MODELS.embedding}) => {
      const response = await ut.callAPI(openai.embeddings, 'openai.embeddings.create', {
            model,
            input: text,
            encoding_format: "float",
          });
      if(response.error) return response;
      const usageAndPrices = price.calculateByUsage({purpose:'embedding', model, usage:response.usage})
      return {embedding:response.data[0].embedding, usage:usageAndPrices};
    },
  
    classification: async({text, model = DEFAULT_MODELS.classification}) => {
      
      const response = await ut.callAPI(openai.moderations, 'openai.moderations.create', {
        input: text
      });
      if(response.error) return response;
      return response.results[0];
    
    }

  }
  
  const files = {

    countFileTokens: async({pathToFile, model = DEFAULT_MODELS.completions}) => {
      let tokensNumber = 0
      await ut.processFileLineByLine(pathToFile, ({line, index}) => {
        tokensNumber += tokens.count({text:line, model});
      }, (args) => {console.log(args)});
      return tokensNumber;
    },

      create: async({pathToFile,  purpose = 'fine-tune'}) => {
        // purposes = "fine-tune", "assistants"
        const response = await ut.callAPI(openai.files, 'openai.files.create', { file: fs.createReadStream(pathToFile), purpose });
        return response;
      },

      list: async() => {
        const response = await ut.callAPI(openai.files, 'openai.files.list');
        if(response.error) return response;
        return response.data;
      },

      retrieve: async({file_id}) => {
        const response = await ut.callAPI(openai.files, 'openai.files.retrieve', file_id);
        return response;
      },

      content : async({file_id}) => {
        const file = await ut.callAPI(openai.files, 'openai.files.retrieveContent', file_id);
        return file;
      },

      del: async({file_id}) => {
        const file = await ut.callAPI(openai.files, 'openai.files.del', file_id);
        return file;
      }
  }

  const fineTune = {

    // hyperparameters = 
    // batch_size
      // string or integer  Optional Defaults to auto
      // Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

      // learning_rate_multiplier string or number Optional  Defaults to auto
      // Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

      // n_epochs
      // string or integer Optional Defaults to auto
      // The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.
      create: async({pathToFile, training_file, 
        hyperparameters = {batch_size:'auto', learning_rate_multiplier:'auto', n_epochs:'auto'}, 
        suffix = '', model = DEFAULT_MODELS.fineTune, deleteFile = false, maxTokens = 0}) => {
        if (pathToFile) {
          const epochs = hyperparameters.n_epochs != 'auto' ? hyperparameters.n_epochs : 1;
          const tokens =  await files.countFileTokens({pathToFile});
          if (maxTokens && tokens*epochs > maxTokens) {
            throw new Error(`Max tokens ${maxTokens} exceeded ${tokens}`);
          }
          const file = await files.create({pathToFile});
          if (!file || !file.id) return console.error('Error creating file');
          training_file = file.id;
        }
        const params = { training_file, suffix, model };
        if (hyperparameters) params.hyperparameters = hyperparameters;
        if (suffix) params.suffix = suffix;

        const response = await ut.callAPI(openai.fineTuning.jobs, 'openai.fineTuning.jobs.create', params); 
        if(response.error) return response; 
        if (deleteFile) await files.del({training_file});

        return response;
      },

      list: async() => {
        const response = await ut.callAPI(openai.fineTuning.jobs, 'openai.fineTuning.jobs.list');
        if(response.error) return response;
        return response.data;
        // for await (const fineTune of list) {
        //   console.log(fineTune);
        // }
      },

      events: async({id, limit=2}) => {
        const list = await ut.callAPI(openai.fineTuning, 'openai.fineTuning.list_events', id, limit);

        // for await (const fineTune of list) {
        //   console.log(fineTune);
        // }
        return list;
      },
      retrieve: async({id}) => {
        const res = await ut.callAPI(openai.fineTuning.jobs, 'openai.fineTuning.jobs.retrieve', id);
        return res;
      },
      cancel: async({id}) => {
        const fineTune = await ut.callAPI(openai.fineTuning.jobs, 'openai.fineTuning.jobs.cancel', id);
        return fineTune;
      }

  }

  const models = {
    list: async() => {
      const response = await ut.callAPI(openai.models, 'openai.models.list');
      if(response.error) return response;
      return response.data;
      // for await (const fineTune of list) {
      //   console.log(fineTune);
      // }
    },
    retrieve: async({model_id}) => {
      const response = await ut.callAPI(openai.models, 'openai.models.retrieve', model_id);
      return response;
    },
    del: async({model_id}) => {
      const response = await ut.callAPI(openai.models, 'openai.models.del', model_id);
      return response;
    }
  }

const speech = {
    /*
    voices: alloy, echo, fable, onyx, nova, and shimmer
    speed:  0.25 - 4.0
    model: tts-1, tts-1-hd
    */

  textToSpeech: async ({text, pathToFile = "./tests/test-speech.mp3", voice = DEFAULT_VOICE, speed = 1.0, model = DEFAULT_MODELS.textToSpeech}) => {
   
      
      
      const speechFile = path.resolve(pathToFile);
      const mp3  = await ut.callAPI(openai.audio.speech, 'openai.audio.speech.create',
      {
        input: text,
        voice,
        speed,
        model
      });
      if(mp3.error) return mp3;
      const buffer = Buffer.from(await mp3.arrayBuffer());
      await fs.promises.writeFile(speechFile, buffer);
      return buffer;
    },

    
  speechToText: async({pathToFile = "./tests/test-speech.mp3", model = DEFAULT_MODELS.speech}) => {

    const buffer = await fs.promises.readFile(path.resolve(pathToFile));
    const transcription  = await ut.callAPI(openai.audio.transcriptions, 'openai.audio.transcriptions.create', {
      file: await OpenAI.toFile(buffer, path.basename(pathToFile)),
      model,
    });
    if(transcription.error) return transcription;
    return transcription.text;
  },


  speechTranslation: async({pathToFile = "./tests/test-speech.mp3", model = DEFAULT_MODELS.speech}) => {
    
    const translation = await ut.callAPI(openai.audio.translations, 'openai.audio.translations.create', {
      file: fs.createReadStream(pathToFile),
      model,
    });
    if(translation.error) return translation;
    return translation.text;
  }
}

const images = {

     

/*
   
    prompt: "a white siamese cat",
        model: "dall-e-3",
        n: 1, (dalle-3 always generates only one image per request)
        size: "1024x1024",

    */
    create: async ({text, saveAs = '', size = "1024x1024", quality="standard", n = 1, model = DEFAULT_MODELS.imageCreate}) => {
      //quality: "standard", "hd"
      // return console.log(pathToFile.replace(/^\./, ''));

        const response = await ut.callAPI(openai.images, 'openai.images.generate', {
          prompt:text,
          size,
          quality,
          n,
          model
        });
        if(response.error) return response;
      const url = response?.data[0]?.url;
      // const url = `https://oaidalleapiprodscus.blob.core.windows.net/private/org-0W2DSt5sTB0F2NuqbNIHHcTg/user-m7HmI4bqRdNZxYTHJlFPLN9P/img-nYmIPv103J4yZAw29MTr7N7x.png?st=2024-03-24T17%3A16%3A00Z&se=2024-03-24T19%3A16%3A00Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-03-23T21%3A30%3A02Z&ske=2024-03-24T21%3A30%3A02Z&sks=b&skv=2021-08-06&sig=ByJlRNd/IQsOrgmruP8u/oyjWmKE/PDW4tG9E1YuoRo%3D`;
      if (url && saveAs.length) {
        try {
          await ut.saveFileFromWeb(url, saveAs);
        } catch (error) {
          console.error('Error saving file:', error);
        }
      }
      return {url, local:saveAs.replace(/^\./, '')};

    },
    /*
    accepts only .png RGBA images
    */
    edit: async ({text, pathToFile, pathToMask = '', saveAs = '', size = "1024x1024", n = 1, model = DEFAULT_MODELS.image}) => {

      const params = {
        prompt:text,
        image:fs.createReadStream(pathToFile),
        model,
        n,
        size
    };
    if (pathToMask.length) params.mask = fs.createReadStream(pathToMask);

      const response = await ut.callAPI(openai.images, 'openai.images.edit', params);
      if(response.error) return response;
      const url = response.data[0].url;
      if (url && saveAs.length) {
        try {
          await ut.saveFileFromWeb(url, saveAs);
        } catch (error) {
          return console.error('Error saving file:', error);
        }
      }
      return {url, local:saveAs.replace(/^\./, '')};
    },
    
    variation: async ({pathToFile, saveAs = '', size = "1024x1024", n = 1, model = DEFAULT_MODELS.image}) => {
      
      const response = await ut.callAPI(openai.images, 'openai.images.createVariation', {
          image:fs.createReadStream(pathToFile),
          model,
          n,
          size
      });
      if(response.error) return response;
      const url = response.data[0].url;
      if (url && saveAs.length) {
        try {
          await ut.saveFileFromWeb(url, saveAs);
        } catch (error) {
          return console.error('Error saving file:', error);
        }
      }
      return {url, local:saveAs.replace(/^\./, '')};

    }
}

const recognition = {
  


  image: async ({url, pathToFile, prompt =  "What’s in this image?", detail = "auto", max_tokens = 300, model = DEFAULT_MODELS.vision}) => {

    let imageURL;
    if (url){
      imageURL = url;
    } 
    else if (pathToFile){
      const data = await fs.promises.readFile(pathToFile);
      let base64Image = Buffer.from(data, 'binary').toString('base64');
      imageURL = `data:image/jpeg;base64, ${base64Image}`;
    } 
    else {
      throw new Error('No image provided');
    }
    const response = await ut.callAPI(openai.chat.completions, 'openai.chat.completions.create', {
        model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  "url": imageURL,
                  detail //low, high, or auto
                },
              },
            ],
          },
        ],
        max_tokens
      });
      if(response.error) return response;
      return {message:response.choices[0].message.content, usage:response.usage};
  },
  /*
  Requires ffmpeg installed
  May exceed the max tokens per minutes limit
  */
  video: async ({pathToFile, outputDir, max_tokens = 300, frameRate = 1, model = DEFAULT_MODELS.vision}) => {

    await ut.cleanDirectory(outputDir);
    await ut.extractVideoFrames(pathToFile, outputDir, frameRate);
    const files = await fs.promises.readdir(outputDir);
    const content = [{ type: "text", text: "These are frames from a video. Generate a compelling description of the video." }];
    for (file of files){
      const data = await fs.promises.readFile(path.join(outputDir, file));
      const base64Image = Buffer.from(data, 'binary').toString('base64');
      const imageURL = `data:image/jpeg;base64, ${base64Image}`;
      content.push({"type": "image_url", "image_url": {"url":imageURL}});
    }
    
    const response = await ut.callAPI(openai.chat.completions, 'openai.chat.completions.create', {
      model,
      messages: [
        {
          role: "user",
          content,
        },
      ],
      max_tokens
    });
    if(response.error) return response;
    return {message:response.choices[0].message.content, usage:response.usage}


  }

}




//.........ASSISTANTS.............
/*
The main advantage of an assistant in comparison to completeon - you don't have to send all the messages to OpenAI for each user interaction. 
You can send only a new message to the assistant and OpenAI will keep and manage the context of the conversation.
The disadvantage is - you can't add or remove some other content to the conversation, like info from other models or any other data.
And it's still beta -  sometimes it does not behave according to instructions
*/

/*
      name = "Math Tutor", 
      instructions = "You are a personal math tutor. Write and run code to answer math questions.", 
      tools = [{ type: "code_interpreter" }], 
      model = DEFAULT_MODELS.completions

*/

const assistants = {

  create: async ({
        name , 
        instructions, 
        tools = [], 
        model = DEFAULT_MODELS.completions}) => {

    // tools = {type:code_interpreter}, {type:retrieval}, or {type:function, function:{name, description, parameters:{type, properties, required}}}

    const response = await ut.callAPI(openai.beta.assistants, 'openai.beta.assistants.create', 
        {
            name,
            instructions,
            tools,
            model
        });
    return response;
  },

  list: async() => {
    const response = await ut.callAPI(openai.beta.assistants, 'openai.beta.assistants.list');
    if(response.error) return response;
    return response.data;
  },


  retrieve: async({assistant_id}) => {
      const response = await ut.callAPI(openai.beta.assistants, 'openai.beta.assistants.retrieve', assistant_id);
      return response;
  },

  update: async ({assistant_id, name, instructions, tools, model, file_ids}) => {
    const current_assistant = await assistants.retrieve({assistant_id});
    const args = {name, instructions, tools, model, file_ids};
    const props = {}
    for (let key in args){
      props[key] = (typeof args[key] === 'undefined') ? current_assistant[key] : args[key];
    }
    const response = await ut.callAPI(openai.beta.assistants, 'openai.beta.assistants.update', assistant_id, props);
    return response;
  },

  del: async ({assistant_id}) => {
    const response = await ut.callAPI(openai.beta.assistants, 'openai.beta.assistants.del', assistant_id);
    return response;
  },

  files:{
    create: async ({assistant_id, file_id}) => {
      //purpose should be "assistants"
      const file = await ut.callAPI(openai.beta.assistants.files, 'openai.beta.assistants.files.create', assistant_id, {file_id})
      return file;
    },
    list: async ({assistant_id}) => {
      const files = await ut.callAPI(openai.beta.assistants.files, 'openai.beta.assistants.files.list', assistant_id);
      if(files.error) return files;
      return files.data;
    },
    retrieve: async ({assistant_id, file_id}) => {
      const file = await ut.callAPI(openai.beta.assistants.files, 'openai.beta.assistants.files.retrieve', assistant_id, file_id);
      return file;
    },
    del: async ({assistant_id, file_id}) => {
      const file = await ut.callAPI(openai.beta.assistants.files, 'openai.beta.assistants.files.del', assistant_id, file_id);
      return file;
    }

  },

  threads:{

      create: async({messages = []}) => {
          const response = await ut.callAPI(openai.beta.threads, 'openai.beta.threads.create');
          return response;
      },

      createAndRun: async({assistant_id, thread = {messages:[]}}) => {
        const response = await ut.callAPI(openai.beta.threads, 'openai.beta.threads.createAndRun', {assistant_id, thread});
        return response;
      },
    
      /*
      id = 'thread_D1Fc45AQAhZsywNdSAGReFpM'
      */
      retrieve: async ({thread_id}) => {
        const response = await ut.callAPI(openai.beta.threads, 'openai.beta.threads.retrieve', thread_id);
          return response;
      },

      update: async ({thread_id, params = {}}) => {
        const response = await ut.callAPI(openai.beta.threads, 'openai.beta.threads.update', thread_id, params);
          return response;
      },
     
    
      del: async({thread_id}) => {
        const response = await ut.callAPI(openai.beta.threads, 'openai.beta.threads.del', thread_id);
        return response;
      },

    
    messages:{
    
        create: async({thread_id, role = 'user', content = ''}) => {
          // return console.log({thread_id, role, content});
            const response = await ut.callAPI(openai.beta.threads.messages, 'openai.beta.threads.messages.create', 
              thread_id,
              {
                role,
                content
              }
            );
            return response;
        },
        list: async({thread_id, clean = false}) => {

          const response = await ut.callAPI(openai.beta.threads.messages, 'openai.beta.threads.messages.list', 
            thread_id
          );
          if(response.error) return response;
          if (clean) {
            const messages = [];
            for (message of response.data){
              messages.push(message.content);
            }
              // console.log({message0:messages[0][0].text, message1:messages[1][0].text});
            return messages;
          }
          return response;
        },
        listFiles: async({thread_id, message_id}) => {
          const response = await ut.callAPI(openai.beta.threads.messages, 'openai.beta.threads.messages.files.list', 
            thread_id,
            message_id
          );
          if(response.error) return response;
          return response.data;

        },

        retrieve: async({thread_id, message_id}) => {
          const response = await ut.callAPI(openai.beta.threads.messages, 'openai.beta.threads.messages.retrieve', 
            thread_id,
            message_id
          );
          return response;
        
        },
        retrieveFile: async({thread_id, message_id, file_id}) => {
          const response = await ut.callAPI(openai.beta.threads.messages.files, 'openai.beta.threads.messages.files.retrieve', 
            thread_id,
            message_id,
            file_id
          );
          return response;
        },
        update: async({thread_id, message_id, params = {metadata:{ metadata: {
                                                                    modified: "true",
                                                                    user: "test"
                                                                  }
                                                                }
                                                        }
                                                      }) => {
          const response = await await ut.callAPI(openai.beta.threads.messages, 'openai.beta.threads.messages.update', 
              thread_id, 
              message_id,
              params)
            return response;
        }
    },

    runs:{
        create: async({thread_id, assistant_id}) => {
          const response = await ut.callAPI( openai.beta.threads.runs, 'openai.beta.threads.runs.create', 
            thread_id,
            { 
              assistant_id
            }
          );
          return response;
        },
        list: async({thread_id}) => {
            const response = await ut.callAPI(openai.beta.threads.runs, 'openai.beta.threads.runs.list', thread_id);
            if(response.error) return response;
            return response.data;
        },
        retrieve: async({thread_id, run_id}) => {
          const response = await ut.callAPI(openai.beta.threads.runs, 'openai.beta.threads.runs.retrieve', 
            thread_id,
            run_id
          );
          return response;
        },


      // .....logs
        listRunSteps: async({thread_id, run_id, limit=20, clean}) => {
          const response = await ut.callAPI(openai.beta.threads.runs.steps, 'openai.beta.threads.runs.steps.list', 
            thread_id,
            run_id
          );
          if(response.error) return response;
          if (clean) {  
            const steps = [];
            for (log of response.data){
              steps.push({details:log.step_details, usage:log.usage});
            }
            return steps;
          }
          return response;
        },
        retrieveRunStep: async({thread_id, run_id, step_id}) => {
          const response = await ut.callAPI(openai.beta.threads.runs.steps, 'openai.beta.threads.runs.steps.retrieve', 
            thread_id,
            run_id,
            step_id
          );
          return response;
        },
        update: async({thread_id, run_id, props = {}}) => {
            const response = await ut.callAPI(openai.beta.threads.runs, 'openai.beta.threads.runs.update', thread_id, run_id, props);
            return response;
        },
        /*
        When a run has the status: "requires_action" and required_action.type is submit_tool_outputs, 
        this endpoint can be used to submit the outputs from the tool calls once they're all completed. 
        All outputs must be submitted in a single request.
        Like this 
        {
            tool_outputs: [
              {
                tool_call_id: "call_001",
                output: "70 degrees and sunny.",
              },
            ],
        }
        */
        submitToolOutput: async({thread_id, run_id, output = {tool_outputs: []}}) => {
          const response = await ut.callAPI(openai.beta.threads.runs.steps.tools, 'openai.beta.threads.runs.steps.tools.submit', 
            thread_id,
            run_id,
            output
          );
          return response;
        },

        cancel: async({thread_id, run_id}) => {
          const response = await ut.callAPI(openai.beta.threads.runs, 'openai.beta.threads.runs.cancel', 
            thread_id,
            run_id
          );
          return response;
        }


    }

  }
}





module.exports = {
  

    Chat, //class Chat
    // chat.message({text}) => {message, messages, usages} => string
    // chat.voiceMessage({inputFilePath, outputFilePath, voice}) => {inputText, outputText, outputFilePath}
    Assistant, //class Assistant
    tokens,
    // tokens.count({text, model}) => integer
    price,
    // price.estimate({purpose, model, text = '', pathToFile = '', 
    //                options = {type: 'prompt', detail:'low', resolution:"1024x1024", quality:'standard'}}) => {price:0, tokens:0, options}
    // price.calculate({purpose, model, usage}) => {
                                            //   prompt_token,
                                            //   completion_token,
                                            //   total_tokens,
                                            //   prices: { prompt, completion, total },
                                            //   strings: { prompt, completion, total }
    // }
    language,
    // language.generate({text, messages, system, model, tools, tool_choice}) => {message, messages, usages}
    // language.embedding({text, model}) => {embedding, usage}
    // language.classification({text, model}) => response
    files,
    // files.create({pathToFile, purpose}) => response
    // files.list() => data (array)
    // files.retrieve({file_id}) => response
    // files.content({file_id}) => response
    // files.del({file_id}) => response
    fineTune,
    // fineTune.create({pathToFile, training_file, hyperparameters, suffix, model, deleteFile, maxTokens}) => response
    // fineTune.list() => data (array)
    // fineTune.events({id, limit}) => response - does not work
    // fineTune.retrieve({id}) => response
    // fineTune.cancel{({id}) => response
    models,
    // models.list() => response
    // models.retrieve({model_id}) => response
    // models.del({model_id}) => response
    images, 
    // images.create({text, pathToFile, size, quality, n, model}) => {url, local}
    // images.edit({text, pathToFile, pathToMask, size, n, model}) => response
    // images.variation({pathToFile, size, n, model}) => response
    speech,
    // speech.textToSpeech({text, pathToFile, voice, model}) => buffer
    // speech.speechToText({pathToFile, model}) => string
    // speech.speechTranslation({pathToFile, model}) => string // does not translate
    recognition,
    // recognition.image({url, pathToFile, prompt, max_tokens, model}) => {message, usage}
    // recognition.video({pathToFile, outputDir, max_tokens, model}) => {message, usage}
    assistants, //test
    // assistants.create({name, instructions, tools, model}) => response
    // assistants.list() => data (array)
    // assistants.retrieve({assistant_id}) => response
    // assistants.update({assistant_id, name, instructions, tools, model, file_ids}) => response
    // assistants.del({assistant_id}) => response
  
   // assistants.files.create({file_id}) => response
    // assistants.files.list({assistant_id}) => data (array)
    // assistants.files.retrieve({assistant_id, file_id}) => response
    // assistants.files.del({assistant_id, file_id}) => response
  
    // assistants.threads.create({messages = []}) => response
    // assistants.threads.createAndRun({assistant_id, thread = {messages:[]}}) => response
    // assistants.threads.retrieve({thread_id}) => response
    // assistants.threads.update({thread_id, messages}) => response
    // assistants.threads.del({thread_id}) => response
  
    // assistants.threads.messages.create({thread_id, role, content}) => response
    // assistants.threads.messages.list({thread_id, clean}) => data(array)
    // assistants.threads.messages.listFiles({thread_id, message_id}) => data (array) //does not work
    // assistants.threads.messages.retrieve({thread_id, message_id}) => response
    // assistants.threads.messages.retrieveFile({thread_id, message_id, file_id}) => response
    // assistants.threads.messages.update({thread_id, message_id, user_id}) => response
   
    // assistants.threads.runs.create({thread_id, assistant_id}) => response
    // assistants.threads.runs.list({thread_id}) => response
    // assistants.threads.runs.retrieve({thread_id, run_id}) => response
    // assistants.threads.runs.listRunSteps({thread_id, run_id, limit, clean}) => response
    // assistants.threads.runs.retrieveRunStep({thread_id, run_id, step_id}) => response
    // assistants.threads.runs.update({thread_id, run_id, data}) => response
    // assistants.threads.runs.submitToolOutput({thread_id, run_id, output}) => response
    // assistants.threads.runs.cancel({thread_id, run_id}) => response
  
    price
    // price.calculate({model, input, type}) => number
};



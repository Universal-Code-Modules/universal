require('dotenv').config()
const ut = require(process.cwd() + '/utilities');
const OpenAI = require ("openai");
const toFile  = OpenAI.toFile;
const fs  = require ("fs");
const path = require('path');
const { Readable } = require ("stream");

const { get_encoding, encoding_for_model }  = require ("tiktoken");

const util = require('util')
const stream = require('stream')
const { spawn } = require('node:child_process');
const pipeline = util.promisify(stream.pipeline);

const openai = new OpenAI({apiKey: process.env['OPENAI_API_KEY']});
//  console.log(openai.name, openai.constructor.name);
// process.exit(0);


class Chat{
  //, temperature = 0.7, topP = 1, frequencyPenalty = 0, presencePenalty = 0, stop = ["\n", ""]
  constructor({system, model = "gpt-4-1106-preview", maxTokens = 1000}){
    this.system = system;
    this.model = model;
    this.messages = [];
    this.tokens = 0;
    this.maxTokens = maxTokens;
    // throw new Error(`Max ${maxTokens} tokens exceeded`);
  }
  async message ({text}) {
    const tokensNumber = tokens.count({text, model:this.model});
    
    if (this.tokens + tokensNumber >= this.maxTokens){
      throw new Error(`Max ${this.maxTokens} tokens exceeded`);
    }
    
    const res = await nlp.generate({text, messages:this.messages, system:this.system, model:this.model});
    this.messages = res.messages;
    const usages = res.usages;
    for (let usage of usages){
      this.tokens += usage.total_tokens;
    }
    return res.message;
  }
  async voiceMessage ({text, inputFilePath, outputFilePath, voice = "onyx"}) {
    let inputText;
    if (inputFilePath){ 
      inputText = await speech.speechToText({pathToFile:inputFilePath});
    }
    else {
      inputText = text;
    }
    const outputText = await this.message({text:inputText});
    const buffer = await speech.textToSpeech({text:outputText, pathToFile:outputFilePath, voice});

    return {text:inputText, message:outputText, outputFilePath};
  }

}


const tokens = {
  count: ({text, model = "gpt-4-1106-preview"}) => { 
    const enc = encoding_for_model(model);
    const tokens = enc.encode(text);
    enc.free();
    return tokens.length;
  }
  
}

  
  //......Natural Language Processing (nlp).......


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
  gpt-4-1106-preview - more advanced, more expensive

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


  const nlp = {
    generate: async({text, 
              messages = [], 
              system = `You are a useful assistant. You can answer questions, provide information, and help with tasks.`,
              model = 'gpt-4-1106-preview',
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
          responseMessage = completion.choices[0].message;
          usages.push(completion.usage);

        // console.log({completion, responseMessage})
        }

        currentMessages.push(responseMessage);

        return {message:responseMessage.content, messages:currentMessages, usages};
    },

    embedding: async({text = "Sample text", model = 'text-embedding-3-small'}) => {
      const responce = await ut.callAPI(openai.embeddings, 'openai.embeddings.create', {
            model,
            input: text,
            encoding_format: "float",
          });
      return {embedding:responce.data[0].embedding, usage:responce.usage};
    },
  
    classification: async({text, model = 'text-moderation-007'}) => {
      
      const responce = await ut.callAPI(openai.moderations, 'openai.moderations.create', {
        input: text
      });
      return responce;
    
    }

  }
  
  const files = {

    countFileTokens: async({pathToFile, model = "gpt-4-1106-preview"}) => {
      let tokensNumber = 0
      await ut.processFileLineByLine(pathToFile, ({line, index}) => {
        tokensNumber += tokens.count({text:line, model});
      }, (args) => {console.log(args)});
      return tokensNumber;
    },

      create: async({pathToFile, purpose = 'fine-tune'}) => {
        // purposes = "fine-tune", "assistants"
        const responce = await ut.callAPI(openai.files, 'openai.files.create', { file: fs.createReadStream(pathToFile), purpose });
        return responce;
      },

      list: async() => {
        const responce = await ut.callAPI(openai.files, 'openai.files.list');
        return responce.data;
      },

      retrieve: async({file_id}) => {
        const responce = await ut.callAPI(openai.files, 'openai.files.retrieve', file_id);
        return responce;
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

      create: async({pathToFile, training_file, hyperparameters, suffix, model = 'gpt-3.5-turbo-0125', deleteFile = false, maxTokens = 0}) => {
        if (pathToFile) {
          const epochs = 1;
          const tokens =  await files.countFileTokens({pathToFile});
          if (maxTokens && tokens*epochs > maxTokens) {
            throw new Error(`Max tokens ${maxTokens} exceeded ${tokens}`);
          }
          const file = await files.create({pathToFile});
          training_file = file.id;
        }
        const params = { training_file, suffix, model };
        if (hyperparameters) params.hyperparameters = hyperparameters;
        if (suffix) params.suffix = suffix;

        const res = await ut.callAPI(openai.fineTuning.jobs, 'openai.fineTuning.jobs.create', params);  
        if (deleteFile) await files.del({training_file});

        return res;
      },
      list: async() => {
        const list = await openai.fineTuning.jobs.list();
        return list;
        // for await (const fineTune of list) {
        //   console.log(fineTune);
        // }
      },
      events: async({id, limit=2}) => {
        const list = await openai.fineTuning.list_events(id, limit);

        // for await (const fineTune of list) {
        //   console.log(fineTune);
        // }
        return list;
      },
      retrieve: async({id}) => {
        const fineTune = await openai.fineTuning.jobs.retrieve(id);
        return fineTune;
      },
      cancel: async({id}) => {
        const fineTune = await openai.fineTuning.jobs.cancel(id);
        return fineTune;
      }

  }

  const models = {
    list: async() => {
      const responce = await ut.callAPI(openai.fineTuning.models, 'openai.fineTuning.models.list');
      return responce;
      // for await (const fineTune of list) {
      //   console.log(fineTune);
      // }
    },
    retrieve: async({model_id}) => {
      const responce = await ut.callAPI(openai.fineTuning.models, 'openai.fineTuning.models.retrieve', id);
      return responce;
    },
    del: async({model_id}) => {
      const responce = await ut.callAPI(openai.fineTuning.del, 'openai.fineTuning.del', id);
      return responce;
    }
  }


const speech = {
    /*
    voices: alloy, echo, fable, onyx, nova, and shimmer

    */

  textToSpeech: async ({text, pathToFile = "./tests/test-speech.mp3", voice = "onyx", model = "tts-1"}) => {
      
      
      const speechFile = path.resolve(pathToFile);
      const mp3  = await ut.callAPI(openai.audio.speech, 'openai.audio.speech.create',
      {
        input: text,
        voice,
        model
      });
      
      const buffer = Buffer.from(await mp3.arrayBuffer());
      await fs.promises.writeFile(speechFile, buffer);
      return buffer;
    },

    
  speechToText: async({pathToFile = "./tests/test-speech.mp3", model = 'whisper-1'}) => {

    const buffer = await fs.promises.readFile(path.resolve(pathToFile));
    const transcription  = await ut.callAPI(openai.audio.transcriptions, 'openai.audio.transcriptions.create', {
      file: await toFile(buffer, path.basename(pathToFile)),
      model,
    });
  
    return transcription.text;
  },


  speechTranslation: async({pathToFile = "./tests/test-speech.mp3", model = 'whisper-1'}) => {
    
    const translation = await ut.callAPI(openai.audio.translations, 'openai.audio.translations.create', {
      file: fs.createReadStream(pathToFile),
      model,
    });
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
    create: async ({text, pathToFile = '', size = "1024x1024", quality="standard", n = 1, model = "dall-e-3"}) => {
      // return console.log(pathToFile.replace(/^\./, ''));

        const response = await ut.callAPI(openai.images, 'openai.images.generate', {
          prompt:text,
          size,
          quality,
          n,
          model
        });
      const url = response?.data[0]?.url;
      // const url = `https://oaidalleapiprodscus.blob.core.windows.net/private/org-0W2DSt5sTB0F2NuqbNIHHcTg/user-m7HmI4bqRdNZxYTHJlFPLN9P/img-nYmIPv103J4yZAw29MTr7N7x.png?st=2024-03-24T17%3A16%3A00Z&se=2024-03-24T19%3A16%3A00Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-03-23T21%3A30%3A02Z&ske=2024-03-24T21%3A30%3A02Z&sks=b&skv=2021-08-06&sig=ByJlRNd/IQsOrgmruP8u/oyjWmKE/PDW4tG9E1YuoRo%3D`;
      if (url && pathToFile.length) {
        const res = await fetch(url);
        if (!res.ok || !res.body) throw new Error(`unexpected response ${res.statusText}`);
        let writer = fs.createWriteStream(pathToFile);
        Readable.fromWeb(res.body).pipe(writer);
      }
      return {url, local:pathToFile.replace(/^\./, '')};

    },
    /*
    accepts only .png RGBA images
    */
    edit: async ({text, pathToFile, pathToMask = '', size = "1024x1024", n = 1, model = "dall-e-2"}) => {

      const params = {
        prompt:text,
        image:fs.createReadStream(pathToFile),
        model,
        n,
        size
    };
    if (pathToMask.length) params.mask = fs.createReadStream(pathToMask);

      const response = await ut.callAPI(openai.images, 'openai.images.edit', params);
      

      // const response = await openai.images.edit(params);

      return response.data[0];

    },
    
    variation: async ({pathToFile, size = "1024x1024", n = 1, model = "dall-e-2"}) => {
      
      const response = await ut.callAPI(openai.images, 'openai.images.createVariation', {
          image:fs.createReadStream(pathToFile),
          model,
          n,
          size
      });
      return response.data[0].url;

    }
}

const recognition = {
  


  image: async ({url, pathToFile, prompt =  "What’s in this image?", max_tokens = 300, model = "gpt-4-vision-preview"}) => {

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
                },
              },
            ],
          },
        ],
        max_tokens
      });
      return {message:response.choices[0].message.content, usage:response.usage};
  },
  /*
  Requires ffmpeg installed
  May exceed the max tokens per minutes limit
  */
  video: async ({pathToFile, outputDir, max_tokens = 300, model = "gpt-4-vision-preview"}) => {

    await ut.cleanDirectory(outputDir);
    await ut.extractVideoFrames(pathToFile, outputDir);
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
      model = "gpt-4-1106-preview"

*/

const assistants = {

  create: async ({
        name , 
        instructions, 
        tools = [], 
        model = "gpt-4-1106-preview"}) => {

    // tools = {type:code_interpreter}, {type:retrieval}, or {type:function, function:{name, description, parameters:{type, properties, required}}}

    const responce = await ut.callAPI(openai.beta.assistants, 'openai.beta.assistants.create', 
        {
            name,
            instructions,
            tools,
            model
        });
    return responce;
  },



  list: async() => {
    const responce = await ut.callAPI(openai.beta.assistants, 'openai.beta.assistants.retrieve', assistant_id);
    return responce;
  },

  listFiles: async({assistant_id}) => {
    const responce = await ut.callAPI(openai.beta.assistants.files, 'openai.beta.assistants.files.list', assistant_id);
    return responce;
  },
  
  retrieve: async({assistant_id}) => {
      const responce = await ut.callAPI(openai.beta.assistants, 'openai.beta.assistants.retrieve', assistant_id);
      return responce;
  },

  retrieveFile: async({assistant_id, file_id}) => {
    const responce = await ut.callAPI(openai.beta.assistants.files, 'openai.beta.assistants.files.retrieve', assistant_id, file_id);
    return responce;
  },

  update: async ({assistant_id, name, instructions, tools, model, file_ids = []}) => {
  
    const responce = await ut.callAPI(openai.beta.assistants, 'openai.beta.assistants.update', assistant_id, {
      name,
      instructions,
      tools,
      model,
      file_ids
    });
    return responce;
  },

  del: async ({assistant_id}) => {
    const responce = await ut.callAPI(openai.beta.assistants, 'openai.beta.assistants.del', assistant_id);
    return responce;
  },

  files:{
    create: async ({file_id}) => {
      //purpose should be "assistants"
      const file = await ut.callAPI(openai.beta.assistants.files, 'openai.beta.assistants.files.create', assistant_id, {file_id})
      return file;
    },
    list: async ({assistant_id}) => {
      const files = await ut.callAPI(openai.beta.assistants.files, 'openai.beta.assistants.files.list', assistant_id);
      return files;
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
          const responce = await ut.callAPI(openai.beta.threads, 'openai.beta.threads.create');
          return responce;
      },

      createAndRun: async({assistant_id, thread = {messages:[]}}) => {
        const responce = await ut.callAPI(openai.beta.threads, 'openai.beta.threads.createAndRun', {assistant_id, thread});
        return responce;
      },
    
      /*
      id = 'thread_D1Fc45AQAhZsywNdSAGReFpM'
      */
      retrieve: async ({thread_id}) => {
        const responce = await ut.callAPI(openai.beta.threads, 'openai.beta.threads.retrieve', thread_id);
          return responce;
      },

     
    
      del: async({thread_id}) => {
        const responce = await ut.callAPI(openai.beta.threads, 'openai.beta.threads.del', thread_id);
        return responce;
      },

    
    messages:{
    
        create: async(thread_id, role = 'user', content = '') => {
          
            const responce = await ut.callAPI(openai.beta.threads.messages, 'openai.beta.threads.messages.create', 
              thread_id,
              {
                role,
                content
              }
            );
            return responce;
        },
        list: async({thread_id, clean = false}) => {

          const responce = await ut.callAPI(openai.beta.threads.messages, 'openai.beta.threads.messages.list', 
            thread_id
          );
          if (clean) {
            const messages = [];
            for (message of responce.data){
              messages.push(message.content);
            }
              // console.log({message0:messages[0][0].text, message1:messages[1][0].text});
            return messages;
          }
          return responce;
        },
        listFiles: async({thread_id, message_id}) => {
          const responce = await ut.callAPI(openai.beta.threads.messages, 'openai.beta.threads.messages.files.list', 
            thread_id,
            message_id
          );
          return responce;

        },

        retrieve: async({thread_id, message_id}) => {
          const responce = await ut.callAPI(openai.beta.threads.messages, 'openai.beta.threads.messages.list', 
            thread_id,
            message_id
          );
          return responce;
        
        },
        retrieveFile: async({thread_id, message_id, file_id}) => {
          const responce = await ut.callAPI(openai.beta.threads.messages.files, 'openai.beta.threads.messages.files.retrieve', 
            thread_id,
            message_id,
            file_id
          );
          return responce;
        },
        update: async({thread_id, message_id, user_id}) => {
          const responce = await await ut.callAPI(openai.beta.threads.messages, 'openai.beta.threads.messages.update', 
              thread_id, 
              message_id,
              {
                metadata: {
                  modified: "true",
                  user: user_id,
                },
              })
            return responce;
        }
    },

    runs:{
        create: async({thread_id, assistant_id}) => {
          const responce = await ut.callAPI( openai.beta.threads.runs, 'openai.beta.threads.runs.create', 
            thread_id,
            { 
              assistant_id
            }
          );
          return responce;
        },
        list: async({thread_id}) => {
            const responce = await ut.callAPI(openai.beta.threads.runs, 'openai.beta.threads.runs.list', thread_id);
            return responce;
        },
        retrieve: async({thread_id, run_id}) => {
          const responce = await ut.callAPI(openai.beta.threads.runs, 'openai.beta.threads.runs.retrieve', 
            thread_id,
            run_id
          );
          return responce;
        },


      // .....logs
        listRunSteps: async({thread_id, run_id, limit=20, clean}) => {
          const responce = await ut.callAPI(openai.beta.threads.runs.steps, 'openai.beta.threads.runs.steps.list', 
            thread_id,
            run_id
          );
          if (clean) {  
            const messages = [];
            for (log of responce.body.data){
              messages.push(log.step_details);
            }
            return messages;
          }
          return responce;
        },
        retrieveRunStep: async({thread_id, run_id, step_id}) => {
          const responce = await ut.callAPI(openai.beta.threads.runs.steps, 'openai.beta.threads.runs.steps.retrieve', 
            thread_id,
            run_id,
            step_id
          );
          return responce;
        },
        update: async({thread_id, run_id, data = {}}) => {
            const responce = await ut.callAPI(openai.beta.threads.runs, 'openai.beta.threads.runs.update', data);
            return responce;
        },
        submitToolOutput: async({thread_id, run_id, output = {tool_outputs: []}}) => {
         
            // tool_outputs: [
            //   {
            //     tool_call_id: "call_001",
            //     output: "70 degrees and sunny.",
            //   },
            // ],
          
          const responce = await ut.callAPI(openai.beta.threads.runs.steps.tools, 'openai.beta.threads.runs.steps.tools.submit', 
            thread_id,
            run_id,
            output
          );
          return responce;
        },
        cancel: async({thread_id, run_id}) => {
          const responce = await ut.callAPI(openai.beta.threads.runs, 'openai.beta.threads.runs.cancel', 
            thread_id,
            run_id
          );
          return responce;
        }


    }

  }
}





module.exports = {
  Chat, //class Chat
  // chat.message({text}) => {message, messages, usages} => string
  // chat.voiceMessage({inputFilePath, outputFilePath, voice}) => {text, message, outputFilePath}
  tokens,
  // tokens.count({text, model}) => integer
  nlp,
  // nlp.generate({text, messages, system, model, tools, tool_choice}) => {message, messages, usages}
  // nlp.embedding({text, model}) => {embedding, usage}
  // nlp.classification({text, model}) => responce
  
  files,
  // files.create({pathToFile, purpose}) => responce
  // files.list() => responce
  // files.retrieve({file_id}) => responce
  // files.content({file_id}) => responce
  // files.del({file_id}) => responce
  fineTune,
  // fineTune.create({pathToFile, training_file, hyperparameters, suffix, model, deleteFile, maxTokens}) => responce
  // fineTune.list() => responce
  // fineTune.events({id, limit}) => responce
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
  // speech.speechTranslation({pathToFile, model}) => string
  recognition,
  // recognition.image({url, pathToFile, prompt, max_tokens, model}) => {message, usage}
  // recognition.video({pathToFile, outputDir, max_tokens, model}) => {message, usage}
  assistants
  // assistants.create({name, instructions, tools, model}) => responce
  // assistants.list() => responce
  // assistants.retrieve({assistant_id}) => responce
  // assistants.update({assistant_id, name, instructions, tools, model, file_ids}) => responce
  // assistants.del({assistant_id}) => responce

  // assistants.threads.create({messages}) => responce
  // assistants.threads.createAndRun({assistant_id, thread}) => responce
  // assistants.threads.retrieve({thread_id}) => responce
  // assistants.threads.update({thread_id, messages}) => responce
  // assistants.threads.del({thread_id}) => responce

  // assistants.threads.messages.create({thread_id, role, content}) => responce
  // assistants.threads.messages.list({thread_id, clean}) => responce
  // assistants.threads.messages.listFiles({thread_id, message_id}) => responce
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

  // assistants.files.create({file_id}) => responce
  // assistants.files.list({assistant_id}) => responce
  // assistants.files.retrieve({assistant_id, file_id}) => responce
  // assistants.files.del({assistant_id, file_id}) => responce
};



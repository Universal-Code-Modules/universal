require('dotenv').config()
const ut = require(process.cwd() + '/utilities');
const OpenAI = require ("openai");
const toFile  = OpenAI.toFile;
const fs  = require ("fs");
const path  = require ("path");


const util = require('util')
const stream = require('stream')
const pipeline = util.promisify(stream.pipeline);

const openai = new OpenAI({apiKey: process.env['OPENAI_API_KEY']});
//  console.log(openai.name, openai.constructor.name);
// process.exit(0);


  
  //......Natural Language Processing.......


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

  const completion = async (messages = [], 
    system=`You are a useful assistant. You can answer questions, provide information, and help with tasks.`, 
    model = "gpt-4-1106-preview") => {
    
    const completion = await ut.callAPI(openai.chat.completions, 'openai.chat.completions.create', {
      messages: [
        {
          "role": "system",
          "content": system
        },
        ...messages
      ],
      model: model
    });
  
   
    return {message:completion.choices[0], usage:completion.usage};
  }


  const textModeration = async(text, model = 'content-filter-alpha-c4') => {
    
    const responce = await ut.callAPI(openai.chat.moderations, 'openai.chat.moderations.create', {
      input: text,
       model,
    });
    
    return responce.results[0];
  
  }


//..........AUDIO.............

  /*
  voices: alloy, echo, fable, onyx, nova, and shimmer

  */

  const textToSpeech = async (text, pathToFile = "./tests/test-speech.mp3", voice = "onyx", model = "tts-1") => {
    
    
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
  }

  
const speechToText = async(pathToFile = "./tests/test-speech.mp3", model = 'whisper-1') => {

  const buffer = await fs.promises.readFile(path.resolve(pathToFile));
  const transcription  = await ut.callAPI(openai.audio.transcriptions, 'openai.audio.transcriptions.create', {
    file: await toFile(buffer, path.basename(pathToFile)),
    model,
  });
 
  return transcription.text;
}


const speechTranslation = async(pathToFile = "./tests/test-speech.mp3", model = 'whisper-1') => {
  const buffer = await fs.promises.readFile(path.resolve(pathToFile));
   const translation = await ut.callAPI(openai.audio.translations, 'openai.audio.translations.create', {
    file: await toFile(buffer, path.basename(pathToFile)),
    model,
  });
  return translation.text;
}

//..........IMAGE.............

/*
   
    prompt: "a white siamese cat",
     model: "dall-e-3",
    n: 1, (dalle-3 always generates only one image per request)
    size: "1024x1024",

*/
const createImage = async (prompt, size = "1024x1024", n = 1, model = "dall-e-3",) => {
  
    const response = await ut.callAPI(openai, 'openai.createImage', {
      prompt,
      n,
      size,
      model
    });
    // image_url = response.data.data[0].url;
    
  return response.data.data[0].url;

}


//..........VISION.............


const test = async() => {

  const response = client.chat.completions.create(
    model="gpt-4-vision-preview",
    messages=[
      {
        "role": "user",
        "content": [
          {"type": "text", "text": "What’s in this image?"},
          {
            "type": "image_url",
            "image_url": {
              "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
            },
          },
        ],
      }
    ],
    max_tokens=300,
  )
  
  return response.choices[0];
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


const createAssistant = async (
      name , 
      instructions, 
      tools = [], 
      model = "gpt-4-1106-preview") => {

  const responce = await ut.callAPI(openai.beta.assistants, 'openai.beta.assistants.create', 
      {
          name,
          instructions,
          tools,
          model
      });
  return responce;
}
/*
 id = "asst_q0mHbtQqRndSmFWM8UyFMpWM"
*/
 const retrieveAssistant = async(id) => {
    const responce = await ut.callAPI(openai.beta.assistants, 'openai.beta.assistants.retrieve', id);
    return responce;
}

/*
    id = "asst_q0mHbtQqRndSmFWM8UyFMpWM"
   {
      instructions:
        "You are an HR bot, and you have access to files to answer employee questions about company policies. Always response with info from either of the files.",
      name: "HR Helper",
      tools: [{ type: "retrieval" }],
      model: "gpt-4-1106-preview",
      file_ids: [
        "file-abc123",
        "file-abc456",
      ],
    }
*/
const updateAssistant = async (id, name, instructions, tools, model, file_ids = []) => {
  
    const responce = await ut.callAPI(openai.beta.assistants, 'openai.beta.assistants.update', id, {
      name,
      instructions,
      tools,
      model,
      file_ids
    });
    return responce;
}

const deleteAssistant = async (id) => { 
  
}

const createThread = async() => {
    const responce = await ut.callAPI(openai.beta.threads, 'openai.beta.threads.create');
    return responce;
}

/*
id = 'thread_D1Fc45AQAhZsywNdSAGReFpM'
*/
const retrieveThread = async (id) => {
   const responce = await ut.callAPI(openai.beta.threads, 'openai.beta.threads.retrieve', id);
    return responce;
}

/*
'thread_D1Fc45AQAhZsywNdSAGReFpM'
 {
        role: "user",
        content: "I need to solve the equation `3x + 11 = 14`. Can you help me?"
      }
*/
const addMessageToThread = async(thread_id, role = 'user', content = '') => {

    const responce = await ut.callAPI(openai.beta.threads.messages, 'openai.beta.threads.messages.create', 
      thread_id,
      {
        role,
        content
      }
    );
    return responce;
}
/*
'thread_D1Fc45AQAhZsywNdSAGReFpM',
    { 
      assistant_id: assistant.id,
      instructions: "Please address the user as Jane Doe. The user has a premium account."
    }
*/

const runThread = async(thread_id, assistant_id, instructions) => {
  const responce = await ut.callAPI( openai.beta.threads.runs, 'openai.beta.threads.runs.create', 
    thread_id,
    { 
      assistant_id,
      instructions
    }
  );
  return responce;
}

/*

*/

const retrieveRun = async(thread_id, run_id) => {
  const responce = await ut.callAPI(openai.beta.threads.runs, 'openai.beta.threads.runs.retrieve', 
    thread_id,
    run_id
  );
  return responce;
}

const retrieveThreadMessages = async(thread_id) => {
  const responce = await ut.callAPI(openai.beta.threads.messages, 'openai.beta.threads.messages.list', 
    thread_id
  );
   return responce;

}

const cleanThreadMessages = (threadMessages) => {
  const messages = [];
  for (message of threadMessages.data){
    messages.push(message.content);
  }
    // console.log({message0:messages[0][0].text, message1:messages[1][0].text});
  return messages;
}

  const getRunLogs = async(thread_id, run_id) => {
    const responce = await ut.callAPI(openai.beta.threads.runs.steps, 'openai.beta.threads.runs.steps.list', 
      thread_id,
      run_id
    );
      
    const messages = [];
    for (log of responce.body.data){
      messages.push(log.step_details);
    }
    return messages;
}




module.exports = {
  completion,
  textModeration,
  textToSpeech,
  speechToText,
  speechTranslation,
  createImage,
  test,
  createAssistant,
  retrieveAssistant,
  updateAssistant,
  createThread,
  retrieveThread,
  addMessageToThread,
  runThread,
  retrieveRun,
  retrieveThreadMessages,
  cleanThreadMessages,
  getRunLogs
};



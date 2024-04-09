const models = {
    completeon:{
      'gpt-4-0125-preview':{prices:{prompt:10.00, completion:30.00}},
      'gpt-4-1106-preview':{prices:{prompt:10.00, completion:30.00}},
      'gpt-3.5-turbo-0125':{prices:{prompt:0.50, completion:1.50}}
    },
    //...No models in Tiktoken
    embedding:{
      'text-embedding-3-small':	{prices:{prompt:0.02}, dimension:1536},
      'text-embedding-3-large':	{prices:{prompt:0.13}, dimension:3072},
      'text-embedding-ada-002':{prices:{prompt:0.10}, dimension:1536}
    },
    recognition:{
      'gpt-4-vision-preview':{tokens:{base:85, block:170}, prices:{prompt:10.00, completion:30.00}},
    },
    images:{
      'dall-e-3':{prices:{standard:{'1024×1024':0.040, '1024×1792':0.080, '1792×1024':0.080}, hd:{'1024×1024':0.080, '1024×1792':0.120, '1792×1024':0.120}}},
      'dall-e-2':{prices:{standard:{'256×256':0.016, '512×512':0.018, '1024×1024': 0.020}}}
    },
    fineTune:{
      'gpt-3.5-turbo':{prices:{training:8.00, prompt:3.00, completion:6.00}},
      'davinci-002':{prices:{training:6.00,  prompt:12.00, completion:12.00}},
      'babbage-002':{prices:{training:0.40,  prompt:1.60, completion:1.60}}
    },
    speech: {
      'tts-1':{prices:{prompt:15.00}},
      'tts-1-hd':{prices:{prompt:30.00}},
      'whisper-1':{prices:{minute:0.006}}, 
    },
    assistants:{
        'assistant':{prices:{'code-interpreter-session': 0.03, 'retrieval-GB-day':0.20}}
    } 
  };



const tiers = {}



module.exports = {models, tiers };
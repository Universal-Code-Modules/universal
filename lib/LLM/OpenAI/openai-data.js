const models = {
    completion:{
      'gpt-4-turbo-2024-04-09':{prices:{prompt:10.00, completion:30.00}},
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

/*
Rate limits are measured in five ways: 
RPM (requests per minute), 
RPD (requests per day), 
TPM (tokens per minute), 
TPD (tokens per day), 
and IPM (images per minute). 
Rate limits can be hit across any of the options depending on what occurs first. 
For example, you might send 20 requests with only 100 tokens to the ChatCompletions endpoint and that would fill your limit (if your RPM was 20), 
even if you did not send 150k tokens (if your TPM limit was 150k) within those 20 requests.

Batch API queue limits are calculated based on the total number of input tokens queued for a given model. 

Tokens from pending batch jobs are counted against your queue limit. Once a batch job is completed, its tokens are no longer counted against that model's limit.

Other important things worth noting:

Rate limits are defined at the organization level and at the project level, not user level.
Rate limits vary by the model being used.
Limits are also placed on the total amount an organization can spend on the API each month. These are also known as "usage limits".

*/

const tiers = {

    free: {name:'Free', price:0.00, description:'Free tier with limited access', limits:{
        'gpt-3.5-turbo': { RPM: 3, RPD: 200, TPM: 40000, BATCH_QUEUE_LIMIT: 200000 },
        'text-embedding-3-small': { RPM: 3, RPD: 200, TPM: 150000, BATCH_QUEUE_LIMIT: null },
        'whisper-1': { RPM: 3, RPD: 200, TPM: null, BATCH_QUEUE_LIMIT: null },
        'tts-1': { RPM: 3, RPD: 200, TPM: null, BATCH_QUEUE_LIMIT: null },
        'dall-e-2': { RPM: '5 img/min', RPD: null, TPM: null, BATCH_QUEUE_LIMIT: null },
        'dall-e-3': { RPM: '1 img/min', RPD: null, TPM: null, BATCH_QUEUE_LIMIT: null }
    }},
    tier1: {name:'Tier 1', price:10.00, description:'Paid tier with access to all models', limits: {
        'gpt-4-turbo': { RPM: 500, RPD: null, TPM: 300000, BATCH_QUEUE_LIMIT: 900000 },
        'gpt-4': { RPM: 500, RPD: 10000, TPM: 10000, BATCH_QUEUE_LIMIT: 100000 },
        'gpt-3.5-turbo': { RPM: 3500, RPD: 10000, TPM: 60000, BATCH_QUEUE_LIMIT: 200000 },
        'text-embedding-3-large': { RPM: 500, RPD: 10000, TPM: 1000000, BATCH_QUEUE_LIMIT: null },
        'whisper-1': { RPM: 50, RPD: null, TPM: null, BATCH_QUEUE_LIMIT: null },
        'tts-1': { RPM: 50, RPD: null, TPM: null, BATCH_QUEUE_LIMIT: null },
        'tts-1-hd': { RPM: 3, RPD: null, TPM: null, BATCH_QUEUE_LIMIT: null },
        'dall-e-2': { RPM: '5 img/min', RPD: null, TPM: null, BATCH_QUEUE_LIMIT: null },
        'dall-e-3': { RPM: '5 img/min', RPD: null, TPM: null, BATCH_QUEUE_LIMIT: null }
      }},
    tier2: {name:'Tier 2', price:20.00, description:'Paid tier with access to all models and additional features', limits:{
      'gpt-4-turbo': { RPM: 5000, TPM: 450000, BATCH_QUEUE_LIMIT: 1350000 },
      'gpt-4': { RPM: 5000, TPM: 40000, BATCH_QUEUE_LIMIT: 200000 },
      'gpt-3.5-turbo': { RPM: 3500, TPM: 80000, BATCH_QUEUE_LIMIT: 400000 },
      'text-embedding-3-large': { RPM: 500, TPM: 1000000, BATCH_QUEUE_LIMIT: null },
      'whisper-1': { RPM: 50, TPM: null, BATCH_QUEUE_LIMIT: null },
      'tts-1': { RPM: 50, TPM: null, BATCH_QUEUE_LIMIT: null },
      'tts-1-hd': { RPM: 5, TPM: null, BATCH_QUEUE_LIMIT: null },
      'dall-e-2': { RPM: '50 img/min', TPM: null, BATCH_QUEUE_LIMIT: null },
      'dall-e-3': { RPM: '7 img/min', TPM: null, BATCH_QUEUE_LIMIT: null }
    }},
    tier3: {name:'Tier 3', price:30.00, description:'Paid tier with access to all models and additional features', limits:{
      'gpt-4-turbo': { RPM: 5000, TPM: 600000, BATCH_QUEUE_LIMIT: 40000000 },
      'gpt-4': { RPM: 5000, TPM: 80000, BATCH_QUEUE_LIMIT: 5000000 },
      'gpt-3.5-turbo': { RPM: 3500, TPM: 160000, BATCH_QUEUE_LIMIT: 10000000 },
      'text-embedding-3-large': { RPM: 5000, TPM: 5000000, BATCH_QUEUE_LIMIT: null },
      'whisper-1': { RPM: 100, TPM: null, BATCH_QUEUE_LIMIT: null },
      'tts-1': { RPM: 100, TPM: null, BATCH_QUEUE_LIMIT: null },
      'tts-1-hd': { RPM: 7, TPM: null, BATCH_QUEUE_LIMIT: null },
      'dall-e-2': { RPM: '100 img/min', TPM: null, BATCH_QUEUE_LIMIT: null },
      'dall-e-3': { RPM: '7 img/min', TPM: null, BATCH_QUEUE_LIMIT: null }
    }},
    tier4: {name:'Tier 4', price:40.00, description:'Paid tier with access to all models and additional features', limits:{
      'gpt-4-turbo': { RPM: 10000, TPM: 800000, BATCH_QUEUE_LIMIT: 80000000 },
      'gpt-4': { RPM: 10000, TPM: 300000, BATCH_QUEUE_LIMIT: 30000000 },
      'gpt-3.5-turbo': { RPM: 10000, TPM: 1000000, BATCH_QUEUE_LIMIT: 100000000 },
      'text-embedding-3-large': { RPM: 10000, TPM: 5000000, BATCH_QUEUE_LIMIT: null },
      'whisper-1': { RPM: 100, TPM: null, BATCH_QUEUE_LIMIT: null },
      'tts-1': { RPM: 100, TPM: null, BATCH_QUEUE_LIMIT: null },
      'tts-1-hd': { RPM: 10, TPM: null, BATCH_QUEUE_LIMIT: null },
      'dall-e-2': { RPM: '100 img/min', TPM: null, BATCH_QUEUE_LIMIT: null },
      'dall-e-3': { RPM: '15 img/min', TPM: null, BATCH_QUEUE_LIMIT: null }
    }},
    tier5: {name:'Tier 5', price:50.00, description:'Paid tier with access to all models and additional features', limits:{
      'gpt-4-turbo': { RPM: 10000, TPM: 1500000, BATCH_QUEUE_LIMIT: 250000000 },
      'gpt-4': { RPM: 10000, TPM: 300000, BATCH_QUEUE_LIMIT: 45000000 },
      'gpt-3.5-turbo': { RPM: 10000, TPM: 2000000, BATCH_QUEUE_LIMIT: 300000000 },
      'text-embedding-3-large': { RPM: 10000, TPM: 10000000, BATCH_QUEUE_LIMIT: null },
      'whisper-1': { RPM: 500, TPM: null, BATCH_QUEUE_LIMIT: null },
      'tts-1': { RPM: 500, TPM: null, BATCH_QUEUE_LIMIT: null },
      'tts-1-hd': { RPM: 20, TPM: null, BATCH_QUEUE_LIMIT: null },
      'dall-e-2': { RPM: '500 img/min', TPM: null, BATCH_QUEUE_LIMIT: null },
      'dall-e-3': { RPM: '50 img/min', TPM: null, BATCH_QUEUE_LIMIT: null }
    }}
}


module.exports = {models, tiers };
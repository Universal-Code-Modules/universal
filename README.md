# Universal modules

The target of the project is to create number of universal and reusable modules for different purposes.

## Requrements
Create separate local postgres database

Run npm install

Create in the root directory .env file with the following content:
```
PGUSER=''
PGPASSWORD=''
PGDATABASE=''
PGHOST=''
PGPORT=''

MJ_APIKEY_PUBLIC='your API key'
MJ_APIKEY_PRIVATE='your API secret'
MJ_API_TOKEN='your API token'
 
SENDGRID_API_KEY=''
OPENAI_API_KEY=''
HUGGINGFACE_TOKEN=''
ELEVENLABS_API_KEY=''
NODE_ENV='test'
LOG_TIME='true'
DOMAIN='localhost'
ADMIN_EMAIL='your_email'
TEST_USER_EMAIL='your_email'

```

Fill the .env file with the following data:
* Your local postgres credentials
* Register free sendgrid account and get the API key (for developers using email module)
* Register free openai account and get the API key (for developers of LLM module)
* Register free huggingface account and get the token (for developers of LLM module)
* Register free elevenlabs account and get the API key (for developers using Elevenlabs speech-to-text module)

Check periodically changes of the package.json file and install the new dependencies.

All non private global settings, like port numbers etc. you should store in config.js

## Modules

### Email

This module manages email interaction with users. It should be able to send emails to the users, verify the email address, send the password reset link and so on.


### DB

This module should manage interactions with databases. For starters: Postgres. 

Next: Redis, Mango and Cassandra.

### LLM

This module should manage interactions with AI language models:

**Openai**  - there is the connector class managing many kinds of interactions with the Openai API, mostly self explanatory. 
I will add image generations in the nearest future. You should have an openai account and the [API key](https://platform.openai.com/api-keys) in .env file.

**Huggingface** - there is the connector class managing many kinds of interactions with the Huggingface API to multiple open-source LLMs, mostly self explanatory.
You should obtain [Hugginface token](https://huggingface.co/settings/tokens) and place it in .env file.

**Ollama** -  there is the connector class managing many kinds of interactions with multiple local LLMs. 
You should install [Ollama](https://github.com/ollama/ollama) on your local machine to use this module. Then run following commands (with your preferred model - in this case llama2):

```
ollama serve
ollama run llama2
```  

**Elevenlabs** - one of the most popular speech-to-text services. There is the connector class managing many kinds of interactions with the Elevenlabs API, mostly self explanatory. You should obtain [Elevenlabs API key](https://www.eleven-labs.com/en/docs/speech-to-text/getting-started) and place it in .env file.

### Payment systems

We should create client-server side modules for Stripe and Paypal

### Social networks

We should create client-server side modules for login/signup through Google, Facebook and Github

### Frontend

There are 3 subrepositories for **Vue**, **React** and **Angular** for  running and testing front-end components. 
In the future maybe we will try vanilla WebComponents, though it is not a priority and I have doubts about it.

CSS frameworks I think about are: Bootstrap and Tailwind, I will write instructions how to switch.
Other CSS frameworks are not a priority so far.

### Fullstack

I'm going to add sub-repositories for the **Next** and **Nuxt** frameworks so we can compare the pros and cons of using them versus separate Front-Backend combinations. 

### Servers

I will add subrepositories for **Metarhia**, **Fastify**, and **Express**, with optional **Nginx** load balancer. This way we can compare side-by-side their features, as well as try load testing and diagnostics.

## General development guidance

* Each module should contain the main class and optionally any number of interrelated subclasses.
* Each class should be maxiamally reusable, independent and configurable.
* It should be easy to use and understand. 
* It should be easy to test.

## Testing

I have an experience with Jest and I would like to use it for testing (but we may set other systems in parrallel). 
To check a module functionality without Jest you can add some code to index.js in the root, but keep your changes locally and don't send them to github.
Check the example of Jest usage in lib/LLM/OpenAi/tests/openai-connectors.test.js.
Run tests with: npm test command for all tests (though it's not recommended) or run particular test with following code:
```
// pattern:
jest sample-file 
// OR file name:
jest path/to/sample-file.test.js 

```

ALternatively, you can check manually if a method works by placing following code in the index.js file in the root (in this case we testing Elevenlabs module):
```

(async () => {  
    const res = await require('./lib/LLM/Elevenlabs/elevenlabs-connector').getVoice();
})()
```
Use ut.callAPI universal method to call API endpoints in modules.

If LOG_API_CALL_TIME config variable is set to true, each method should measure and print the each API call time.

If LOG_API_CALL_RESULT config variable is set to true, each method should print the full api responce to pick required portion of data to return from a method.

For those who unfamiliar with backend, you run following command in the terminal:
``` 
node index.js
```
Just don't forget to remove the code from the index.js file after testing.

## Diagnostics

I would like to use [Clinic.js](https://clinicjs.org/) for diagnostics, but we may set other systems in parrallel.
To use it, you should install it globally with npm install -g clinic and then run it with clinic doctor command. [Read more](https://clinicjs.org/documentation/) and check [examples](https://github.com/clinicjs/node-clinic-doctor-examples).

```
npm install -g clinic
npm install -g autocannon
clinic doctor -- node server.js

```

## Deployment

A user peak a required module folder (the folder should contain all the necessary files, except utilities.js in the root).
The functionality of a module should be tested on the local machine and then deployed to the cloud.
A user should manually peak and install the module dependencies from the package.json.

## Contributing

Anyone is welcome to contribute to the project. The project is open for the public and I would like to keep it that way. 
Peak a module you see a potential in and start working on it.

## 

To be continued...

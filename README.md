# Universal modules

The target of the project is to create number of universal and reusable modules for different purposes.

## Requrements
Create separate local postgres database

Run npm install

Create in the root directory .env file with the following content:
```
PGUSER = ''
PGPASSWORD = ''
PGDATABASE = ''
PGHOST = ''
PGPORT = '' 
SENDGRID_API_KEY=''
OPENAI_API_KEY=''
NODE_ENV='test'
DOMAIN='localhost'
ADMIN_EMAIL='your_email'
TEST_USER_EMAIL='your_email'

```

Fill the .env file with the following data:
* Your local postgres credentials
* Register free sendgrid account and get the API key (for developers using email module)
* Register free openai account and get the API key (for developers of LLM module)

Check periodically changes of the package.json file and install the new dependencies.

## Modules

### Email

This module shouls manage sending emails to the users. It should be able to send emails to the users, verify the email address, and send the password reset link.


### DB

This module should manage interactions with databases. For starters: Postgres. 

Next: Redis, Mango and Cassandra.

### LLM

This module should manage interactions with AI language models:

Openai  - there is the connector class managing many kinds of intercations with the Openai API, mostly self explanatory. 
I will add image generations in the nearest future. You should have an openai account and the API key (from here: https://platform.openai.com/api-keys) in .env file.

Hugginfce - there is the connector class managing many kinds of intercations with the Huggingface API to multiple open-source LLMs, mostly self explanatory.
You should obtain Hugginface token here: https://huggingface.co/settings/tokens and place it in .env file.

Ollama -  there is the connector class managing many kinds of intercations with multiple local LLMs. 
You should install Ollama from https://github.com/ollama/ollama on your local machine to use this module. Then run following commands (with your preferred model - in this case llama2):

* ollama serve
* ollama run llama2
### Frontend

I will add 3 subrepositories for Vue, React and Angular, all set for front-end running and testing. 
Maybe for vanilla WebComponents, though it is not a priority and I have doubts about it.

CSS frameworks I think about are: Bootstrap and Tailwind, I will write instructions how to switch.
Other CSS frameworks, like Bulma, Materialize, Foundation, Semantic UI, Pure, Skeleton, Milligram, Spectre, Tachyons, and others are not a priority.

## General development guidance

* Each module should contain the main class and optionally any number of interrelated subclasses.
* Each class should be maxiamally reusable, independent and configurable.
* It should be easy to use and understand. 
* It should be easy to test.

## Testing

I have an experience with Jest and I would like to use it for testing (but we may set other systems in parrallel). 
To check a module functionality without Jest you can add some code to index.js in the root, but keep your changes locally and don't send them to github.
Check the example of Jest usage in lib/LLM/OpenAi/openai-connectors.test.js.
Run tests with: npm test command.


## Deployment

A user peak a required module folder (the folder should contain all the necessary files, except utilities.js in the root).
The functionality of a module should be tested on the local machine and then deployed to the cloud.
A user should manually peak and install the module dependencies from the package.json.

## Contributing

Anyone is welcome to contribute to the project. The project is open for the public and I would like to keep it that way. 
Peak a module you see a potential in and start working on it.

## 

To be continued...

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

## Modules

### Email

This module shouls manage sending emails to the users. It should be able to send emails to the users, verify the email address, and send the password reset link.

### DB

This module should manage interactions with databases. For starters: Postgres. 

Next: Redis, Mnngo and Cassandra.

### LLM

This module should manage interactions with AI language models (I will provide examples and instructions).




## General development guidance

* Each module should contain number of classes.
* Each class should be maxiamally reusable, independent and configurable.
* It should be easy to use and understand. 
* It should be easy to test.

## Testing


## Deployment

## Contributing

To be continued...

# Jonathan's News API

**Welcome** to my nc-news portfolio project.

## Setup Instructions

Here are the steps to setup an .env file so you can run this project on your own computer:

1. Once you have cloned this repo, open the main project folder (containing README.md).

2. Create files named `.env.development` and `.env.test`

3. Copy and paste the following code into the `.env.developement` file:

   > PGDATABASE=nc_news

4. Copy and paste the following code into `.env.test`:
   > PGDATABASE=nc_news_test
5. Using terminal, use `npm install` to install required dependencies.

6. Finally use `npm run setup-dbs` to create your databases.

# "FORUM FORGE"

(The name's a WIP...)

## A.K.A. Jonathan's News API

**Welcome** to my nc-news portfolio project.

This project is an attempt to recreate a social news webiste / forum, such as Digg or Reddit where content is socially curated by site users through voting.

Currently the project is at the back-end phase of development, and as such there is no front-end section to the website, but this should be availble, soon.

---

### View online

You can view this api online here:
[https://forum-forge.onrender.com/api](https://forum-forge.onrender.com/api)

As this api currently serves json files, it may be easier to view using a chrome plugin, such as
[this one](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en)

---

## Setup Instructions:

\* _Please note: This guide assumes that you have node, PostgreSQL, npm and git installed on your computer in advance._

Recommended Versions:

- Node: 20.8.0
- Postgres: 8.7.3

### How to clone

If you would like to clone this project to run on your own computer, please follow these instructions:

1. Copy the local HTTPS link from the green "<>Code" dropdown above [this repo](https://github.com/jonnywb/nc-news).

2. On your computer, using terminal, go to the directory where you would like to store the files.

3. Type "git clone <[link](https://github.com/jonnywb/nc-news.git)>":

   > git clone https://github.com/jonnywb/nc-news.git

4. Open the directory using your code editor.

---

### Database Setup:

Here are the steps to setup an .env file so you can run this project on your own computer:

1. Once you have cloned this repo, open the main project folder (containing README.md).

2. Create files named `.env.development` and `.env.test`

3. Copy and paste the following code into the `.env.developement` file:

   > PGDATABASE=nc_news

4. Copy and paste the following code into `.env.test`:

   > PGDATABASE=nc_news_test

5. Using terminal, use `npm install` to install required dependencies.

6. Finally use `npm run setup-dbs` to create your databases.

---

### How to run tests:

To run tests in terminal, type:

> npm test app

- or to test the untils file:

  > npm test utils

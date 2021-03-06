# learn-node-crypto

start to learn writing for node, console, crypto, finally it should be a passwordmanager

using this tool is easy.

1. starting with `node cli.js`
2. telling the Masterpasssword
3. just follow the instructions in screen 😉
4. thats it

## Using chalk

for colorizing output in console<br/>
[chalk on Github](https://github.com/chalk/chalk)

## Using Inquirer

for communication with users over console. Make it easier to write prompts and handle the response, build as async/await functions<br/>
[inquierer on Github](https://github.com/SBoudrias/Inquirer.js/)

## Using CryptoJS

for hashing masterpassword and de/encrypt data <br />
[CryptoJS on Github](https://github.com/brix/crypto-js)

## Using .env

for hiding url key and encrypted master key <br />
[dotenv auf npm](https://www.npmjs.com/package/dotenv)

example

```js
const db = require('db');
db.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
});
```

values in .env file

```
DB_URL=  ***
DB_NAME=  ***
DB_COLLECTION= ***
MASTER_PWD=  ***
```

## Using MongoDB Atlas (Cloud)

for storing data in documents/collections. Learning to handle CRUD operations [MongoDB Free Atlas Account](https://www.mongodb.com/)

Dataformat

```json
{
    "_id": {
        "$oid": "5fad42cc889183e5bf79b625"
    },
    "name": "home",
    "category": "wifi",
    "value": "U2FsdGVkX1+7hbj5RIah9LXes8cr48Cm8YrqIrPgMfE="
}
```

### db.json ursprünglich

```json
{
    "master": "",
    "public": {
        "wifi": {
            "home": "********",
            "work": "********",
            "Tante": "********"
        },
        "homebanking": {
            "bank": "********",
            "creditcard": "********"
        }
    }
}
```

## Add express.js

to build a simple api and host a local server

### to update existing document

use the \_id/ new password to select document to change

```js
    app.put('/password/?id=passwordID&password=newPassword',
```

code using query operators

```js
app.post('/password/', async function (req, res) {
    const newDocument = {};
    newDocument.category = req.query.category;
    newDocument.name = req.query.name;
    const rawValue = req.query.password;
    newDocument.value = encrypt(rawValue, process.env.MASTER_PWD);
    await insertNewDocument(process.env.DB_COLLECTION, newDocument);
    res.send('Got a POST request');
});
```

changed to operation with request.body (JSON type based) & the body parser of express.js

```js
    app.use(express.json())
    ...
    const password = request.body;
```

### to delete document

use the \_id to select document to delete

```js
    {"_id":{"$oid":"5fb26eea2843faefa4d06b7a"}, ...
    app.delete('/password/:passwordID',
```

### to insert new document

use post method on the following path

    app.post('/password/?cat=category&name=name&value=password',

## Nodemon & Concurrently

nodemon install

```
npm i --save-dev nodemon
```

using to automatically restart server.js and the react app

```json
"devDependencies": {
    "concurrently": "^5.3.0",
    "nodemon": "^2.0.6"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "server": "nodemon server.js",
```

to only restart the server if the related code is changed

nodemon.json

```json
{ "ignore": ["client/*"] }
```

## storybook

install storybook inside the client folder

```npm
npx sb init
```

## deployment

preperations for deployment

changes in server.js

```js
const port = process.env.port || 3001;

...

app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/storybook', express.static(path.join(__dirname, 'client/storybook-static')));

app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});
```

ignoring the build folder in .gitignore

```
# own stuff
.masterpwd
db.json
client/build
client/storybook-static
```

write scripts for heroku deployment

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "server": "nodemon server.js",
    "client": "cd client && npm start",
    "dev": "concurrently \"npm run server\" \"npm run client\" ",
    "story": "cd client && npm run storybook",
    "build": "cd client && npm run build && npm run build-storybook",
    "start": "node server.js",
    "postinstall": "cd client && npm install"
  },
```

!!!! IMPORTANT SIDE NODE

all dependency have to be in the right place, all necessary for production have to be in the regular dependencies

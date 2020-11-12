# learn-node-crypto
start to learn writing for node, console, crypto, finally it should be a passwordmanager

using this tool *to read passwords* is easy.

1. starting with `node app.js`
2. telling the Masterpasssword
3. choosing a password to be shown
4. thats it

you can also *write new ones or change old ones*

1. starting with ` node app.js -s `
2. typing the Masterpassword
3. than answering the questions in order (you have to know the exiting ones to overwrite them, should be fixed 😉)
   

## Using chalk

for colorizing output in console<br/>
[chalk on Github](https://github.com/chalk/chalk)

## Using Inquirer

for communication with users over console. Make it easier to write prompts and handle the response, build as async/await functions<br/>
[inquierer on Github](https://github.com/SBoudrias/Inquirer.js/)

## Using CryptoJS

for hashing masterpassword and de/encrypt data <br />
[CryptoJS on Github](https://github.com/brix/crypto-js)


## DISCLAIMER

Yes, the ~~db.json~~ and the ~~.masterpwd~~ are not belonging on github. Its just for learning purposes. It should be ignored with `.gitignore`.
(AlexisRoe@8673be9f35f2e0c94fa0c16bd020cbc8f05afd8e)

### db.json

````json
{
  "master": "",
  "public": 
  {
      "wifi": {
        "home": "U2FsdGVkX1+7hbj5RIah9LXes8cr48Cm8YrqIrPgMfE=",
        "work": "U2FsdGVkX1+7hbj5RIah9LXes8cr48Cm8YrqIrPgMfE=",
        "Tante": "U2FsdGVkX1+7hbj5RIah9LXes8cr48Cm8YrqIrPgMfE="
      },
      "homebanking": {
        "bank": "U2FsdGVkX1+7hbj5RIah9LXes8cr48Cm8YrqIrPgMfE=",
        "creditcard": "U2FsdGVkX1+7hbj5RIah9LXes8cr48Cm8YrqIrPgMfE="
      }
  }
}
````



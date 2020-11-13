require('dotenv').config();
const chalk = require('chalk');
const inquirer = require('inquirer');
const { find } = require('./database');
const { createPasswordList } = require('./createlists');

async function askUser(question) {
    const { answer } = await inquirer.prompt([
        {
            type: 'string',
            name: 'answer',
            message: chalk.yellow(question),
        },
    ]);

    return answer;
}

async function getUserChoice(listChoices, topic) {
    const choices = [];

    for (const key in listChoices) {
        choices.push(key);
    }

    const { choice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: chalk.yellow(`${topic} : Choose a property`),
            choices: choices,
        },
    ]);

    return choice;
}
async function showOptions(choices, prompt) {
   
    const { choice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: chalk.yellow(prompt),
            choices: choices,
        },
    ]);

    return choice;
}


async function askPassword () {

    const { pwdInput } = await inquirer.prompt([
        {
            type: 'password',
            name: 'pwdInput',
            message: chalk.yellow('Masterpassword?\n'),
            mask: true,
        },
    ]);

    return pwdInput
}

async function choosePassword(categories) {
    const choosenCategory = await showOptions(
        categories,
        `Choose a category from below for continuing`
    );

    const documents = await find(process.env.DB_COLLECTION, { category: choosenCategory });
    const choices = await createPasswordList(documents);
    const passwordID = await showOptions(choices, 'Choose a password.');

    return passwordID;
}

exports.choosePassword = choosePassword;
exports.askUser = askUser;
exports.getUserChoice = getUserChoice;
exports.askPassword = askPassword;
exports.showOptions = showOptions;

require('dotenv').config();
const chalk = require('chalk');
const inquirer = require('inquirer');

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

exports.askUser = askUser;
exports.askPassword = askPassword;
exports.showOptions = showOptions;

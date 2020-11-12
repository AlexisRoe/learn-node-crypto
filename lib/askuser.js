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
exports.getUserChoice = getUserChoice;
exports.askPassword = askPassword;

const chalk = require('chalk');
const inquirer = require('inquirer');

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

async function showPasswordSafe(safe) {

    let category = null;
    let password = null;

    try {
        category = await getUserChoice(safe, 'Category');
        password = await getUserChoice(safe[category], 'Passwords');
    } catch (err) {
        console.log(err);
        return;
    }

    console.log(chalk.green(`Your result:`));
    console.log(`name: ${category}\nkey: ${safe[category][password]}\n`);
}

exports.showPasswordSafe = showPasswordSafe;

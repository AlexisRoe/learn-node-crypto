const chalk = require('chalk');
const inquirer = require('inquirer');
const CryptoJS = require('crypto-js');

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

async function showPasswordSafe(safe, master) {
    let category = null;
    let password = null;

    try {
        category = await getUserChoice(safe, 'Category');
        password = await getUserChoice(safe[category], 'Passwords');
    } catch (err) {
        console.log(err);
        return;
    }

    const bytes = CryptoJS.AES.decrypt(`${safe[category][password]}`, master);
    const encryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    console.log(chalk.green(`Your result:`));
    console.log(`name: ${category}\nkey: ${encryptedPassword}\n`);
}

exports.showPasswordSafe = showPasswordSafe;

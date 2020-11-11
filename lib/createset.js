const chalk = require('chalk');
const inquirer = require('inquirer');
const CryptoJS = require('crypto-js');

async function createNewSet(safe, master) {
    const { category } = await inquirer.prompt([
        {
            type: 'string',
            name: 'category',
            message: chalk.yellow(`Storing data in which category?\n`),
        },
    ]);

    const { keyName } = await inquirer.prompt([
        {
            type: 'string',
            name: 'keyName',
            message: chalk.yellow(`What is the key/name to be stored?\n`),
        },
    ]);

    const { keyValue } = await inquirer.prompt([
        {
            type: 'string',
            name: 'keyValue',
            message: chalk.yellow(`What is the password to be stored?\n`),
        },
    ]);

    const encryptedValue = CryptoJS.AES.encrypt(keyValue, master).toString();

    const { public: data } = safe;

    if (!data[category]) {
        data[category] = {};
    }

    if (keyValue && category && keyName) {
        data[category][keyName] = encryptedValue;

        console.log(chalk.green(`given values set accepted`));
        return safe;
    }

    console.log(chalk.red('Something goes horrible wrong\n'));
}

exports.createNewSet = createNewSet;

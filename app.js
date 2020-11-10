const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');

async function validateAccess(master) {
    const { masterPwd } = await inquirer.prompt([
        {
            type: 'password',
            name: 'masterPwd',
            message: chalk.yellow('Masterpassword?\n'),
            mask: true,
        },
    ]);

    if (master !== masterPwd) {
        console.log(chalk.red(`Your Masterpassword is WRONG`));
        return false;
    }

    return true;
}

async function chooseCategory(safe) {
    const choices = [];

    for (const key in safe) {
        choices.push(key);
    }

    const { category } = await inquirer.prompt([
        {
            type: 'list',
            name: 'category',
            message: chalk.yellow('Choose a category'),
            choices: choices,
        },
    ]);

    return safe[category];
}

async function showPasswords(category) {
    const choices = [];

    category.forEach((element) => {
        choices.push(element.name);
    });

    const { key } = await inquirer.prompt([
        {
            type: 'list',
            name: 'key',
            message: chalk.yellow(`Choose a property`),
            choices: choices,
        },
    ]);

    const index = choices.findIndex((element) => element === key);

    console.log(chalk.green(`name: ${category[index].name}\nkey: ${category[index].key}`));
}


async function app() {
    console.log(`*** Password Manager 0.0.2 ***`);

    const master = '0000';

    try {
        if (await validateAccess(master)) {
            const pwd = await JSON.parse(fs.readFileSync('./db.json', 'utf8'));
            // await findPassword(3, public);
            const category = await chooseCategory(pwd);
            await showPasswords(category);
        }
    } catch (err) {
        console.log(err);
        return;
    }

    console.log(`*** Good Bye ****`);
    process.exit();
}


app();

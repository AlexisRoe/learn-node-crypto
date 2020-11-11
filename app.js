const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs').promises;

// entry control
async function isValidateAccess(master) {
    const { pwdInput } = await inquirer.prompt([
        {
            type: 'password',
            name: 'pwdInput',
            message: chalk.yellow('Masterpassword?\n'),
            mask: true,
        },
    ]);

    if (master !== pwdInput) {
        console.log(chalk.red(`Your Masterpassword is WRONG`));
        return false;
    }

    return true;
}

// show passwords in safe
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
    const category = await getUserChoice(safe, 'Category');
    const password = await getUserChoice(safe[category], 'Passwords');

    console.log(chalk.green(`Your result:`));
    console.log(`name: ${category}\nkey: ${safe[category][password]}\n`);
}

// Writing & Reading File Functions
async function getData() {
    const promise = await fs.readFile('./db.json', 'utf8');
    const data = JSON.parse(promise);
    return data;
}

async function setData(data) {
    const dataToSend = JSON.stringify(data, null, 2);
    await fs.writeFile('./db.json', dataToSend);
    return data;
}

// creating new key/ value pairs
async function setPwd(safe) {
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

    const { public: data } = safe;

    if (!data[category]) {
        data[category] = {};
    }

    if (keyValue && category && keyName) {
        data[category][keyName] = keyValue;

        await setData(safe);
        console.log(chalk.green(`given values set accepted`));
        return;
    }

    console.log(chalk.red('Something goes horrible wrong\n'));
}

// display existing key/ value pairs

async function getPwd(data) {
    try {
        const category = await chooseCategory(data);
        await showPasswords(category);
    } catch (err) {
        console.log(err);
        return;
    }

    return;
}

// ***********************
// the actual app.js ;-)
// ***********************

async function run() {
    console.log(`*** Password Manager 0.0.2 ***`);

    const args = process.argv.slice(2);
    const safe = await getData();
    const { master, public: data } = safe;

    if (await isValidateAccess(master)) {
        if (args[0] === 'set' || args[0] === '-s') {
            await setPwd(safe);
        } else if (args[0] === 'get' || args[0] === '-g') {
            // await getPwd(data);
        } else {
            // await getPwd(data);
            await showPasswordSafe(data);
        }
    }

    console.log(`*** Good Bye ****`);
    process.exit();
}

run();

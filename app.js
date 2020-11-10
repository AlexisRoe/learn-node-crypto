const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');

/*
 * old fashion inquirer version
 */

// inquirer.prompt(questions).then((answers) => {
//     if (answers.masterPwd === 'masterpwd') {
//         console.log(chalk.green(`Your Masterpassword is CORRECT`));
//         inquirer.prompt(pwdQuestion).then((answers) => {
//             if (pwdSafe[answers.pwdQuery]) {
//                 console.log(`Password found: ${pwdSafe[answers.pwdQuery]}`);
//             } else {
//                 console.log(chalk.yellow('Password not found.'));
//             }
//         });
//     } else {
//         console.log(chalk.red(`Your Masterpassword is WRONG`));
//         process.exit();
//     }
// });

/*
 * Promise in modern JS - await/async
 */

// reading arguments from console
// const args = process.argv.slice(2);

//  helper functions
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

// finding passwords with rounds
// async function findPassword(rounds, safe) {

//     if (rounds <= 0) {
//         return;
//     }

//     const { pwdQuery } = await inquirer.prompt([
//         {
//             type: 'string',
//             name: 'pwdQuery',
//             message: `What password are you looking for?\n>`,
//         },
//     ]);

//     if (!safe[pwdQuery]) {
//         console.log(chalk.yellow(`Password not found (${rounds - 1} tries left)`));
//         rounds--;
//         await findPassword(rounds, safe);
//         return;
//     }

//     console.log(chalk.green(`Password found: ${safe[pwdQuery]}`));
// }

// actual program code

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

// Lets GO
app();

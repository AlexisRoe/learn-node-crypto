const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');

// reading arguments from console
// const args = process.argv.slice(2);

// old fashion inquirer version
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
 * 4. Promise in modern JS - await/async
 */

//  helper functions
async function validateAccess(master) {
    const { masterPwd } = await inquirer.prompt([
        {
            type: 'password',
            name: 'masterPwd',
            message: '> Masterpassword?\n>',
            mask: true,
        },
    ]);

    if (master !== masterPwd) {
        console.log(chalk.red(`Your Masterpassword is WRONG`));
        return false;
    }

    return true;
}

async function findPassword(rounds, safe) {
    const { pwdQuery } = await inquirer.prompt([
        {
            type: 'string',
            name: 'pwdQuery',
            message: `What password are you looking for?\n>`,
        },
    ]);

    if (!safe[pwdQuery]) {
        console.log(chalk.yellow(`Password not found (${rounds - 1} tries left)`));
        rounds--;
        return rounds;
    }

    console.log(chalk.green(`Password found: ${safe[pwdQuery]}`));
}

// actual program code

async function app() {
    console.log(`*** Password Manager 0.0.2 ***`);

    try {
        const { master, public } = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
        if (await validateAccess(master)) {
            let rounds = 3;
            while (rounds > 0) {
                rounds = await findPassword(rounds, public);
            }
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

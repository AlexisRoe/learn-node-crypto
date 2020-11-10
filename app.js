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

// 4. Promise in modern JS - await/async

// data storage

const questions = [
    {
        type: 'password',
        name: 'masterPwd',
        message: '> Password\n>',
        mask: true,
    },
];

const pwdQuestion = [
    {
        type: 'string',
        name: 'pwdQuery',
        message: `Whats next, pussycat?\n>`,
    },
];


//  helper functions
async function validateAccess(master) {
    const { masterPwd } = await inquirer.prompt(questions);

    if (master !== masterPwd) {
        console.log(chalk.red(`Your Masterpassword is WRONG`));
        process.exit();
    }
}

async function findPassword(rounds, safe) {
    const { pwdQuery } = await inquirer.prompt(pwdQuestion);

    if (!safe[pwdQuery]) {
        console.log(chalk.yellow(`Password not found (${rounds - 1} tries left)`));
        rounds--;
        return rounds;
    }

    console.log(chalk.green(`Password found: ${safe[pwdQuery]}`));
    process.exit();
}

// actual program code

async function app() {
    console.log(`*** Password Manager 0.0.2 ***`);

    let pwdSafe = null;

    try {
        pwdSafe = JSON.parse(fs.readFileSync("./db.json", "utf8"))
    } catch (err) {
        console.log(err)
        return;
    }

    await validateAccess(pwdSafe.master);

    let rounds = 3;

    while (rounds > 0) {
        rounds = await findPassword(rounds, pwdSafe);
    }
}

app();

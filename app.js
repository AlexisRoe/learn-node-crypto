const inquirer = require('inquirer');
const chalk = require('chalk');

// reading arguments from console
const args = process.argv.slice(2);

// 1. standard node version
// interactive communication with commandline
// const readline = require("readline").createInterface({
//     input: process.stdin,
//     output: process.stdout
// })

// 2. inquirer version
console.log(`*** Password Manager 0.0.2 ***`);

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
        message: 'Whats next, pussycat?\n>',
    },
];

const pwdSafe = {
    wifi: '123456',
    puk: 'gambler',
    home: 'nextTime',
};

// 3. colorize output in console
inquirer.prompt(questions).then((answers) => {
    if (answers.masterPwd === 'Maximus') {
        console.log(chalk.green(`Your Masterpassword is CORRECT`));
        inquirer.prompt(pwdQuestion).then((answers) => {
            if (pwdSafe[answers.pwdQuery]) {
                console.log(`Password found: ${pwdSafe[answers.pwdQuery]}`);
            } else {
                console.log(chalk.yellow('Password not found.'));
            }
        });
    } else {
        console.log(chalk.red(`Your Masterpassword is WRONG`));
        process.exit();
    }
});

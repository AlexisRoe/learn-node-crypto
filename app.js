const inquirer = require('inquirer');
const chalk = require('chalk');

// reading arguments from console
const args = process.argv.slice(2);
// console.log(args);

// 1. standard node version
// interactive communication with commandline
// const readline = require("readline").createInterface({
//     input: process.stdin,
//     output: process.stdout
// })

// // Outputs the question and wait for the answer to display
// readline.question(`What´s your masterpassword\n> `, master => {
//     console.log(`Your Masterpassword is: ${master}`);
//     readline.close();
// })

// 2. inquirer version

if (args[0]) {
    console.log(`*** Password Manager ***\n *** Hello ${args[0]} ***`);
} else {
    console.log(`*** Password Manager ***\n *** Hello Stranger ***`)
}

const questions = [
    {
        type: 'password',
        name: 'masterPwd',
        message: 'Whats your Masterpassword?\n>',
    },
];

// 3. colorize output in console
inquirer.prompt(questions).then((answers) => {
    if (answers.masterPwd === 'Maximus') {
        console.log(chalk.green(`Your Masterpassword is CORRECT`));
    } else {
        console.log(chalk.red(`Your Masterpassword is WRONG`));
    }
});

const chalk = require('chalk');
const inquirer = require('inquirer');

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

exports.isValidateAccess = isValidateAccess;
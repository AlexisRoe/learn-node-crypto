const chalk = require('chalk');
const inquirer = require('inquirer');
var CryptoJS = require("crypto-js");

async function isValidateAccess(master) {
    const { pwdInput } = await inquirer.prompt([
        {
            type: 'password',
            name: 'pwdInput',
            message: chalk.yellow('Masterpassword?\n'),
            mask: true,
        },
    ]);

    const pwdHash = CryptoJS.MD5(pwdInput).toString(CryptoJS.enc.Base64);
    
    if (master !== pwdHash) {
        console.log(chalk.red(`Your Masterpassword is WRONG`));
        return false;
    }

    return true;
}

exports.isValidateAccess = isValidateAccess;
require('dotenv').config();
const chalk = require('chalk');
const { isValidateAccess } = require('./lib/validation');
const { passwordSafe } = require ("./components/OpenSafe");

async function run() {
    console.log(`*** Password Manager 0.0.2 ***`);

    if (await isValidateAccess(process.env.MASTER_PWD)) {
        await passwordSafe();
    } else {
        console.log(chalk.red(`Your Masterpassword is WRONG`));
    }

    console.log(`*** Good Bye ****`);
    process.exit();
}

run();

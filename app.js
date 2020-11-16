require('dotenv').config();
const chalk = require('chalk');
const { isValidateAccess } = require('./lib/validation');
const { passwordSafe } = require('./components/OpenSafe');
const { connect, close: closeConnection } = require('./lib/database');

async function run() {
    console.log(`*** Password Manager 0.0.2 ***`);

    if (await isValidateAccess(process.env.MASTER_PWD)) {
        console.log(chalk.grey('Connecting to database ...'));
        await connect(process.env.DB_URL, process.env.DB_NAME);
        await passwordSafe();
        closeConnection();
    } else {
        console.log(chalk.red(`Your Masterpassword is WRONG`));
    }

    console.log(`*** Good Bye ****`);
    process.exit();
}

run();

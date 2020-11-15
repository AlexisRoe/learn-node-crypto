require('dotenv').config();
const chalk = require('chalk');

const { askforPasswordtoChoose } = require('./components/passwords');
const { showCategories } = require('./components/category');
const { showMainMenu } = require('./components/mainmenu');
const { createPasswordList } = require('./lib/createlists');
const { isValidateAccess } = require('./lib/validation');
const { showOptions, askUser } = require('./lib/askuser');
const { encrypt, decryptPwd } = require('./lib/crypto');
const {
    connect,
    close: closeConnection,
    find,
    insertNewDocument,
    changeDocument,
    deleteDocument,
    aggregate,
} = require('./lib/database');

async function passwordSafe() {
    const instruction = await showMainMenu();

    if (instruction.exit) {
        return;
    }

    console.log(chalk.grey('Connecting to database ...'));
    await connect(process.env.DB_URL, process.env.DB_NAME);

    if (instruction.search) {
        // nothing here right now
        const query = '/wif/';
        const documents = await find(
            process.env.DB_COLLECTION,
            { name: { $regex: query, $option: 'ig' } },
        );
        console.log(documents);
    } else if (instruction.read) {
        const passwordID = await askforPasswordtoChoose('Choose a password to display');
        const queryPwd = [{ $match: { _id: passwordID } }, { $project: { category: false } }];
        const passwordDocument = await aggregate(process.env.DB_COLLECTION, queryPwd);
        console.log(
            chalk.green(`name: ${passwordDocument[0].name}\nkey: ${decryptPwd(
                passwordDocument[0].value,
                process.env.MASTER_PWD
            )}`)
        );
        
    } else if (instruction.write) {
        const passwordID = await askforPasswordtoChoose('Choose a password to change');
        const newPassword = await askUser(`Whats the new Password?\n`);
        const encryptedPassword = encrypt(newPassword, process.env.MASTER_PWD);
        await changeDocument(process.env.DB_COLLECTION, passwordID, encryptedPassword);
        console.log(chalk.green(`Password changed`));
    } else if (instruction.new) {
        const newDocument = {};
        newDocument.category = await showCategories(true);
        newDocument.name = await askUser(`What is the key/name to be stored?\n`);
        const rawValue = await askUser(`What is the password to be stored?\n`);
        newDocument.value = encrypt(rawValue, process.env.MASTER_PWD);
        await insertNewDocument(process.env.DB_COLLECTION, newDocument);
        console.log(chalk.green(`new Passwort successfully stored`));
    } else if (instruction.delete) {
        const passwordID = await askforPasswordtoChoose('Choose a password to delete');
        await deleteDocument(process.env.DB_COLLECTION, { _id: passwordID });
        console.log(chalk.green(`Password deleted`));
    }

    console.log(chalk.grey('Cut the database loose ...'));
    closeConnection();
    await passwordSafe();
}

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

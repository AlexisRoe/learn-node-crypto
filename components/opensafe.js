require('dotenv').config();
const chalk = require('chalk');
const { askforPasswordtoChoose } = require('./SelectPassword');
const { createSearchList } = require('../lib/createlists');
const { showCategories } = require('./Category');
const { showPassword } = require('./ShowPassword');
const { showMainMenu } = require('./MainMenu');
const { askUser, confirm, showOptions } = require('../lib/askuser');
const { encrypt } = require('../lib/crypto');
const {
    connect,
    close: closeConnection,
    find,
    insertNewDocument,
    changeDocument,
    deleteDocument,
} = require('../lib/database');

async function passwordSafe() {
    const instruction = await showMainMenu();

    if (instruction.exit) {
        return;
    }

    console.log(chalk.grey('Connecting to database ...'));
    await connect(process.env.DB_URL, process.env.DB_NAME);

    if (instruction.search) {
        const userSearch = await askUser(`What are you looking for?\n`);
        const regex = new RegExp(`.*${userSearch}.*`, 'ig');
        const query = { $or: [{ category: { $in: [regex] } }, { name: { $in: [regex] } }] };
        const documents = await find(process.env.DB_COLLECTION, query);
        const choices = createSearchList(documents);
        const passwordID = await showOptions(choices, `Choose a password from search results`);
        await showPassword(passwordID);
    } else if (instruction.read) {
        const passwordID = await askforPasswordtoChoose('Choose a password to display');
        await showPassword(passwordID);
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

    closeConnection();
    if (await confirm('Next...')) {
        await passwordSafe();
    }
}

exports.passwordSafe = passwordSafe;

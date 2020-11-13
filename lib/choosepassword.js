require('dotenv').config();
const { showOptions } = require('./lib/askuser');
const { find } = require('./lib/database');
const { createPasswordList } = require('./lib/createlist');

async function choosePassword(categories) {
    const choosenCategory = await showOptions(
        categories,
        `Choose a category from below for continuing`
    );

    const documents = await find(process.env.DB_COLLECTION, { category: choosenCategory });
    const choices = await createPasswordList(documents);
    const passwordID = await showOptions(choices, 'Choose a password.');

    return passwordID;
}

exports.choosePassword = choosePassword;

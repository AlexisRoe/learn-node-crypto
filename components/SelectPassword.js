const { showCategories } = require('./Category');
const { aggregate } = require('../lib/database');
const { createPasswordList } = require('../lib/createlists');
const { showOptions } = require('../lib/askuser');

async function askforPasswordtoChoose(prompt) {

    const category = await showCategories(false);
    const query = [
        {
            $match: {
                category,
            },
        },
        {
            $project: {
                value: false,
                category: false,
            },
        },
    ];
    const documents = await aggregate(process.env.DB_COLLECTION, query);
    const choices = await createPasswordList(documents);
    const passwordID = await showOptions(choices, prompt);

    return passwordID;
}

exports.askforPasswordtoChoose = askforPasswordtoChoose;

const { aggregate } = require('../lib/database');
const { showOptions, askUser } = require('../lib/askuser');

async function showCategories(isNew) {
    const query = [{ $group: { _id: '$category' } }];
    const existingCategories = await aggregate(process.env.DB_COLLECTION, query);
    const choices = existingCategories.map((document) => {
        return document._id;
    });

    if (isNew) {
        choices.push('+ New Category');
    }

    let category = await showOptions(choices, `Choose a category from below for continuing`);

    if (category === '+ New Category') {
        category = await askUser(`Whats the name of the new category?\n`);
    }

    return category;
}

exports.showCategories = showCategories;

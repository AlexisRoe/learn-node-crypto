require('dotenv').config();
const chalk = require('chalk');

const { isValidateAccess } = require('./lib/validateaccess');
const { validateParams } = require('./lib/validateparams');
const { createCategoryList } = require('./lib/createcategorylist');
const { createPasswordList } = require('./lib/createpasswordlist');
const { showOptions, askUser } = require('./lib/askuser');
const { encrypt, decryptPwd } = require('./lib/crypto');
const {
    connect,
    close: closeConnection,
    find,
    insertNewDocument,
    deleteDocument,
    changeDocument
} = require('./lib/database');

async function run() {
    console.log(`*** Password Manager 0.0.2 ***`);
    const master = process.env.MASTER_PWD;
    if (await isValidateAccess(master)) {
        console.log(chalk.grey('Connecting to database ...'));
        await connect(process.env.DB_URL, process.env.DB_NAME);

        let instructions = await validateParams(process.argv.slice(2));
        if (instructions.menu) {
            const menu = [
                {
                    name: 'read database',
                    value: ['-r'],
                },
                {
                    name: 'change entry',
                    value: ['-w'],
                },
                {
                    name: 'create new entry',
                    value: ['-n'],
                },
                {
                    name: 'delete entry',
                    value: ['-d'],
                },
            ];

            const choice = await showOptions(menu, 'Choose a operation');
            instructions = await validateParams(choice);
        }

        const existingCategories = await find(process.env.DB_COLLECTION, {
            category: { $exists: true },
        });
        const categories = createCategoryList(existingCategories);

        if (instructions.write) {
            const choosenCategory = await showOptions(
                categories,
                `Choose a category from below for continuing`
            );

            const documents = await find(process.env.DB_COLLECTION, { category: choosenCategory });
            const choices = await createPasswordList(documents);
            const passwordID = await showOptions(choices, 'Choose a password.');

            const newPassword = await askUser(`Whats the new Password?\n`);

            await changeDocument(process.env.DB_COLLECTION, passwordID, newPassword);
            console.log(chalk.green(`Password changed`));
            
        } else if (instructions.read) {
            const choosenCategory = await showOptions(
                categories,
                `Choose a category from below for continuing`
            );

            const documents = await find(process.env.DB_COLLECTION, { category: choosenCategory });
            const choices = await createPasswordList(documents);
            const passwordID = await showOptions(choices, 'Choose a password.');

            const passwordDocument = await find(process.env.DB_COLLECTION, {
                _id: passwordID,
            });

            console.log(
                `name: ${passwordDocument[0].name}\nkey: ${decryptPwd(
                    passwordDocument[0].value,
                    master
                )}\n`
            );
        } else if (instructions.new) {
            const expandCategories = [...categories, '+ New Category'];
            const choosenCategory = await showOptions(
                expandCategories,
                `Choose a category from below for continuing`
            );

            const newDocument = {
                category: choosenCategory,
            };

            if (choosenCategory === '+ New Category') {
                const newCategory = await askUser(`Whats the name of the new category?\n`);
                newDocument.category = newCategory;
            }

            newDocument.name = await askUser(`What is the key/name to be stored?\n`);
            const rawValue = await askUser(`What is the password to be stored?\n`);
            newDocument.value = encrypt(rawValue, master);

            await insertNewDocument(process.env.DB_COLLECTION, newDocument);
            console.log(chalk.green(`new Passwort successfully stored`));
        } else if (instructions.delete) {
            const choosenCategory = await showOptions(
                categories,
                `Choose a category from below for continuing`
            );

            const documents = await find(process.env.DB_COLLECTION, { category: choosenCategory });
            const choices = await createPasswordList(documents);
            const passwordID = await showOptions(choices, 'Choose a password.');

            await deleteDocument(process.env.DB_COLLECTION, { _id: passwordID });
            console.log(chalk.green(`Password deleted`));
        }
    } else {
        console.log(chalk.red(`Your Masterpassword is WRONG`));
    }

    console.log(`*** Good Bye ****`);
    closeConnection();
    process.exit();
}

run();

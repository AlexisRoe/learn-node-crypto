require('dotenv').config();
const chalk = require('chalk');

const { getData, setData, readMasterPwd } = require('./lib/filehandler');
const { isValidateAccess } = require('./lib/validateaccess');
const { showPasswordSafe } = require('./lib/showsafe');
const { createNewSet } = require('./lib/createset');
const { validateParams } = require('./lib/validateparams');
const { createCategoryList } = require('./lib/createcategorylist');
const { showOptions, askUser } = require('./lib/askuser');
const { connect, close: closeConnection, find, insertNewDocument } = require('./lib/database');

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
            console.log('changing data');
            // update it in database
            // const newSet = await createNewSet(safe, master);
            // await setData(file, newSet);
        } else if (instructions.read) {
            const choosenCategory = await showOptions(
                categories,
                `Choose a category from below for continuing`
            );

            const documents = await find(process.env.DB_COLLECTION, { category: choosenCategory});
            const choices = await createPasswordList(documents);
            const choosenPassword = await showOptions(passwords, "Choose a password.");

        } else if (instructions.new) {
            const expandCategories = [...categories, '+ New Category'];
            const choosenCategory = await showOptions(
                expandCategories,
                `Choose a category from below for continuing`
            );

            const newItem = {
                name: '',
                category: choosenCategory,
                value: '',
            };

            if (choosenCategory === '+ New Category') {
                const newCategory = await askUser(`Whats the name of the new category?\n`);
                newItem.category = newCategory;
            }

            newItem.name = await askUser(`What is the key/name to be stored?\n`);
            const rawValue = await askUser(`What is the password to be stored?\n`);
            newItem.value = encrypt(rawValue, master);

            await insertNewDocument(process.env.DB_COLLECTION, newItem);
            console.log(chalk.green(`new Passwort successfully stored`));

        } else if (instructions.delete) {
            const choosenCategory = await showOptions(
                categories,
                `Choose a category from below for continuing`
            );
            console.log('delete data');
            // take a choice of user
            // delete in database
        }
    } else {
        console.log(chalk.red(`Your Masterpassword is WRONG`));
    }

    console.log(`*** Good Bye ****`);
    closeConnection();
    process.exit();
}

run();

const { getData, setData, readMasterPwd } = require('./lib/filehandler');
const { isValidateAccess } = require('./lib/validateaccess');
const { showPasswordSafe } = require('./lib/showsafe');
const { createNewSet } = require('./lib/createset');
const { validateParams } = require('./lib/validateparams');
// const { createCategoryList } = require('./lib/createcategorylist');
const { showOptions } = require('./lib/askuser');
const { connect, close: closeConnection, collection } = require('./lib/database');

const chalk = require('chalk');
const { showCategories } = require('./lib/askuser');
require('dotenv').config();

async function run() {
    console.log(`*** Password Manager 0.0.2 ***`);
    const master = process.env.MASTER_PWD;

    if (await isValidateAccess(master)) {
        console.log(chalk.grey('Connecting to database ...'));
        await connect(process.env.DB_URL, 'learn-crypto');
        console.log(chalk.grey('Connected to database'));
        closeConnection();

        const file = './db.json';
        let instructions = await validateParams(process.argv.slice(2));

        const safe = await getData(file);
        const { public: data } = safe;

        if (instructions.menu) {
            const menu = 
            [
                {
                    name: "read database",
                    value: ["-r"]
                },
                {
                    name: "change entry",
                    value: ["-w"]
                },
                {
                    name: "create new entry",
                    value: ["-n"]
                },
                {
                    name: "delete entry",
                    value: ["-d"]
                },
            ]

            const choice = await showOptions(menu, "Choose a operation");
            instructions = await validateParams(choice);
            console.log(instructions);
            return ("finish here");
        }

        // read in all data from database

        // create category list
        // const choices = createCategoryList(collection);
        // show them to the users
        // const choiceUser = showOptions(choices, `Choose a category from below for continuing`);

        if (instructions.write) {
            // update it in database
            const newSet = await createNewSet(safe, master);
            await setData(file, newSet);
        } else if (instructions.read) {
            await showPasswordSafe(data, master);
        } else if (instructions.new) {
            // add +new category to available category list
            // ask for all name and value
            // write it to database
        } else if (instructions.delete) {
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

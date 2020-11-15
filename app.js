require('dotenv').config();
const chalk = require('chalk');

const { showCategories } = require('./components/category');
const { showMainMenu } = require('./components/mainmenu');

const { isValidateAccess } = require('./lib/validation');
const { showOptions, askUser, choosePassword } = require('./lib/askuser');
const { encrypt, decryptPwd } = require('./lib/crypto');
const {
    connect,
    close: closeConnection,
    find,
    insertNewDocument,
    changeDocument,
    deleteDocument,
} = require('./lib/database');

// async function old() {

//         const existingCategories = await find(process.env.DB_COLLECTION, {
//             category: { $exists: true },
//         });
//         const categories = createCategoryList(existingCategories);

//         if (instructions.write) {
//             const passwordID = await choosePassword(categories);
//             const newPassword = await askUser(`Whats the new Password?\n`);
//             const encryptedPassword = encrypt(newPassword, master);
//             await changeDocument(process.env.DB_COLLECTION, passwordID, encryptedPassword);

//             console.log(chalk.green(`Password changed`));
//         } else if (instructions.read) {
//             const passwordID = await choosePassword(categories);
//             const passwordDocument = await find(process.env.DB_COLLECTION, {
//                 _id: passwordID,
//             });

//             console.log(
//                 `name: ${passwordDocument[0].name}\nkey: ${decryptPwd(
//                     passwordDocument[0].value,
//                     master
//                 )}\n`
//             );
//         } else if (instructions.new) {
//             const expandCategories = [...categories, '+ New Category'];
//             const choosenCategory = await showOptions(
//                 expandCategories,
//                 `Choose a category from below for continuing`
//             );

//             const newDocument = {
//                 category: choosenCategory,
//             };

//             if (choosenCategory === '+ New Category') {
//                 const newCategory = await askUser(`Whats the name of the new category?\n`);
//                 newDocument.category = newCategory;
//             }

//             newDocument.name = await askUser(`What is the key/name to be stored?\n`);
//             const rawValue = await askUser(`What is the password to be stored?\n`);
//             newDocument.value = encrypt(rawValue, master);

//             await insertNewDocument(process.env.DB_COLLECTION, newDocument);
//             console.log(chalk.green(`new Passwort successfully stored`));
//         } else if (instructions.delete) {
//             const passwordID = await choosePassword(categories);
//             await deleteDocument(process.env.DB_COLLECTION, { _id: passwordID });
//             console.log(chalk.green(`Password deleted`));
//         }
//     } else {
//         console.log(chalk.red(`Your Masterpassword is WRONG`));
//     }

//     console.log(`*** Good Bye ****`);
//     closeConnection();
//     process.exit();
// }

async function passwordSafe() {
    const instruction = await showMainMenu();

    if (instruction.exit) {
        return;
    } 

    console.log(chalk.grey('Connecting to database ...'));
    await connect(process.env.DB_URL, process.env.DB_NAME);

    if (instruction.search) {
        // nothing here right now
    } else if (instruction.read) {
        const category = await showCategories(false);
        console.log(category);
    } else if (instruction.write) {
        const category = await showCategories(false);
    } else if (instruction.new) {
        const category = await showCategories(true);
    } else if (instruction.delete) {
        const category = await showCategories(false);
    }

    console.log(chalk.grey('Cut the database loose ...'));
    closeConnection();
    passwordSafe();

}

async function run() {
    console.log(`*** Password Manager 0.0.2 ***`);
    const master = process.env.MASTER_PWD;
    if (await isValidateAccess(master)) {
        await passwordSafe();
    } else {
        console.log(chalk.red(`Your Masterpassword is WRONG`));
    }

    console.log(`*** Good Bye ****`);
    process.exit();
}

run();

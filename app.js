const inquirer = require('inquirer');
const chalk = require('chalk');

const { getData, setData } = require("./lib/filehandler");
const { isValidateAccess } = require("./lib/validateaccess");
const { showPasswordSafe } = require("./lib/showsafe");
const { createNewSet } = require("./lib/createset");


async function run() {
    console.log(`*** Password Manager 0.0.2 ***`);

    const args = process.argv.slice(2);
    const safe = await getData();
    const { master, public: data } = safe;

    if (await isValidateAccess(master)) {
        if (args[0] === 'set' || args[0] === '-s') {
            const newSet = await createNewSet(safe);
            await setData(newSet);
        } else if (args[0] === 'get' || args[0] === '-g') {
            await showPasswordSafe(data);
        } else {
            await showPasswordSafe(data);
        }
    }

    console.log(`*** Good Bye ****`);
    process.exit();
}

run();

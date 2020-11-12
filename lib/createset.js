const chalk = require('chalk');
const { encrypt } = require('./crypto');
const { askUser } = require('./askuser');

async function createNewSet(safe, master) {
    const category = await askUser(`Storing data in which category?\n`);
    const keyName = await askUser(`What is the key/name to be stored?\n`);
    const keyValue = await askUser(`What is the password to be stored?\n`);

    const encryptedValue = encrypt(keyValue, master);

    const { public: data } = safe;

    if (!data[category]) {
        data[category] = {};
    }

    if (keyValue && category && keyName) {
        data[category][keyName] = encryptedValue;

        console.log(chalk.green(`given values set accepted`));
        return safe;
    }

    console.log(chalk.red('Something goes horrible wrong\n'));
}

exports.createNewSet = createNewSet;

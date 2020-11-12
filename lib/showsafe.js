const chalk = require('chalk');
const { decryptPwd } = require('./crypto');
const { getUserChoice } = require('./askuser');

async function showPasswordSafe(safe, master) {
    let category = null;
    let password = null;

    try {
        category = await getUserChoice(safe, 'Category');
        password = await getUserChoice(safe[category], 'Passwords');
    } catch (err) {
        console.log(err);
        return;
    }

    const pwd = safe[category][password];

    console.log(chalk.green(`Your result:`));
    console.log(`name: ${category}\nkey: ${decryptPwd(pwd, master)}\n`);
}

exports.showPasswordSafe = showPasswordSafe;

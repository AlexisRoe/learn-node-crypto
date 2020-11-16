const chalk = require('chalk');
const { decryptPwd } = require('../lib/crypto');
const { aggregate } = require('../lib/database');

async function showPassword(passwordID) {
    const queryPwd = [{ $match: { _id: passwordID } }, { $project: { category: false, _id: false } }];
    const passwordDocument = await aggregate(process.env.DB_COLLECTION, queryPwd);
    console.log(
        chalk.green(
            `name: ${passwordDocument[0].name}\nkey: ${decryptPwd(
                passwordDocument[0].value,
                process.env.MASTER_PWD
            )}`
        )
    );
}

exports.showPassword = showPassword;

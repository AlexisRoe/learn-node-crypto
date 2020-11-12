const { getData, setData, readMasterPwd } = require('./lib/filehandler');
const { isValidateAccess } = require('./lib/validateaccess');
const { showPasswordSafe } = require('./lib/showsafe');
const { createNewSet } = require('./lib/createset');
const { validateParams } = require('./lib/validateparams');

// MongoDB
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

async function run() {
    // Connection URL
    const url =
        'mongodb+srv://alexis:$FQYi8E2EKNiznjJr@cluster0.nqjuk.mongodb.net/learn-crypto?retryWrites=true';

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        client.close();
    });

    // my app until 15:30 ;-)
    console.log(`*** Password Manager 0.0.2 ***`);

    const file = './db.json';
    const instructions = await validateParams(process.argv);

    const master = await readMasterPwd();

    if (await isValidateAccess(master)) {
        const safe = await getData(file);
        const { public: data } = safe;

        if (instructions.write) {
            const newSet = await createNewSet(safe, master);
            await setData(file, newSet);
        } else if (instructions.readonly) {
            await showPasswordSafe(data, master);
        }
    } else {
        console.log(chalk.red(`Your Masterpassword is WRONG`));
    }

    console.log(`*** Good Bye ****`);
    process.exit();
}

run();

const { getData, setData } = require('./lib/filehandler');
const { isValidateAccess } = require('./lib/validateaccess');
const { showPasswordSafe } = require('./lib/showsafe');
const { createNewSet } = require('./lib/createset');
const { validateParams } = require('./lib/validateparams');

async function run() {
    console.log(`*** Password Manager 0.0.2 ***`);

    const file = './db.json';
    const instructions = await validateParams(process.argv);

    const safe = await getData(file);
    const { master, public: data } = safe;

    if (await isValidateAccess(master)) {
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

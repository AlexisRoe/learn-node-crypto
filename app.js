const { getData, setData, readMasterPwd } = require('./lib/filehandler');
const { isValidateAccess } = require('./lib/validateaccess');
const { showPasswordSafe } = require('./lib/showsafe');
const { createNewSet } = require('./lib/createset');
const { validateParams } = require('./lib/validateparams');
const chalk = require('chalk');
require('dotenv').config()

// MongoDB
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = process.env.DB_URL

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    const db = client.db('test');

    // insert data into database

    // db.collection('inventory')
    //     .insertOne({
    //         item: 'canvas',
    //         qty: 100,
    //         tags: ['cotton'],
    //         size: { h: 28, w: 35.5, uom: 'cm' },
    //     })
    //     .then(function (result) {
    //         // console.log(result);
    //     });

    // read all data from database

    // var cursor = db.collection('inventory').find({});
    // function iterateFunc(doc) {
    //     console.log(JSON.stringify(doc, null, 4));
    //  }
    //  function errorFunc(error) {
    //     console.log(error);
    //  }
    //  cursor.forEach(iterateFunc, errorFunc);

    // insert more data at once

    // db.collection('inventory').insertMany([
    //     { item: "journal",
    //       qty: 25,
    //       size: { h: 14, w: 21, uom: "cm" },
    //       status: "A"},
    //     { item: "notebook",
    //       qty: 50,
    //       size: { h: 8.5, w: 11, uom: "in" },
    //       status: "A"},
    //     { item: "paper",
    //       qty: 100,
    //       size: { h: 8.5, w: 11, uom: "in" },
    //       status: "D"},
    //     { item: "planner",
    //       qty: 75, size: { h: 22.85, w: 30, uom: "cm" },
    //       status: "D"},
    //     { item: "postcard",
    //       qty: 45,
    //       size: { h: 10, w: 15.25, uom: "cm" },
    //       status: "A"}
    //   ])
    //   .then(function(result) {
    //     // process result
    //   })

    const cursor = db.collection('inventory').find({ size: { h: 14, w: 21, uom: 'cm' } });

    function iterateFunc(doc) {
        console.log(JSON.stringify(doc, null, 4));
    }

    function errorFunc(error) {
        console.log(error);
    }

    cursor.forEach(iterateFunc, errorFunc);

    client.close();
});

async function run() {
    console.log(`*** Password Manager 0.0.2 ***`);

    const file = './db.json';
    const instructions = await validateParams(process.argv);

    const master = process.env.MASTER_PWD

    if (await isValidateAccess(master)) {
        const safe = await getData(file);
        const { public: data } = safe;

        if (instructions.menu) {
            // show menu and rewrite instructions object
        }

        // read in all data from database

        // create category list

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
    process.exit();
}

console.log(chalk.red('Neeee die App läuft gerade nicht, 😋'));
// run();

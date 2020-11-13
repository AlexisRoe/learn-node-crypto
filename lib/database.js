const { MongoClient } = require('mongodb');

let client;
let db;

async function connect(url, dbName) {
    client = await MongoClient.connect(url, { useUnifiedTopology: true });
    db = client.db(dbName);
}

function close() {
    return client.close();
}

function collection(name) {
    return db.collection(name);
}

async function find(name, query) {
    try {
        const results = await db.collection(name).find(query);
        const documents = []
        await results.forEach((doc) => {
            documents.push(doc);
        })
        return documents;
    } catch (err) {
        console.log(err);
        return;
    }
}

async function insertNewDocument (name, document) {
    try {
        await db.collection(name).insertOne(document);
    } catch (err) {
        console.log(err);
        return;
    }
}

exports.connect = connect;
exports.close = close;
exports.collection = collection;
exports.find = find;
exports.insertNewDocument = insertNewDocument;

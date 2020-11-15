const { MongoClient } = require('mongodb');

let client;
let db;

async function connect(url, dbName) {
    client = await MongoClient.connect(url, { useUnifiedTopology: true });
    db = client.db(dbName);
}

async function find(name, query) {
    try {
        const results = await db.collection(name).find(query);
        const documents = [];
        await results.forEach((doc) => {
            documents.push(doc);
        });
        return documents;
    } catch (err) {
        console.log(err);
        return;
    }
}

async function insertNewDocument(name, document) {
    try {
        await db.collection(name).insertOne(document);
    } catch (err) {
        console.log(err);
        return;
    }
}

async function deleteDocument(name, id) {
    try {
        await db.collection(name).deleteOne(id);
    } catch (err) {
        console.log(err);
        return;
    }
}

async function changeDocument(name, passwordID, newValue) {
    try {
        await db.collection(name).updateOne({ _id: passwordID }, { $set: { value: newValue } });
    } catch (err) {
        console.log(err);
        return;
    }
}

async function aggregate(name, query) {
    try {
        const results = await db.collection(name).aggregate(query);
        const documents = [];
        await results.forEach((doc) => {
            documents.push(doc);
        });
        return documents;
    } catch (err) {
        console.log(err);
        return;
    }
}

function close() {
    return client.close();
}

exports.connect = connect;
exports.close = close;
exports.find = find;
exports.insertNewDocument = insertNewDocument;
exports.deleteDocument = deleteDocument;
exports.changeDocument = changeDocument;
exports.aggregate = aggregate;

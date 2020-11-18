require('dotenv').config();
const { ObjectID } = require('mongodb');
const express = require('express');

const {
    connect,
    find,
    aggregate,
    insertNewDocument,
    changeDocument,
    deleteDocument,
} = require('./api/database');
const { encrypt, decryptPwd } = require('./lib/crypto');
const { createPasswordList } = require('./lib/createlists');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', async (request, response) => {
    response.send('Hello World!');
});

app.get('/password/:userquery', async (request, response) => {
    const { userquery } = request.params;
    const regex = new RegExp(`.*${userquery}.*`, 'ig');
    const query = { $or: [{ category: { $in: [regex] } }, { name: { $in: [regex] } }] };

    try {
        const documents = await find(process.env.DB_COLLECTION, query);
        if (!documents) {
            response.status(404).send('Could not specific password.');
            return;
        }
        response.send(documents);
    } catch (err) {
        console.log(err);
        response.status(500).send('An internal server error occured.');
    }
});

app.get('/password/id/:id', async (request, response) => {
    const { id } = request.params;
    const passwordID = new ObjectID.createFromHexString(id);
    const queryPwd = [
        { $match: { _id: passwordID } },
        { $project: { category: false, _id: false } },
    ];

    try {
        const passwordDocument = await aggregate(process.env.DB_COLLECTION, queryPwd);
        if (!passwordDocument) {
            response.status(404).send('Could not specific password.');
            return;
        }
        // tech demo
        // const name = passwordDocument[0].name;
        // const value = decryptPwd(passwordDocument[0].value,process.env.MASTER_PWD);
        // const encryptedDocument = {
        //     name,
        //     value,
        // };
        response.send(encryptedDocument);
    } catch (err) {
        console.log(err);
        response.status(500).send('An internal server error occured.');
    }
});

app.get('/categories', async (request, response) => {
    const query = [{ $group: { _id: '$category' } }];

    try {
        const objectCategories = await aggregate(process.env.DB_COLLECTION, query);
        if (!objectCategories) {
            response.status(404).send('Could not find categories.');
            return;
        }
        const categories = objectCategories.map((document) => {
            return document._id;
        });
        response.send(categories);
    } catch (err) {
        console.log(err);
        response.status(500).send('An internal server error occured.');
    }
});

app.get('/categories/:category', async (request, response) => {
    const { category } = request.params;
    const query = [
        { $match: { category } },
        {
            $project: {
                value: false,
                category: false,
            },
        },
    ];

    try {
        const documents = await aggregate(process.env.DB_COLLECTION, query);
        if (!documents) {
            response.status(404).send(`Could not find passwords in category ${category}`);
            return;
        }
        const choices = await createPasswordList(documents);
        response.send(choices);
    } catch (err) {
        console.log(err);
        response.status(500).send('An internal server error occured.');
    }
});

app.post('/password/', async function (request, response) {
    const password = request.body;

    const newDocument = {};
    newDocument.category = password.category;
    newDocument.name = password.name;
    const rawValue = password.value;
    newDocument.value = encrypt(rawValue, process.env.MASTER_PWD);

    try {
        await insertNewDocument(process.env.DB_COLLECTION, newDocument);
        response.send('Got a POST request');
    } catch (err) {
        console.log(err);
        response.status(500).send('An internal server error occured.');
    }
});

app.put('/password/', async function (request, response) {
    const passwordID = request.query.id;
    const encryptedPassword = encrypt(request.query.password, process.env.MASTER_PWD);

    try {
        const result = await changeDocument(
            process.env.DB_COLLECTION,
            passwordID,
            encryptedPassword
        );
        if (result.modifiedCount === 0) {
            return response.status(404).send('Couldn´t modify password.');
        }
        response.send('Password changed');
    } catch (err) {
        console.log(err);
        response.status(500).send('An internal server error occured.');
    }
});

app.delete('/password/:id', async (request, response) => {
    const { id } = request.params;
    const objectID = new ObjectID.createFromHexString(id);

    try {
        const result = await deleteDocument(process.env.DB_COLLECTION, objectID);
        if (result.deletedCount === 0) {
            return response.status(404).send('Password to delete not found');
        }
        response.send('Password deleted');
    } catch (err) {
        console.log(err);
        response.status(500).send('An internal server error occured.');
    }
});

async function run() {
    console.log('Connecting to database ...');
    await connect(process.env.DB_URL, process.env.DB_NAME);
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}

run();

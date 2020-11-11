const fs = require('fs').promises;

async function getData() {
    const promise = await fs.readFile('./db.json', 'utf8');
    const data = JSON.parse(promise);
    return data;
}

async function setData(data) {
    const dataToSend = JSON.stringify(data, null, 2);
    await fs.writeFile('./db.json', dataToSend);
    return data;
}

exports.getData = getData;
exports.setData = setData;
const fs = require('fs').promises;

async function getData(file) {
    const promise = await fs.readFile(file, 'utf8');
    const data = JSON.parse(promise);
    return data;
}

async function setData(file, data) {
    const dataToSend = JSON.stringify(data, null, 2);
    await fs.writeFile(file, dataToSend);
    return data;
}

async function readMasterPwd() {
    const master = await fs.readFile('./.masterpwd', 'utf8');
    return master;
}

exports.getData = getData;
exports.setData = setData;
exports.readMasterPwd = readMasterPwd;

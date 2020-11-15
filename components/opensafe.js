require('dotenv').config();
const chalk = require('chalk');
const { askforPasswordtoChoose } = require('./passwords');
const { showCategories } = require('./category');
const { showMainMenu } = require('./mainmenu');
const { isValidateAccess } = require('../lib/validation');
const { askUser, confirm } = require('../lib/askuser');
const { encrypt, decryptPwd } = require('../lib/crypto');
const {
    connect,
    close: closeConnection,
    find,
    insertNewDocument,
    changeDocument,
    deleteDocument,
    aggregate,
} = require('../lib/database');

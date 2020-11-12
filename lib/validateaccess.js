const { hash } = require('./crypto');
const { askPassword } = require('./askuser');

async function isValidateAccess(master) {
    const pwdInput = await askPassword();
    return master === hash(pwdInput);
}

exports.isValidateAccess = isValidateAccess;

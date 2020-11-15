const { hash } = require('./crypto');
const { askPassword } = require('./askuser');

async function validateParams(args) {
    const instructions = {
        menu: true,
        write: false,
        read: false,
        new: false,
        delete: false,
    };

    if (!args[0]) {
        return instructions;
    }

    if (args[0] === '-w') {
        instructions.write = true;
    }
    if (args[0] === '-r') {
        instructions.read = true;
    }
    if (args[0] === '-n') {
        instructions.new = true;
    }
    if (args[0] === '-d') {
        instructions.delete = true;
    }

    instructions.menu = false;
    return instructions;
}

async function isValidateAccess(master) {
    const pwdInput = await askPassword();
    return master === hash(pwdInput);
}

exports.isValidateAccess = isValidateAccess;
exports.validateParams = validateParams;

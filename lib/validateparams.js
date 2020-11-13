async function validateParams(params) {
    const args = params.slice(2);

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

exports.validateParams = validateParams;

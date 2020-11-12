async function validateParams(params) {
    const args = params.slice(2);

    const instructions = {
        readonly: true,
        write: false,
        category: '',
        key: '',
        value: '',
    };

    const flagWrite = (element) => element === '-s';
    const flagCategory = (element) => element === '-c';
    const flagKey = (element) => element === '-k';
    const flagValue = (element) => element === '-v';

    if (!args[0]) {
        return instructions;
    }

    if (args.findIndex(flagWrite) !== -1) {
        instructions.write = true;
    }
    if (args.findIndex(flagCategory) !== -1) {
        instructions.category = args[args.findIndex(flagCategory) + 1];
    }
    if (args.findIndex(flagKey) !== -1) {
        instructions.key = args[args.findIndex(flagKey) + 1];
    }
    if (args.findIndex(flagValue) !== -1) {
        instructions.value = args[args.findIndex(flagValue) + 1];
    }

    return instructions;
}

exports.validateParams = validateParams;

const chalk = require('chalk');
const inquirer = require('inquirer');

const choices = [
    {
        name: 'search for password',
        value: ['-s'],
    },
    {
        name: 'read database',
        value: ['-r'],
    },
    {
        name: 'change entry',
        value: ['-w'],
    },
    {
        name: 'create new entry',
        value: ['-n'],
    },
    {
        name: 'delete entry',
        value: ['-d'],
    },
    {
        name: 'EXIT\n',
        value: ['-x'],
    },
];

async function showMainMenu() {
    const { choice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: chalk.yellow('Main Menu'),
            choices: choices,
        },
    ]);

    const instruction = {};

    if (choice[0] === '-s') {
        instruction.search = true;
    }
    if (choice[0] === '-w') {
        instruction.write = true;
    }
    if (choice[0] === '-r') {
        instruction.read = true;
    }
    if (choice[0] === '-n') {
        instruction.new = true;
    }
    if (choice[0] === '-d') {
        instruction.delete = true;
    }
    if (choice[0] === '-x') {
        instruction.exit = true;
    }

    return instruction;
}

exports.showMainMenu = showMainMenu;

function createPasswordList(documents) {
    const choices = documents.map((document) => {
        return {
            name: document.name,
            value: document._id,
        };
    });
    return choices;
}

exports.createPasswordList = createPasswordList;

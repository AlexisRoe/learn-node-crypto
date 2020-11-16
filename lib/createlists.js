function createPasswordList(documents) {
    const choices = documents.map((document) => {
        return {
            name: document.name,
            value: document._id,
        };
    });
    return choices;
}

function createSearchList(documents) {
    const choices = documents.map((document) => {
        return {
            name: `name: ${document.name}\ncategory: ${document.category}`,
            value: document._id,
        };
    });
    return choices;
}

exports.createPasswordList = createPasswordList;
exports.createSearchList = createSearchList;

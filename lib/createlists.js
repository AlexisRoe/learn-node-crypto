function createCategoryList(collection) {
    const categorieChoices = collection.map((document) => {
        return document.category;
    });

    const filteredCategoryChoices = categorieChoices.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
    });

    return filteredCategoryChoices;
}

function createPasswordList(documents) {
    const choices = documents.map((document) => {
        return { 
            name: document.name,
            value: document._id
        };
    });
    return choices;
}

exports.createPasswordList = createPasswordList;
exports.createCategoryList = createCategoryList;
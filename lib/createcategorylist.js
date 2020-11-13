function createCategoryList(collection) {
    const categorieChoices = collection.map((document) => {
        return document.category;
    });

    const filteredCategoryChoices = categorieChoices.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
    });

    return filteredCategoryChoices;
}

exports.createCategoryList = createCategoryList;

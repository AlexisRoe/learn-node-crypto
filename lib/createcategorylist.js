function createCategoryList(collection) {
 
    const categorieChoices = collection.map((document) => {
        const choice = 
        {
            name: document.category,
            value: document._id
        }
        return choice;
    })

    const filteredCategoryChoices = categorieChoices.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
    });

    return filteredCategoryChoices;
}

exports.createCategoryList = createCategoryList;

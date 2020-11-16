const prefix = '[YNAB Percentage web extension]';
const mainCategorySelector = '.is-master-category .budget-table-cell-budgeted .user-data.currency';

const getNumberValue = function (value) {
    const numberFormat = window.ynab.YNABSharedLib.currencyFormatter.getCurrency().example_format;
    console.debug(`${prefix} Selected number format is '${numberFormat}'`);

    if (numberFormat === '123 456.789') {
        console.log({ number: value, numberFormat });
        return Number(value.replace(/[^0-9,\.]/g, ''));
    }

    return null;

    // TODO Handle others formats
}

const updateCategoriesPercentage = function (nodeCategories) {
    const categories = Array.prototype.slice.call(nodeCategories);
    let total = 0;
    categories.forEach(mainCategory => {
        const value = getNumberValue(mainCategory.textContent, numberFormat);
        console.log(value);
        total += value;
    })

    console.debug(`[YNAB Percentage web extension] Total budgeted for this month : ${total}`);

    categories.forEach(mainCategory => {
        console.log(mainCategory);
        const value = getNumberValue(mainCategory.textContent, numberFormat);
        const percentage = Math.round((((value / total) * 100) + Number.EPSILON) * 100) / 100;
        console.log(`${mainCategory.innerHTML} (${percentage}%)`);
        mainCategory.innerHTML = `${mainCategory.innerHTML} (${percentage}%)`;
    })
}

console.debug(`${prefix} Loaded`);
const initialCategories = document.querySelectorAll(mainCategorySelector);

const observer = new MutationObserver(function (mutations, me) {
    const categories = document.querySelectorAll(mainCategorySelector);
    if (categories && categories.length > 0) {
        updateCategoriesPercentage(categories);
        me.disconnect();
        return;
    }
});

if (initialCategories && initialCategories.length > 0) {
    console.debug(`${prefix} Run from initial categories`);
    updateCategoriesPercentage(initialCategories);
} else {
    console.debug(`${prefix} Run from mutation observer`);
    observer.observe(document, {
        childList: true,
        subtree: true
    });
}



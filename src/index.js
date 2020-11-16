function onError(error) {
    console.error(`Error: ${error}`);
}

function getNumberValue(value, format) {
    if (format === '123 456.789') {
        console.log({number: value, format});
        return Number(value.replace(/[^0-9,\.]/g, ''));
    }

    // TODO Handle others formats
}

function onGot(item) {
    if (!item.numberFormat) {
        console.error('[YNAB Percentage web extension] Define configuration first !');
        return;
    }

    const numberFormat = item.numberFormat;;
    let total = 0;
    const mainCategorySelector = '.is-master-category .budget-table-cell-budgeted .user-data.currency';

    document.querySelectorAll(mainCategorySelector).forEach(mainCategory => {
        const value = getNumberValue(mainCategory.innerHTML, numberFormat);
        total += value;
    })

    console.debug(`[YNAB Percentage web extension] Total budgeted for this month : ${total}`);

    document.querySelectorAll(mainCategorySelector).forEach(mainCategory => {
        const value = getNumberValue(mainCategory.innerHTML, numberFormat);
        const percentage = Math.round((((value / total) * 100) + Number.EPSILON) * 100) / 100;
        mainCategory.textContent = `${mainCategory.innerHTML} (${percentage}%)`;
    })

}

browser.storage.sync.get("numberFormat").then(onGot, onError);

const mainCategorySelector = '.is-master-category .budget-table-cell-budgeted .user-data.currency';

const log = {
    _prefix: '[YNAB Percentage web extension]',
    debug: (args) => {
        console.debug(`${log._prefix} ${args}`);
    },
    log: (args) => {
        console.log(`${log._prefix} ${args}`)
    },
    error: (args) => {
        console.log('lol');
        console.error(`${log._prefix} ${args}`)
    },
    warn: (args) => {
        console.warn(`${log._prefix} ${args}`)
    },
}

/**
 * TODO Pass numberFormat and handle specials format
 * @param {string} value
 */
const getNumberValue = (value) => {
    const numberFormat = '123 456.789';

    if (numberFormat === '123 456.789') {
        return Number(value.replace(/[^0-9,\.]/g, ''));
    }

    log.warn(`Number format '${numberFormat}' is not supported yet.`);
    return 0;
    // TODO Handle others formats
}

const updateCategoriesPercentage = (nodeCategories) => {
    const categories = Array.prototype.slice.call(nodeCategories);
    let total = 0;
    categories.forEach(mainCategory => {
        const value = mainCategory.textContent;
        if (!value.match(/^.*%\).*$/)) {
            total += getNumberValue(mainCategory.textContent);
        }
    })

    log.debug(`Total budgeted for this month : ${total}`);

    categories.forEach(mainCategory => {
        if (!mainCategory.textContent.match(/^.*%\).*$/)) {
            const value = getNumberValue(mainCategory.textContent);
            const percentage = Math.round((((value / total) * 100) + Number.EPSILON) * 100) / 100;

            const parser = new DOMParser();
            const parsed = parser.parseFromString(`${mainCategory.innerHTML} (${percentage}%)`, `text/html`);
            const parts = parsed.getElementsByTagName(`body`);
            mainCategory.innerHTML = ``;
            for (const part of parts) {
                mainCategory.appendChild(part)
            }
        }
    })
}

const main = () => {
    log.debug(`Loaded`);
    const initialCategories = document.querySelectorAll(mainCategorySelector);

    const observer = new MutationObserver(function (mutations, me) {
        const categories = document.querySelectorAll(mainCategorySelector);
        if (categories && categories.length > 0) {
            updateCategoriesPercentage(categories);
            return;
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });

    if (initialCategories && initialCategories.length > 0) {
        log.debug(`Loaded : Run from initial categories`);
        updateCategoriesPercentage(initialCategories);
    }
}

main();

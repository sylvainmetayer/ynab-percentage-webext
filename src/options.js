function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        numberFormat: document.querySelector("#numberFormat").value
    });
}

function restoreOptions() {

    function setCurrentChoice(result) {
        document.querySelector("#numberFormat").value = result.numberFormat || "blue";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    browser.storage.sync.get("numberFormat").then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

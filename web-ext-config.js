module.exports = {
    ignoreFiles: [
        'package-lock.json'
    ],
    verbose: false,
    build: {
        overwriteDest: true,
    },
    run: {
        startUrl: [
            'https://app.youneedabudget.com/users/authentication'
        ]
    }
};

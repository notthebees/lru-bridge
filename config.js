const Airtable = require('airtable');

const gocardlessApiKey = process.env.GOCARDLESS_API_KEY;

const config = {
    airtable: {
        base: new Airtable({apiKey: 'keyZ0TTQdstBfuP3H'}).base('appT1QHGIE3H9c5Dn')
    },
    gocardless: {
        baseUrl:
            process.env.NODE_ENV === "development"
                ? "https://api-sandbox.gocardless.com"
                : "https://api.gocardless.com",
        requestHeaders: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + gocardlessApiKey,
            'GoCardless-Version': '2015-07-06'
        },
        webhookSecret: process.env.NODE_ENV === "test" ? "someSecret" : process.env.GOCARDLESS_WEBHOOK_SECRET
    }
};

module.exports = config;

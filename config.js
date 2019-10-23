const Airtable = require('airtable');

const airtableApiKey = process.env.AIRTABLE_API_KEY;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;
const env = process.env.NODE_ENV;
const gocardlessApiKey = process.env.GOCARDLESS_API_KEY;
const gocardlessWebhookSecret = process.env.GOCARDLESS_WEBHOOK_SECRET;

const config = {
    airtable: {
        base: new Airtable({apiKey: airtableApiKey}).base(airtableBaseId)
    },
    gocardless: {
        baseUrl:
            env === "development"
                ? "https://api-sandbox.gocardless.com"
                : "https://api.gocardless.com",
        requestHeaders: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + gocardlessApiKey,
            'GoCardless-Version': '2015-07-06'
        },
        webhookSecret: env === "test" ? "someSecret" : gocardlessWebhookSecret
    }
};

module.exports = config;

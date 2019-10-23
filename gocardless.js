const apiKey = process.env.GOCARDLESS_API_KEY;

module.exports = {
    baseUrl:
        process.env.NODE_ENV === "development"
            ? "https://api-sandbox.gocardless.com/"
            : "https://api.gocardless.com/",
    requestHeaders: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
        'GoCardless-Version': '2015-07-06'
    },
    webhookSecret: process.env.NODE_ENV === "test" ? "someSecret" : process.env.GOCARDLESS_WEBHOOK_SECRET
};

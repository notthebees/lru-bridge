module.exports = {
    baseUrl:
        process.env.NODE_ENV === "development"
            ? "https://api-sandbox.gocardless.com/"
            : "https://api.gocardless.com/",
    webhookSecret: process.env.NODE_ENV === "test" ? "someSecret" : process.env.GOCARDLESS_WEBHOOK_SECRET
};

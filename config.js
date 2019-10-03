module.exports = {
  gcBaseUrl:
    process.env.NODE_ENV == "development"
      ? "https://api-sandbox.gocardless.com/"
      : "https://api.gocardless.com/"
};

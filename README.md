# lru-bridge

## API

### Endpoints

POST    /updateMember
* Responds to GoCardless "New Subscription" updates

## Build

Install dependencies:

```npm install```

To run tests, first set the `NODE_ENV` environment variable to `test`:

```export NODE_ENV='test'```

Then run

```npm test```

For local testing, ensure `NODE_ENV` is set to `development`. You also need to set the `GOCARDLESS_API_KEY` and `GOCARDLESS_WEBHOOK_SECRET`, which you will have defined in your GoCardless sandbox account. Then start the server with

```npm start```

The server will listen on port 3000.

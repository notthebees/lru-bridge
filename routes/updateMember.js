const express = require('express');
const router = express.Router();
router.use(express.json());
const request = require('request');
const Airtable = require('airtable');
const base = new Airtable({apiKey: 'keyZ0TTQdstBfuP3H'}).base('appT1QHGIE3H9c5Dn');

const goCardlessApiKey = process.env.GO_CARDLESS_API_KEY;

const goCardlessHeaders = {
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + goCardlessApiKey,
    'GoCardless-Version': '2015-07-06'
};

function updateMember(memberId) {
    base('Members').update([
        {
            "id": memberId,
            "fields": {
                "Contact type": "Member - paying confirmed"
            }
        }
    ], function (err, records) {
        if (err) {
            console.error(err);
            return;
        }
        records.forEach(function (record) {
            console.log('Updated member:', record.id);
        });
    });
}

function getEmail(error, response, body) {
    if (!error && response.statusCode === 200) {
        const info = JSON.parse(body);
        const email = info.customers.email;
        console.log('Retrieved email:', email);

        base('Members').select({
            maxRecords: 1,
            view: 'Grid view',
            filterByFormula: "AND({Email address} = '" + email + "', {Contact type} = 'Interested (did not complete payment)')"
        }).firstPage(function(err, records) {
            if (err) { console.error(err); return; }
            records.forEach(function(record) {
                var memberId = record.id;
                console.log('Retrieved member:', memberId);
                updateMember(memberId);
            });
        });
    }
}

function getCustomer(error, response, body) {
    if (!error && response.statusCode === 200) {
        const info = JSON.parse(body);
        const customerId = info.mandates.links.customer;
        console.log('Retrieved customer:', customerId);

        const options = {
            url: 'https://api-sandbox.gocardless.com/customers/' + customerId,
            headers: goCardlessHeaders
        };

        request(options, getEmail)
    }
}

function getMandate(error, response, body) {
    if (!error && response.statusCode === 200) {
        const info = JSON.parse(body);
        const mandateId = info.subscriptions.links.mandate;
        console.log('Retrieved mandate:', mandateId);

        const options = {
            url: 'https://api-sandbox.gocardless.com/mandates/' + mandateId,
            headers: goCardlessHeaders
        };

        request(options, getCustomer)
    }
}

function updateFor(subscriptionId) {
    const options = {
        url: 'https://api-sandbox.gocardless.com/subscriptions/' + subscriptionId,
        headers: goCardlessHeaders
    };

    request(options, getMandate);
}

router.post('/', function (request, response) {
    const subscriptionId = request.body.events[0].links.subscription;
    console.log('Received webhook for new subscription:', subscriptionId);
    updateFor(subscriptionId);
    response.sendStatus(204);
});

module.exports = router;

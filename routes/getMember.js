const express = require('express');
const router = express.Router();
router.use(express.json());
const request = require('request');
const Airtable = require('airtable');
const base = new Airtable({apiKey: 'keyZ0TTQdstBfuP3H'}).base('appT1QHGIE3H9c5Dn');

function updateMember(memberId) {
    base('Members').update([
        {
            "id": memberId,
            "fields": {
                "Contact type": "Confirmed"
            }
        }
    ], function (err, records) {
        if (err) {
            console.error(err);
            return;
        }
        records.forEach(function (record) {
            let name = record.get('Name');
            console.log(name);
        });
    });
}

function callback3(error, response, body) {
    if (!error && response.statusCode === 200) {
        const info = JSON.parse(body);
        const email = info.customers.email;
        console.log(email);

        base('Members').select({
            maxRecords: 1,
            view: 'Grid view',
            filterByFormula: "{Email address} = '" + email + "'"
        }).firstPage(function(err, records) {
            if (err) { console.error(err); return; }
            records.forEach(function(record) {
                var memberId = record.id;
                console.log('Retrieved', memberId);
                updateMember(memberId);
            });
        });
    }
}

function callback2(error, response, body) {
    if (!error && response.statusCode === 200) {
        const info = JSON.parse(body);
        const customerId = info.mandates.links.customer;
        console.log(customerId);

        const options = {
            url: 'https://api-sandbox.gocardless.com/customers/' + customerId,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer sandbox_cCnuVtVVOvn9sl12SkoXt2M2zPsby7szcH77LDYi',
                'GoCardless-Version': '2015-07-06'
            }
        };

        request(options, callback3)
    }
}

function callback1(error, response, body) {
    if (!error && response.statusCode === 200) {
        const info = JSON.parse(body);
        const mandateId = info.subscriptions.links.mandate;
        console.log(mandateId);

        const options = {
            url: 'https://api-sandbox.gocardless.com/mandates/' + mandateId,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer sandbox_cCnuVtVVOvn9sl12SkoXt2M2zPsby7szcH77LDYi',
                'GoCardless-Version': '2015-07-06'
            }
        };

        request(options, callback2)
    }
}

function getEmail(subscriptionId) {
    const options = {
        url: 'https://api-sandbox.gocardless.com/subscriptions/' + subscriptionId,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer sandbox_cCnuVtVVOvn9sl12SkoXt2M2zPsby7szcH77LDYi',
            'GoCardless-Version': '2015-07-06'
        }
    };

    request(options, callback1);
}

router.post('/', function (request, response) {
    const subscriptionId = request.body.events[0].links.subscription;
    getEmail(subscriptionId);
    response.json({title: 'Email retrieved'});
});

module.exports = router;

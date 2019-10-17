const express = require('express');
const router = express.Router();
const request = require('request');

function callback3(error, response, body) {
    if (!error && response.statusCode === 200) {
        const info = JSON.parse(body);
        const email = info.customers.email;
        console.log(email);
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

router.get('/:subscriptionId', function (request, response) {
    getEmail(request.params['subscriptionId']);
    response.json({title: 'Email retrieved'});
});

module.exports = router;

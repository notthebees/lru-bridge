var express = require('express');
var router = express.Router();
const request = require('request');


function callback(error, response, body) {
    if (!error && response.statusCode === 200) {
        const info = JSON.parse(body);
        console.log(info.subscriptions.links.mandate);
    }
}

function getMandate(subscriptionId) {
    const options = {
        url: 'https://api-sandbox.gocardless.com/subscriptions/' + subscriptionId,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer sandbox_cCnuVtVVOvn9sl12SkoXt2M2zPsby7szcH77LDYi',
            'GoCardless-Version': '2015-07-06'
        }
    };

    request(options, callback);
}

router.get('/', function (request, response) {
    getMandate('SB0001RTC070X7');
    response.json({title: 'Subscription retrieved'});
});

module.exports = router;

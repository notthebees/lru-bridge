const express = require('express');
const router = express.Router();

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

router.post('/', function (request, response) {
    const email = "fred@fred.com"

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

    response.sendStatus(201);
});

module.exports = router;

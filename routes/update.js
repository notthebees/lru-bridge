var express = require('express');
var router = express.Router();

var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyZ0TTQdstBfuP3H'}).base('appT1QHGIE3H9c5Dn');

function updateMember(memberId, response) {
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
            response.json({title: 'Update failed'});
            return;
        }
        records.forEach(function (record) {
            let name = record.get('Name');
            console.log(name);
            response.json({title: "Updated " + name});
        });
    });
}

router.get('/:memberId', function (request, response) {
    updateMember(request.params['memberId'], response);
});

module.exports = router;

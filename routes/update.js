var express = require('express');
var router = express.Router();

var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyZ0TTQdstBfuP3H'}).base('appT1QHGIE3H9c5Dn');

router.get('/:memberId', function (request, response) {
    base('Members').update([
        {
            "id": request.param('memberId'),
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
});

module.exports = router;

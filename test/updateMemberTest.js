const app = require('../app')
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

describe('updateMember', function () {
    it('should return a 204', function () {
        const webhook = {
            events: [
                {
                    links: {
                        subscription: "SB0001RTC070X7"
                    }
                }
            ]
        };

        chai.request(app)
            .post('/updateMember')
            .send(webhook)
            .end((err, res) => {
                res.should.have.status(204);
            });
    });
});

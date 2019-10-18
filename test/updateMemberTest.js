const app = require('../app')
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const nock = require('nock');

const subscriptionId = "someSubscriptionId";
const mandateId = "someMandateId";
const customerId = "someCustomerId";

const webhook = {
    events: [
        {
            links: {
                subscription: subscriptionId
            }
        }
    ]
};

describe('updateMember', function () {
    beforeEach(() => {
        nock('https://api-sandbox.gocardless.com')
            .get('/subscriptions/' + subscriptionId)
            .reply(200, {
                subscriptions: {
                    links: {
                        mandate: mandateId
                    }
                }
            });
        nock('https://api-sandbox.gocardless.com')
            .get('/mandates/' + mandateId)
            .reply(200, {
                mandates: {
                    links: {
                        customer: customerId
                    }
                }
            });
        nock('https://api-sandbox.gocardless.com')
            .get('/customers/' + customerId)
            .reply(200, {
                customers: {
                    email: "tim@gocardless.com"
                }
            });
    });

    it('should return a 204', function () {
        chai.request(app)
            .post('/updateMember')
            .send(webhook)
            .end((err, res) => {
                res.should.have.status(204);
            });
    });
});

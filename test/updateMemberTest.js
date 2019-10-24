const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const crypto = require('crypto');
const expect = chai.expect;
const { airtable, gocardless } = require('../config');
const nock = require('nock');

const subscriptionId = "someSubscriptionId";
const mandateId = "someMandateId";
const customerId = "someCustomerId";
const email = "someEmail";
const memberId = "someMemberId";

const webhookBody = {
    events: [
        {
            links: {
                subscription: subscriptionId
            }
        }
    ]
};
const hmac = crypto.createHmac('sha256', gocardless.webhookSecret);
hmac.update(JSON.stringify(webhookBody));
const webhookBodyDigest = hmac.digest('hex');

describe('updateMember', function () {
    beforeEach(() => {
        nock(gocardless.baseUrl)
            .get('/subscriptions/' + subscriptionId)
            .reply(200, {
                subscriptions: {
                    links: {
                        mandate: mandateId
                    }
                }
            });
        nock(gocardless.baseUrl)
            .get('/mandates/' + mandateId)
            .reply(200, {
                mandates: {
                    links: {
                        customer: customerId
                    }
                }
            });
        nock(gocardless.baseUrl)
            .get('/customers/' + customerId)
            .reply(200, {
                customers: {
                    email: email
                }
            });
        nock(airtable.baseUrl)
            .get("/v0/" + airtable.baseId + "/Members")
            .query({
                maxRecords: 1,
                view: "Grid view",
                filterByFormula: "AND({Email address} = '" + email + "', {Contact type} = 'Interested (did not complete payment)')"
            })
            .reply(200, {
                records: [
                    {
                        id: memberId
                    }
                ]
            });
    });

    it('should update the member in Airtable corresponding to the GoCardless webhook', function (done) {
        const updateAirtable = nock(airtable.baseUrl)
            .patch("/v0/" + airtable.baseId + "/Members/?", {
                records: [
                    {
                        id: memberId,
                        fields: {
                            "Contact type": "Member - paying confirmed"
                        }
                    }
                ]
            })
            .reply(200, {
                records: [
                    {
                        fields: {
                            "Name": "Member Name"
                        }
                    }
                ]
            });

        chai.request(app)
            .post('/updateMember')
            .set('Webhook-Signature', webhookBodyDigest)
            .send(webhookBody)
            .end((err, res) => {
                expect(res).to.have.status(204);
                setTimeout(() => {
                    expect(updateAirtable.isDone()).to.equal(true);
                    done();
                }, 200);
            });
    });

    it('should return a 498 if the webhook signature is invalid', function(done) {
        const invalidSignature = webhookBodyDigest + 'invalid';

        chai.request(app)
            .post('/updateMember')
            .set('Webhook-Signature', invalidSignature)
            .send(webhookBody)
            .end((err, res) => {
                expect(res).to.have.status(498);
                done();
            });
    });
});

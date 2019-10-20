const app = require('../app')
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const nock = require('nock');

const subscriptionId = "someSubscriptionId";
const mandateId = "someMandateId";
const customerId = "someCustomerId";
const email = "someEmail";
const memberId = "someMemberId";

const goCardlessWebhook = {
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
                    email: email
                }
            });
        nock('https://api.airtable.com')
            .get('/v0/appT1QHGIE3H9c5Dn/Members')
            .query({maxRecords: 1, view: "Grid view", filterByFormula: "{Email address} = '" + email + "'"})
            .reply(200, {
                records: [
                    {
                        id: memberId
                    }
                ]
            });
    });

    it('should update the member in Airtable corresponding to the GoCardless webhook', function (done) {
        const updateAirtable = nock('https://api.airtable.com')
            .patch('/v0/appT1QHGIE3H9c5Dn/Members/?', {
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
            .send(goCardlessWebhook)
            .end((err, res) => {
                expect(res).to.have.status(204);
                setTimeout(() => {
                    expect(updateAirtable.isDone()).to.equal(true);
                    done();
                }, 500);
            });
    });
});

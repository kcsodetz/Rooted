var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var User = require('../../model/user');
var should = require('chai').should();

chai.use(chaiHttp);


var uname = process.env.UNIT_TEST_USERNAME
var pword = process.env.UNIT_TEST_PASSWORD
var mail = process.env.UNIT_TEST_EMAIL

describe('Test Forgot Password', () => {

    before((done) => {
        var info = {
            username: trename,
            password: pword,
            email: mail,
        }
        chai.request(server)
            .post('/tree/add')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(info).then(() => {
                chai.request(server)
                    .post('/tree/info')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send(info)
                    .then((res) => {
                        done()
                    })
            })
    })

    after(() => {
        Tree.deleteOne({ treename: trename }).then(() => {

        })
    })

    describe('Add tree', () => {
        it('Should return 400', (done) => {

            var info = {
                treename: trename
            }

            chai.request(server)
                    .post('/tree/add')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(400);
                        done();
                    });
        })
    })



})
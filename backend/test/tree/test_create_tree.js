var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var User = require('../../model/user');
var Tree = require('../../model/tree')
var should = require('chai').should();

chai.use(chaiHttp);


var uname = process.env.TEST_USERNAME;
var pword = process.env.TEST_PASSWORD;
var mail = process.env.TEST_EMAIL;

var token;

describe('Test Add Tree', () => {

    before((done) => {
        var info = {
            username: uname,
            password: pword,
            email: mail,
        }
        chai.request(server)
            .post('/user/register')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(info).then(() => {
                chai.request(server)
                    .post('/user/login')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send(info)
                    .then((res) => {
                        token = res.header.token
                        done()
                    })
            })

        after((done) => {
            User.deleteOne({ username: uname }).then(() => {
                Tree.deleteOne({ treeName: 'UNIT_TEST_TREE' }).then(() => {
                    done()
                })
            })
        })

    })

    describe('Add tree without tree name', () => {
        it('Should return 400', (done) => {
            chai.request(server)
                .post('/tree/add')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send()
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Add tree with bad authentication', () => {
        it('Should return 401', (done) => {
            var info = {
                treeName: 'UNIT_TEST_TREE'
            }
            chai.request(server)
                .post('/tree/add')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    res.should.have.status(401)
                    done()
                })
        })
    })

    describe('Add tree with correct info', () => {
        it('Should return 200', (done) => {
            var info = {
                treeName: 'UNIT_TEST_TREE'
            }
            chai.request(server)
                .post('/tree/add')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
        })
    })

})
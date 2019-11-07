var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var User = require('../../model/user');
var Tree = require('../../model/tree')
var should = require('chai').should();

chai.use(chaiHttp);


var uname = process.env.TEST_USERNAME
var pword = process.env.TEST_PASSWORD
var mail = process.env.TEST_EMAIL

var testTreeName = "UNIT_TEST_TREE"

describe('Test Inviting User to Tree', () => {
    // Preprocessing (Register, login, and create tree)
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
                        var treeInfo = {
                            treeName: testTreeName
                        }
                        var token = res.header.token
                        chai.request(server)
                            .post('/tree/add')
                            .set('content-type', 'application/x-www-form-urlencoded')
                            .set('token', token)
                            .send(treeInfo)
                            .then((res) => {
                                treeID = res.body._id
                                done()
                            })
                    })
            })

        // Postprocessing (delete user and tree)
        after((done) => {
            User.deleteOne({ username: uname }).then(() => {
                Tree.deleteOne({ treeName: testTreeName }).then(() => {
                    done()
                })
            })
        })

    })

    describe('Search for tree without treename', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                // Request with payload
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .get('/tree/search-tree')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .end((err, res) => {
                        res.should.have.status(400)
                        done()
                    })
            }).catch((err) => {

            })
        })
    })

    describe('Search for tree with bad authentication', () => {
        it('Should return 401', (done) => {
            User.findOne({ username: uname }).then((user) => {
                // Request with payload
                chai.request(server)
                    .get('/tree/search-tree')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', 'bad auth')
                    .end((err, res) => {
                        res.should.have.status(401)
                        done()
                    })
            })
        })
    })

 describe('Search for tree that does not return results', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                // Request with payload
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .get('/tree/search-tree')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .set('treename', "DOES NOT EXIST")
                    .end((err, res) => {
                        res.should.have.status(400)
                        done()
                    })
            }).catch((err) => {

            })
        })
    })

 describe('Search for tree that returns results', () => {
        it('Should return 200', (done) => {
            User.findOne({ username: uname }).then((user) => {
                // Request with payload
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .get('/tree/search-tree')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .set('treename', testTreeName)
                    .end((err, res) => {
                        res.should.have.status(200)
                        done()
                    })
            }).catch((err) => {

            })
        })
    })
})
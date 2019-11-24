var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var User = require('../../model/user');
var Tree = require('../../model/tree')
var should = require('chai').should();
var mongoose = require('mongoose');

chai.use(chaiHttp);


var uname = process.env.TEST_USERNAME
var pword = process.env.TEST_PASSWORD
var mail = process.env.TEST_EMAIL

var treeID;

var badID = mongoose.Types.ObjectId();
var usr = "testing_ken"

describe('Test Join Tree from Invite', () => {
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
                            treeName: "UNIT_TEST_TREE"
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
                Tree.deleteOne({ treeName: 'UNIT_TEST_TREE' }).then(() => {
                    done()
                })
            })
        })

    })

    describe('Join tree without tree ID', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                // Request with payload
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/user/join-tree')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(400)
                        done()
                    })
            }).catch((err) => {

            })
            var info = {
                username: usr
            }
        })
    })

    describe('Join tree without username', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                // Request with payload
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/user/join-tree')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(400)
                        done()
                    })
            }).catch((err) => {

            })
            var info = {
                treeID: treeID,
            }
        })
    })

    describe('Join tree with bad authentication', () => {
        it('Should return 401', (done) => {
            User.findOne({ username: uname }).then((user) => {
                // Request with payload
                chai.request(server)
                    .post('/user/join-tree')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', 'bad auth')
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(401)
                        done()
                    })
            })
            var info = {
                treeID: treeID,
                username: usr
            }
        })
    })

    describe('Join tree with bad tree ID', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                // Request with payload
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/user/join-tree')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(400)
                        done()
                    })
            }).catch((err) => {

            })
            var info = {
                treeID: badID,
                username: usr
            }
        })
    })

    describe('Join tree as user who does not exist', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/user/join-tree')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(400)
                        done()
                    })
            }).catch((err) => {

            })
            var info = {
                treeID: treeID,
                username: "DOES NOT EXIST"
            }
        })
    })

    describe('Join tree with correct info', () => {
        it('Should return 200', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/user/join-tree')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(200)
                        done()
                    })
            }).catch((err) => {

            })
            var info = {
                treeID: treeID,
                username: usr
            }
        })
    })
})
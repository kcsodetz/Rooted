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

var usr = "testing_ken"

var treeID;

var badID = mongoose.Types.ObjectId();


describe('Test Ban and Unban Users', () => {

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

        after((done) => {
            User.deleteOne({ username: uname }).then(() => {
                Tree.deleteOne({ treeName: 'UNIT_TEST_TREE' }).then(() => {
                    done()
                })
            })
        })

    })

    describe('Ban from tree without tree ID', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/ban-user')
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
                userToBan: usr
            }
        })
    })

    describe('Ban from tree with bad auth', () => {
        it('Should return 401', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                chai.request(server)
                    .post('/tree/ban-user')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(401)
                        done()
                    })
            }).catch((err) => {

            })
            var info = {
                userToBan: usr
            }
        })
    })

    describe('Ban from tree without userToBan', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/ban-user')
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
                treeID: treeID
            }
        })
    })

    describe('Ban from tree with bad tree ID', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/ban-user')
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
                userToBan: usr
            }
        })
    })

    describe('Ban from tree with bad username', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/ban-user')
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
                userToBan: "Does Not Exist"
            }
        })
    })

    describe('Ban from tree with proper info', () => {
        it('Should return 200', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/ban-user')
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
                userToBan: usr
            }
        })
    })

    describe('Ban from tree with duplicate user', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/ban-user')
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
                userToBan: usr
            }
        })
    })
    describe('Unban from tree without tree ID', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/unban-user')
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
                userToUnban: usr
            }
        })
    })

describe('Unban from tree with bad auth', () => {
        it('Should return 401', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                chai.request(server)
                    .post('/tree/unban-user')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(401)
                        done()
                    })
            }).catch((err) => {

            })
            var info = {
                userToUnban: usr
            }
        })
    })

describe('Unban from tree without userToUnban', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/unban-user')
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
                treeID: treeID
            }
        })
    })

describe('Unban from tree with bad tree ID', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/unban-user')
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
                userToUnban: usr
            }
        })
    })

describe('Unban from tree with bad username', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/unban-user')
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
                userToUnban: "Does Not Exist"
            }
        })
    })

describe('Unban from tree with proper info', () => {
        it('Should return 200', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/unban-user')
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
                userToUnban: usr
            }
        })
    })

})
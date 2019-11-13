var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var User = require('../../model/user');
var Tree = require('../../model/tree');
var should = require('chai').should();
var mongoose = require('mongoose');

chai.use(chaiHttp);


var uname = process.env.TEST_USERNAME;
var pword = process.env.TEST_PASSWORD;
var mail = process.env.TEST_EMAIL;

var token;

var usr = "testing_ken";

var tID;

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
                        token = res.header.token
                        chai.request(server)
                            .post('/tree/add')
                            .set('content-type', 'application/x-www-form-urlencoded')
                            .set('token', token)
                            .send(treeInfo)
                            .then((res) => {
                                tID = res.body._id
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
            var info = {
                userToBan: usr
            }
            chai.request(server)
                .post('/tree/ban-user')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Ban from tree with bad auth', () => {
        it('Should return 401', (done) => {
            var info = {
                userToBan: usr,
                treeID: tID
            }
            chai.request(server)
                .post('/tree/ban-user')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    res.should.have.status(401)
                    done()
                })
        })
    })

    describe('Ban from tree without userToBan', () => {
        it('Should return 400', (done) => {
            var info = {
                treeID: tID
            }
            chai.request(server)
                .post('/tree/ban-user')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Ban from tree with bad tree ID', () => {
        it('Should return 400', (done) => {
            var info = {
                treeID: badID,
                userToBan: usr
            }
            chai.request(server)
                .post('/tree/ban-user')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Ban from tree with bad username', () => {
        it('Should return 400', (done) => {
            var info = {
                treeID: tID,
                userToBan: "Does Not Exist"
            }
            chai.request(server)
                .post('/tree/ban-user')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Ban from tree with proper info', () => {
        it('Should return 200', (done) => {
            var info = {
                treeID: tID,
                userToBan: usr
            }
            chai.request(server)
                .post('/tree/ban-user')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
        })
    })

    describe('Ban from tree with duplicate user', () => {
        it('Should return 400', (done) => {
            var info = {
                treeID: tID,
                userToBan: usr
            }
            chai.request(server)
                .post('/tree/ban-user')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Unban from tree without tree ID', () => {
        it('Should return 400', (done) => {
            var info = {
                userToUnban: usr
            }
            chai.request(server)
                .post('/tree/unban-user')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Unban from tree with bad auth', () => {
        it('Should return 401', (done) => {
            var info = {
                userToUnban: usr,
                treeID: tID
            }
            chai.request(server)
                .post('/tree/unban-user')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    res.should.have.status(401)
                    done()
                })
        })
    })

    describe('Unban from tree without userToUnban', () => {
        it('Should return 400', (done) => {
            var info = {
                treeID: tID
            }
            chai.request(server)
                .post('/tree/unban-user')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Unban from tree with bad tree ID', () => {
        it('Should return 400', (done) => {
            var info = {
                treeID: badID,
                userToUnban: usr
            }
            chai.request(server)
                .post('/tree/unban-user')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Unban from tree with bad username', () => {
        it('Should return 400', (done) => {
            var info = {
                treeID: tID,
                userToUnban: "Does Not Exist"
            }
            chai.request(server)
                .post('/tree/unban-user')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Unban from tree with proper info', () => {
        it('Should return 200', (done) => {
            var info = {
                treeID: tID,
                userToUnban: usr
            }
            chai.request(server)
                .post('/tree/unban-user')
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
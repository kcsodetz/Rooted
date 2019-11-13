var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var User = require('../../model/user');
var Tree = require('../../model/tree')
var should = require('chai').should();
var mongoose = require('mongoose');

chai.use(chaiHttp);


var uname = process.env.TEST_USERNAME;
var pword = process.env.TEST_PASSWORD;
var mail = process.env.TEST_EMAIL;
var testTreeName = 'UNIT_TEST_TREE';

var tID;
var token;

var badID = mongoose.Types.ObjectId();
var usr = "testing_ken";

describe('Test Adding and Removing an Admin', () => {
    // Preprocessing (Register, login, create tree, add user)
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
                        token = res.header.token
                        chai.request(server)
                            .post('/tree/add')
                            .set('content-type', 'application/x-www-form-urlencoded')
                            .set('token', token)
                            .send(treeInfo)
                            .then((res) => {
                                tID = res.body._id;
                            }).then(() => {
                                Tree.findOneAndUpdate({ _id: tID }, {
                                    $push: {
                                        members: usr,
                                    }
                                }).catch((err) => {
                                    console.log("err is: " + err)
                                })
                            })
                        done()
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

    describe('Add admin without tree ID', () => {
        it('Should return 400', (done) => {
            var info = {
                username: usr
            }
            chai.request(server)
                .post('/tree/add-admin')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Add admin with bad authentication', () => {
        it('Should return 401', (done) => {
            var info = {
                treeID: tID,
                username: usr
            }
            chai.request(server)
                .post('/tree/add-admin')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    res.should.have.status(401)
                    done()
                })
        })
    })

    describe('Add admin with bad tree ID', () => {
        it('Should return 400', (done) => {
            var info = {
                treeID: badID,
                username: usr
            }
            chai.request(server)
                .post('/tree/add-admin')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Add admin who does not exist / not in tree', () => {
        it('Should return 400', (done) => {
            var info = {
                treeID: tID,
                username: "DOES NOT EXIST"
            }
            chai.request(server)
                .post('/tree/add-admin')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Add admin with correct info', () => {
        it('Should return 200', (done) => {
            var info = {
                treeID: tID,
                username: usr
            }
            chai.request(server)
                .post('/tree/add-admin')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
        })
    })

    describe('Remove admin without tree ID', () => {
        it('Should return 400', (done) => {
            var info = {
                username: usr
            }
            chai.request(server)
                .post('/tree/remove-admin')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Remove admin with bad authentication', () => {
        it('Should return 401', (done) => {
            var info = {
                treeID: tID,
                username: usr
            }
            chai.request(server)
                .post('/tree/remove-admin')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(info)
                .end((err, res) => {
                    res.should.have.status(401)
                    done()
                })
        })
    })

    describe('Remove admin with bad tree ID', () => {
        it('Should return 400', (done) => {
            var info = {
                treeID: badID,
                username: usr
            }
            chai.request(server)
                .post('/tree/remove-admin')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Remove admin who does not exist / not in tree', () => {
        it('Should return 400', (done) => {
            var info = {
                treeID: tID,
                username: "DOES NOT EXIST"
            }
            chai.request(server)
                .post('/tree/remove-admin')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Remove admin with correct info', () => {
        it('Should return 200', (done) => {
            var info = {
                treeID: tID,
                username: usr
            }
            chai.request(server)
                .post('/tree/remove-admin')
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
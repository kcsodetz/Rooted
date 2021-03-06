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

var treeID;
var token;

var badID = mongoose.Types.ObjectId();
var usr = "testing_ken";
var annoucement = "hi";

describe('Test Add And Remove Announcements', function() {
    // Preprocessing (Register, login, create tree, add user)
    this.timeout(5000);
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
                                treeID = res.body._id;
                            }).then(() => {
                                Tree.findOneAndUpdate({ _id: treeID }, {
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

    describe('Add announcement with bad authentication', () => {
        it('Should return 401', (done) => {
                // Request with payload
                chai.request(server)
                    .post('/tree/add-annoucement')
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

    describe('Add announcement with bad tree ID', () => {
        it('Should return 400', (done) => {
                // Request with payload
                chai.request(server)
                    .post('/tree/add-annoucement')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(400)
                        done()
                    })
           
            var info = {
                treeID: badID,
                username: usr
            }
        })
    })

    describe('Add announcement from user who does not exist / not in tree', () => {
        it('Should return 400', (done) => {
                //do the get request here 
                chai.request(server)
                    .post('/tree/add-annoucement')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(400)
                        done()
                    })
            
            var info = {
                treeID: treeID,
                username: "DOES NOT EXIST"
            }
        })
    })

    describe('Add announcement with correct info', () => {
        it('Should return 200', (done) => {
                //do the get request here 

                var info = {
                    treeID: treeID,
                    username: usr,
                    annoucement: annoucement
                }

                chai.request(server)
                    .post('/tree/add-annoucement')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(200)
                        done()
                    })
           
            
        })
    })

    describe('Add announcement without tree ID', () => {
        it('Should return 400', (done) => {
                // Request with payload
                chai.request(server)
                    .post('/tree/add-annoucement')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(400)
                        done()
                    })
         
            var info = {
                username: usr
            }
        })
    })

    describe('Remove announcement with bad authentication', () => {
        it('Should return 401', (done) => {
                // Request with payload
                chai.request(server)
                    .post('/tree/remove-annoucement')
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

    describe('Remove announcement with bad tree ID', () => {
        it('Should return 400', (done) => {
                // Request with payload
                chai.request(server)
                    .post('/tree/remove-annoucement')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(400)
                        done()
                    })
           
            var info = {
                treeID: badID,
                username: usr
            }
        })
    })

    describe('Remove announcement from user who does not exist / not in tree', () => {
        it('Should return 400', (done) => {
                //do the get request here 
                chai.request(server)
                    .post('/tree/remove-annoucement')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(400)
                        done()
                    })
            
            var info = {
                treeID: treeID,
                username: "DOES NOT EXIST"
            }
        })
    })

    describe('Remove announcement with correct info', () => {
        it('Should return 200', (done) => {
                //do the get request here 

                var info = {
                    treeID: treeID,
                    annoucementID: annoucement
                }


                chai.request(server)
                    .post('/tree/remove-annoucement')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(400)
                        done()
                    })
           
            
        })
    })

    describe('Remove announcement without tree ID', () => {
        it('Should return 400', (done) => {
                // Request with payload
                chai.request(server)
                    .post('/tree/remove-annoucement')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(400)
                        done()
                    })
         
            var info = {
                username: usr
            }
        })
    })

})
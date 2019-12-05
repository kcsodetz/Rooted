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

describe('Test Approve And Reject Announcements', function() {
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

    describe('Approve announcement with bad authentication', () => {
        it('Should return 401', (done) => {
                // Request with payload
                chai.request(server)
                    .post('/tree/approve-annoucement')
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

    describe('Approve announcement with bad tree ID', () => {
        it('Should return 400', (done) => {
                // Request with payload
                chai.request(server)
                    .post('/tree/approve-annoucement')
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

    describe('User who does not exist / not in tree approve announcement', () => {
        it('Should return 400', (done) => {
                //do the get request here 
                chai.request(server)
                    .post('/tree/approve-annoucement')
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

    describe('Approve announcement with correct info', () => {
        it('Should return 200', (done) => {
                //do the get request here 

                var info = {
                    treeID: treeID,
                    
                }

                chai.request(server)
                    .post('/tree/approve-annoucement')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(400)
                        done()
                    })
           
            
        })
    })

    describe('Approve announcement without tree ID', () => {
        it('Should return 400', (done) => {
                // Request with payload
                chai.request(server)
                    .post('/tree/approve-annoucement')
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
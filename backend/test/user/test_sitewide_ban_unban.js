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

describe('Test Sitewide Banning And Unbanning A User', function() {
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
                        token = res.header.token
                        done()
                    })
            })

        // Postprocessing (delete user and tree)
        after((done) => {
            User.deleteOne({ username: uname }).then(() => {
                done()
            })
        })

    })

    describe('Sitewide ban user with bad authentication', () => {
        it('Should return 401', (done) => {
                // Request with payload
                chai.request(server)
                    .post('/user/sw-admin-ban-user')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', 'bad auth')
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(401)
                        done()
                    })
            })
            var info = {
                username: usr
            }
        
    })


    describe('Sitewide ban user who does not exist', () => {
        it('Should return 400', (done) => {
                //do the get request here 
                chai.request(server)
                    .post('/user/sw-admin-ban-user')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(400)
                        done()
                    })
            
            var info = {
                username: "DOES NOT EXIST"
            }
        })
    })

    describe('Sitewide ban user with correct info', () => {
        it('Should return 200', (done) => {
                //do the get request here 

                var info = {
                    userToBan: usr
                }

                chai.request(server)
                    .post('/user/sw-admin-ban-user')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(200)
                        done()
                    })
           
            
        })
    })

    describe('Sitewide unban user with bad authentication', () => {
        it('Should return 401', (done) => {
                // Request with payload
                chai.request(server)
                    .post('/user/sw-admin-unban-user')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', 'bad auth')
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(401)
                        done()
                    })
            })
            var info = {
                username: usr
            }
        
    })


    describe('Sitewide unban user who does not exist', () => {
        it('Should return 400', (done) => {
                //do the get request here 
                chai.request(server)
                    .post('/user/sw-admin-unban-user')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(400)
                        done()
                    })
            
            var info = {
                username: "DOES NOT EXIST"
            }
        })
    })

    describe('Sitewide unban user with correct info', () => {
        it('Should return 200', (done) => {
                //do the get request here 

                var info = {
                    userToUnban: usr
                }

                chai.request(server)
                    .post('/user/sw-admin-unban-user')
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
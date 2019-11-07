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

var treeID;



describe('Test Toggle Privacy', () => {

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

    describe('Toggle privacy without tree ID', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/set-private-status')
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
                treeID: 12345,
                private: true
            }
        })
    })

    describe('Toggle privacy with bad authentication', () => {
        it('Should return 401', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                chai.request(server)
                    .post('/tree/set-private-status')
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
                private: true
            }
        })
    })

    describe('Set privacy to true', () => {
        it('Should return 200', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/set-private-status')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(200)
                        done()
                    })
            })
            var info = {
                treeID: treeID,
                private: true
            }
        })
    })


    describe('Set privacy to false', () => {
        it('Should return 200', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/set-private-status')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(200)
                        done()
                    })
            })
            var info = {
                treeID: treeID,
                private: false
            }
        })
    })

})
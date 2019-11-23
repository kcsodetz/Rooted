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


describe('Test Edit Tree', function() {
    this.timeout(5000)
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

    describe('Edit tree name without tree ID', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/edit-name')
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
                treeName: "UNIT_TEST_TREE"
            }
        })
    })

    describe('Edit tree name without tree name', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/edit-name')
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

    describe('Edit tree name with bad tree ID', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/edit-name')
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
                treeName: "UNIT_TEST_TREE",
                treeID: badID
            }
        })
    })

    describe('Edit tree name with bad authentication', () => {
        it('Should return 401', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                chai.request(server)
                    .post('/tree/edit-name')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', 'bad auth')
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(401)
                        done()
                    })
            })
            var info = {
                treeName: "UNIT_TEST_TREE",
                treeID: treeID
            }
        })
    })

    describe('Edit tree name with correct info', () => {
        it('Should return 200', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/edit-name')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(200)
                        done()
                    })
            })
            var info = {
                treeName: "UNIT_TEST_TREE",
                treeID: treeID
            }
        })
    })

    describe('Edit tree bio without tree ID', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/edit-about-bio')
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
                aboutBio: "NEW TEST BIO"
            }
        })
    })

    describe('Edit tree bio without tree aboutBio', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/edit-about-bio')
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

    describe('Edit tree bio with bad tree ID', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/edit-about-bio')
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
                aboutBio: "NEW TEST BIO",
                treeID: badID
            }
        })
    })

    describe('Edit tree bio with bad authentication', () => {
        it('Should return 401', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                chai.request(server)
                    .post('/tree/edit-about-bio')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', 'bad auth')
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(401)
                        done()
                    })
            })
            var info = {
                aboutBio: "NEW TEST BIO",
                treeID: treeID
            }
        })
    })

    describe('Edit tree bio with correct info', () => {
        it('Should return 200', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/edit-about-bio')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(200)
                        done()
                    })
            })
            var info = {
                aboutBio: "NEW TEST BIO",
                treeID: treeID
            }
        })
    })

    describe('Edit tree description without tree ID', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/edit-tree-description')
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
                treeDescription: "NEW TREE DESC"
            }
        })
    })

    describe('Edit tree description without tree description', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/edit-tree-description')
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

    describe('Edit tree description with bad tree ID', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/edit-tree-description')
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
                treeDescription: "NEW TREE DESC",
                treeID: badID
            }
        })
    })

    describe('Edit tree description with bad authentication', () => {
        it('Should return 401', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                chai.request(server)
                    .post('/tree/edit-tree-description')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', 'bad auth')
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(401)
                        done()
                    })
            })
            var info = {
                treeDescription: "NEW TREE DESC",
                treeID: treeID
            }
        })
    })

    describe('Edit tree description with correct info', () => {
        it('Should return 200', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/edit-tree-description')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(200)
                        done()
                    })
            })
            var info = {
                treeDescription: "NEW TREE DESC",
                treeID: treeID
            }
        })
    })

    describe('Edit tree photo without tree ID', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/edit-photo')
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
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROONT32n_p4AbAd37Eo0ZgOWoF0vY4W8ylg4rb61WnaYwflGxHwg&s"
            }
        })
    })

    describe('Edit tree photo without imageURL', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/edit-photo')
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

    describe('Edit tree photo with bad tree ID', () => {
        it('Should return 400', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/edit-photo')
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
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROONT32n_p4AbAd37Eo0ZgOWoF0vY4W8ylg4rb61WnaYwflGxHwg&s",
                treeID: badID
            }
        })
    })

    describe('Edit tree photo with bad authentication', () => {
        it('Should return 401', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                chai.request(server)
                    .post('/tree/edit-photo')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', 'bad auth')
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(401)
                        done()
                    })
            })
            var info = {
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROONT32n_p4AbAd37Eo0ZgOWoF0vY4W8ylg4rb61WnaYwflGxHwg&s",
                treeID: treeID
            }
        })
    })

    describe('Edit tree photo with correct info', () => {
        it('Should return 200', (done) => {
            User.findOne({ username: uname }).then((user) => {
                //do the get request here 
                var token = user['tokens'][0]['token'][0]
                chai.request(server)
                    .post('/tree/edit-photo')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('token', token)
                    .send(info)
                    .end((err, res) => {
                        res.should.have.status(200)
                        done()
                    })
            })
            var info = {
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROONT32n_p4AbAd37Eo0ZgOWoF0vY4W8ylg4rb61WnaYwflGxHwg&s",
                treeID: treeID
            }
        })
    })

})
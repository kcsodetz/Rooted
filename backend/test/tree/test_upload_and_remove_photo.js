var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var User = require('../../model/user');
var Tree = require('../../model/tree');
var mongoose = require('mongoose');
var should = require('chai').should();

chai.use(chaiHttp);

var IMG_PATH = 'uploads/Purdue.png';

var uname = process.env.TEST_USERNAME;
var pword = process.env.TEST_PASSWORD;
var mail = process.env.TEST_EMAIL;

var testTreeName = "UNIT_TEST_TREE";

var badID = mongoose.Types.ObjectId();
var token;
var treeID;
var imageID;

var info = {
    imageid: imageID,
    treeID: treeID
};

describe('Test Upload and Remove Group Photo', function () {
    this.timeout(5000);
    // Preprocessing (Register, login, and create tree)
    before((done) => {
        var info = {
            username: uname,
            password: pword,
            email: mail,
        };
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
                                treeID = res.body._id
                                done()
                            })
                    })
            })

        // Post-processing (delete user and tree)
        after((done) => {
            User.deleteOne({ username: uname }).then(() => {
                Tree.deleteOne({ treeName: testTreeName }).then(() => {
                    done()
                })
            })
        })

    })

    describe('Add photo without file url', () => {
        it('Should return 400', (done) => {
            // Request with payload
            chai.request(server)
                .post('/tree/add-photo')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .set('treeid', treeID)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Add photo with bad authentication', () => {
        it('Should return 401', (done) => {
            // Request with payload
            chai.request(server)
                .post('/tree/add-photo')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', 'bad auth')
                .set('treeid', treeID)
                .attach('image', IMG_PATH)
                .end((err, res) => {
                    res.should.have.status(401)
                    done()
                })
        })
    })

    describe('Add photo with bad tree ID', () => {
        it('Should return 400', (done) => {
            // Request with payload
            chai.request(server)
                .post('/tree/add-photo')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .set('treeid', badID)
                .attach('image', IMG_PATH)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Add photo with correct values', () => {
        it('Should return 200', (done) => {
            // Request with payload
            chai.request(server)
                .post('/tree/add-photo')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .set('treeid', treeID)
                .attach('image', IMG_PATH)
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
        })
    })

    describe('Get all photos from library', () => {
        it('Should return 200', (done) => {
            // Request with payload
            chai.request(server)
                .get('/tree/all-photos')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .set('treeid', treeID)
                .end((err, res) => {
                    imageID = res.body[0]._id
                    info['imageid'] = imageID
                    res.should.have.status(200)
                    done()
                })
        })
    })

    describe('Remove photo without image ID', () => {
        it('Should return 400', (done) => {
            // Request with payload
            chai.request(server)
                .post('/tree/remove-photo')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .set('treeid', treeID)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Remove photo with bad authentication', () => {
        it('Should return 401', (done) => {
            // Request with payload
            chai.request(server)
                .post('/tree/remove-photo')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', 'bad auth')
                .set('treeid', treeID)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(401)
                    done()
                })
        })
    })

    describe('Remove photo with bad tree ID', () => {
        it('Should return 400', (done) => {
            // Request with payload
            chai.request(server)
                .post('/tree/remove-photo')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .set('treeid', badID)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

    describe('Remove photo with correct values', () => {
        it('Should return 200', (done) => {
            let info_c = {
                imageid: imageID,
                treeid: treeID
            }
            // Request with payload
            chai.request(server)
                .post('/tree/remove-photo')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .set('treeid', treeID)
                .send(info_c)
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
        })
    })

    describe('Remove photo that does not exist', () => {
        it('Should return 400', (done) => {
            // Request with payload
            chai.request(server)
                .post('/tree/remove-photo')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('token', token)
                .set('treeid', treeID)
                .send(info)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })

})
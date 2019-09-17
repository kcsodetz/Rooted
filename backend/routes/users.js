var express = require('express');
var mongoose = require('mongoose')
var encrypt = require('../middleware/encrypt')
var bcrypt = require('bcrypt')
var router = express.Router();


console.log(process.env.MONGODB_HOST)
mongoose.connect(process.env.MONGODB_HOST, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* Objects */
var User = require('../model/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/* POST Login */
router.post('/login', (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).send({ message: "Bad request" })
        return;
    }

    User.findOne({ username: req.body.username }).then((user) => {

        if (!user) {
            res.status(400).send({ message: "Error: User does not exist, register before logging in" })
            return
        }
        // if (!user.verified) {
        //     res.status(401).send({ message: "User is not verified" })
        //     return;
        // }
        console.log(req.body.password)
        bcrypt.compare(req.body.password, user.password, function (err, comp) {
            encrypt(req.body.password).then((p) => {
                console.log(p)
                console.log(user.password)
            })
            if (comp == false) {
                res.status(400).send({ message: "Error: Password is incorrect" })
                return
            }
            else {
                console.log("psswd")
                user.generateAuth().then((token) => {
                    res.status(200).header('token', token).send(user)
                    return
                }).catch((err) => {
                    res.status(400).send(err)
                    return
                })
            }
        })
    }).catch((err) => {
        res.status(400).send(err)
        return
    })
});

/*
 * Register new user 
 */
router.post("/register", (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.username) {
        console.log(req.body.email);
        res.status(400).send({ message: "User data is incomplete" });
        return;
    }

    // Create a verification code between 1000 and 9999
    var verificatonCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    console.log(req.body.password)
    encrypt(req.body.password).then((password) => {
        // User Data
        var newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: password,
            verified: false,
            verificationNum: verificatonCode,
        });


        var newMemberEmailBody = "Dear " + req.body.username +
            ",\n\nWelcome to Rooted! We ask you to please verify your account with us. Your verification code is:\n" +
            verificatonCode + "\nWe look forward to having you with us!\n\nSincerely, \nThe Rooted Team";
        var newMemberEmailSubject = "Welcome to Rooted!"

        console.log(password)

        // Add to database with auth
        newUser.save().then(() => {
            return newUser.generateAuth().then((token) => {

                res.header('verificationNum', verificatonCode).send(newUser);
                mailer(req.body.email, newMemberEmailSubject, newMemberEmailBody);
                return
            });
        }).catch((err) => {
            if (err.code == 11000) {
                res.status(400).send({ message: "User already exists" })
                return
            }
            res.status(400).send(err)
            return;
        })
    })
});


module.exports = router;

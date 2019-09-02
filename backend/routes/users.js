var express = require('express');
var mongoose = require('mongoose')
var encrypt = require('../middleware/encrypt')
var bcrypt = require('bcrypt')
var router = express.Router();


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://rooted:cs4072019@cluster0-60qmv.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   console.log(err);
//   // const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });



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
})


module.exports = router;

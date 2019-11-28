var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var encrypt = require('../middleware/encrypt');
var bcrypt = require('bcrypt');
var authenticate = require('../middleware/authenticate');
var mailer = require('../middleware/mailer');
var validate_email = require('../middleware/validate_email');
var upload = require('../middleware/photo_upload');
var validate = require('../middleware/validate_url');

mongoose.connect(process.env.MONGODB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* Objects */
var User = require('../model/user');
var Tree = require('../model/tree');
var Admin = require('../model/admin');

/**
 * All user related routes
 */
router.get("/", function (req, res) {
    res.send('This route is for all admin related tasks');
});


router.get("/all-admins", function (req, res) {
    Admin.find({}).then((adm) => {
        res.status(200).send(adm[0].admins);
        console.log(adm[0].admins);
        return 
    }).catch((err) => {
        res.status(400).send(err);
    })
});



module.exports = router;
var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
var encrypt = require('../middleware/encrypt')
var bcrypt = require('bcrypt')
var authenticate = require('../middleware/authenticate')
var mailer = require('../middleware/mailer')
var validate_email = require('../middleware/validate_email')
var upload = require('../middleware/photo_upload')
var validate = require('../middleware/validate_url')

mongoose.connect(process.env.MONGODB_HOST, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* Objects */
var User = require('../model/user');
var Tree = require('../model/tree');

/**
 * All user related routes
 */
router.get("/", function (req, res) {
    res.send('This route is for all user related tasks');
});


/**
 * Get account information
 */
router.get("/account", authenticate, (req, res) => {
    res.status(200).send(req.user);
});

/*
 * Register new user 
 */
router.post("/register", (req, res) => {
    console.log("registerhere");
    if (!req.body.email || !req.body.password || !req.body.username) {
        res.status(400).send({ message: "User data is incomplete" });
        return;
    }

    // Create a verification code between 1000 and 9999
    var verificatonCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    console.log(req.body.password)
    encrypt(req.body.password).then((password) => {
        // User Data
        // var newUser = new User({
        //     username: req.body.username,
        //     email: req.body.email,
        //     password: password,
        //     verified: false,
        //     verificationNum: verificatonCode,
        // });

        var newUser = new User({
            username: req.body.username,
            password: password,
            verified: false,
            verificationNum: verificatonCode,
            email: {
                properties: {
                    value: req.body.email,
                    hidden: false
                },
            }
        });

        var newMemberEmailBody = "Dear " + req.body.username +
            ",\n\nWelcome to Rooted! We ask you to please verify your account with us. Your verification code is:\n" +
            verificatonCode + "\nWe look forward to having you with us!\n\nSincerely, \nThe Rooted Team";
        var newMemberEmailSubject = "Welcome to Rooted!"

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
            console.log(err);
            res.status(400).send(err)
            return;
        })
    })
});

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
        bcrypt.compare(req.body.password, user.password, function (err, comp) {
            encrypt(req.body.password).then((p) => {
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


/**
 * Verify new user's email
 */
router.post("/verify-email", (req, res) => {
    // Check if user data is complete
    // console.log("works")
    if (!req.body || !req.body.verificationNum || !req.body.email) {
        res.status(400).send({ message: "User data is incomplete" });
        return;
    }

    // console.log(req.body.email)
    User.findVerificationNumByEmail(req.body.email).then((verificationNum) => {
        // Check if user has entered in the correct verification number
        if (verificationNum != req.body.verificationNum) {
            res.status(400).send({ message: "Verification code does not match" });
            return;
        }
        else {
            User.findOneAndUpdate({ email: req.body.email }, { $set: { verified: true } }).then(() => {
                res.status(200).send({ message: "User has been succesfully verified" });
            }).catch((err) => {
                res.status(400).send({ message: "An error has occoured with verifying your account" });
                res.send(err);
            });
        }
    }).catch((err) => {
        res.status(400).send({ message: "Email does not exist in our records" });
    });

})


/**
 * Reset Password
 */
router.post("/forgot-password", (req, res) => {
    if (!req.body || !req.body.email) {
        res.status(400).send({ message: "Reset information is incomplete" });
        return;
    }

    if (!validate_email(req.body.email)) {
        res.status(400).send({ message: "Invalid email" });
        return;
    }
    // Find user by email
    if (req.body.email) {
        User.findByEmail(req.body.email).then((usr) => {
            var tempPassword = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            var email_subject = "Rooted Password Reset";
            var email_body = "Dear " + usr.email + ", \n\nOur records indicate that you have requested a password " +
                "reset. Your new temporary password is:\n\n" +
                tempPassword + "\n\nSincerely, \n\nThe Rooted Team";
            // find user by email and set temp password
            encrypt(tempPassword).then(encryptedPassword => {
                User.findOneAndUpdate({ email: usr.email }, { $set: { password: encryptedPassword } }).then(() => {
                }).catch((err) => {
                    res.status(400).send({ message: "New password not set." });
                    res.send(err);
                });
            }).catch(err => {
                console.log("err: " + err)
            });
            // Send email to user
            mailer(usr.email, email_subject, email_body);
            res.status(200).send({ message: 'Password has successfully been reset.' });
        }).catch((err) => {
            res.status(400).send({ message: "Email does not exist in our records." });
            console.log(err)
            return;
        });
    }
})


/**
 * Edit a user's email
 */
router.post("/change-email", authenticate, (req, res) => {
    if (!req.body || !req.body.email) {
        res.status(400).send({ message: "User data is incomplete" });
        return;
    }

    if (!validate_email(req.body.email)) {
        res.status(400).send({ message: "Invalid email" });
        return;
    }

    User.findOneAndUpdate({ username: req.user.username },
        {
            $set: {
                email: {
                    properties: {
                        value: req.body.email,
                        hidden: false
                    }
                }
            }
        }).then(() => {
            res.status(200).send({ message: 'User email successfully updated' })
        }).catch((err) => {
            res.status(400).send({ message: "Error changing email" });
            res.send(err);
        })

    var email_subject = "Rooted Reset Email";
    var email_body = "Dear " + req.user.username + ", \n\nOur records indicate that you have changed your email. If this was the intention, no further action is needed from your part." +
        "\n\nSincerely, \n\nThe Rooted Team";

    mailer(req.body.email, email_subject, email_body);
})

/*
 * Change Password
 */
router.post("/change-password", authenticate, (req, res) => {

    if (!req.body || !req.body.password) {
        res.status(400).send({ message: "User information incomplete" })
        return
    }

    var username = req.user.username;
    var newPassword = req.body.password;

    encrypt(newPassword).then(encryptedPassword => {
        User.findOneAndUpdate({ username: username }, { $set: { password: encryptedPassword } }).then(() => {
            res.status(200).send({ message: "Password changed!" })
        }).catch((err) => {
            res.status(400).send({ message: "New password not set." });
            res.send(err);
        });
    }).catch(err => {
        console.log("err: " + err)
    });

    var email_subject = "Rooted Changed Password";
    var email_body = "Dear " + username + ", \n\nOur records indicate that you have changed your password. If this was the intention, no further action is needed from your part." +
        "\n\nSincerely, \n\nThe Rooted Team";

    mailer(req.user.email, email_subject, email_body);
})


/**
 * Get specific user
 */
router.get("/find-user", (req, res) => {
    console.log('finding someone');
    if (!req.body || !req.body.username) {
        res.status(400).send({ message: 'Error retrieving user' })
        return
    }

    User.findOne({ username: req.body.username }).then((user) => {
        // console.log('user: ',user)
        res.status(200).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    })
})

/*
 * Edit Profile
 */
router.post("/edit-profile", authenticate, (req, res) => {

    if (!req.body || !req.body.username) {
        res.status(400).send({ message: "User information incomplete" })
        return
    }

    User.findByUsername(req.body.username).then((user) => {

        if (req.body.birthYear) {
            user.birthYear = req.body.birthYear;
        }

        if (req.body.phoneNumber) {
            user.phoneNumber = req.body.phoneNumber
        }

        if (req.body.facebook) {
            // user.facebook = req.body.facebook
            // console.log(user.facebook.value)
            console.log(user.email)
        }

        if (req.body.twitter) {
            user.twitter = req.body.twitter
        }

        if (req.body.instagram) {
            user.instagram = req.body.instagram
        }

        user.save().then(() => {
            res.status(200).send({ message: "Information updated" })
        }).catch((err) => {
            console.log(err)
            res.status(400).send({ message: "Information not saved" })
        });
    }).catch((err) => {
        console.log(err);
        res.status(400).send({ message: "Cannot retrive user" })
    })



})

/* 
 * Add Profile picture
 */
// router.post('/add-profile-photo', authenticate, upload.single("image"), function (req, res) {
//     if (!req.body || !req.body.email || !req.body.imageUrl) {
//         res.status(400).send({ message: "Bad Request" })
//         return
//     }

//     console.log(req.body.email);

//     if (!validate(req.body.imageUrl)) {
//         console.log("not valid");
//         res.status(400).send({ message: "Invalid image, url is not validated" })
//         return;
//     }

//     User.findOne({ _id: req.body.email }).then((usr) => {
//         console.log('hew');
//         if(!usr) {
//             res.status(400).send({ message: "User does not exist" });
//             return;
//         }

//         User.findByIdAndUpdate({ _id: req.body.email }, {
//             $push: {
//                 images: {
//                     url: req.body.imageUrl
//                 }
//             }
//         }).then((usr) => {
//             console.log('yayyy');
//             res.status(200).send({ message: "Upload successful" })
//             return
//         }).catch((err) => {
//             console.log('boooo');
//             res.send(err);
//         })
//     }). catch((err) => {
//         console.log('boooo 2');
//         res.send(err);
//     })
// });

/**
 * Get all trees
 */
router.get('/all-trees', authenticate, (req, res) => {
    Tree.find({ members: req.user.username }).then((tree) => {
        res.status(200).send(tree)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

// router.get('/photo-library', authenticate, (req, res) => {

// }

module.exports = router;
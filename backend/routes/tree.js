var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
var encrypt = require('../middleware/encrypt')
var bcrypt = require('bcrypt')
var authenticate = require('../middleware/authenticate')
var multer = require("multer");
var cloudinary = require("cloudinary");
var cloudinaryStorage = require("multer-storage-cloudinary");
var upload = require('../middleware/photo_upload')
var validate = require('../middleware/validate_url')
var mailer = require('../middleware/mailer')


mongoose.connect(process.env.MONGODB_HOST, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* Objects */
var Tree = require('../model/tree');
var User = require('../model/user')


/**
* All tree related routes
*/
router.get("/", function (req, res) {
    res.send('This router is for all tree related tasks');
})

router.post("/add", authenticate, function (req, res) {

    if (!req.body || !req.body.treeName) {
        res.status(400).send({ message: "Tree data is incomplete" });
        return;
    }

    let desc = 'A tree rooted in history';
    let url = process.env.DEFAULT_IMAGE;
    if(req.body.description){
        desc = req.body.description
    }
    if(req.body.imageUrl && validate(req.body.imageUrl)){
        url = req.body.imageUrl
    }

    var newTree = new Tree({
        founder: req.user.username,
        treeName: req.body.treeName,
        description: desc,
        imageUrl: url,
    })

    newTree.save().then(() => {
        Tree.findOneAndUpdate({ treeName: req.body.treeName }, {
            $push: {
                'members': req.user.username,
            }
        }).then((tree) => {
            res.status(200).send(tree)
            return
        }).catch((err) => {
            // console.log(err)
        })
    })

});

router.post('/add-photo', authenticate, upload.single("image"), function (req, res) {

    if (!req.body || !req.body.treeID || !req.body.imageUrl) {
        res.status(400).send({ message: "Bad Request" })
        return
    }

    if (!validate(req.body.imageUrl)) {
        res.status(400).send({ message: "Invalid image, url is not validated" })
        return
    }

    Tree.findOneAndUpdate({ _id: req.body.treeID }, {
        $set: {
            imageUrl: req.body.imageUrl,
            hasImage: true
        }
    }).then((tre) => {
        Tree.findOne({ _id: req.body.treeID }).then((tree) => {
            if (tree == null) {
                res.status(400).send({ message: "Tree does not exist" })
                return
            }
            res.status(200).send(tree)
            return
        }).catch((err) => {
            res.send(err)
            return
        })
    }).catch((err) => {
        res.status(400).send("Tree does not exist")
        return
    })
});

router.post('/add-user', authenticate, (req, res) => {

    if (!req.body || !req.body.username || !req.body.treeID) {
        res.status(400).send("Bad request")
        return
    }

    Tree.findById(req.body.treeID, (err, tre) => {

        if (err) {
            res.status(400).send({ message: "Tree does not exist" })
            return
        }

        for (var i = 0; i < tre.members.length; i++) {
            if (tre.members[i] == req.body.username) {
                res.status(400).send({ message: "User is already in tree" })
                return
            }
        }

        User.findOne({ username: req.body.username }).then((user) => {

            if (!user) {
                res.status(400).send({ message: "Username does not exist" });
                return;
            }

            Tree.findOneAndUpdate({ _id: req.body.treeID }, {
                $push: {
                    members: req.body.username,
                }
            }).then(() => {
                Tree.findOneAndUpdate({ _id: req.body.treeID }, {
                    $inc: {
                        numberOfPeople: 1
                    }
                }).then(() => {

                    User.findEmailByUsername(req.body.username).then((email) => {
                        var emailSubject = "Rooted: You\'ve Been Added to \"" + tre.circleName + "\"!"
                        var addedToTreeBody = "Dear " + req.body.username + 
                        ",\n\nOne of your friends has added you to " + tre.founder + "\'s tree \"" + tre.treeName + "\". View your profile for more details.\n\n" +
                        "Sincerely, \n\nThe Rooted Team";

                        mailer(email, emailSubject, addedToTreeBody);

                        res.status(200).send({ message: req.body.username + " added to Tree" })
                    })

                    return
                }).catch((err) => {
                    res.status(400).send(err);
                    return;
                })
            }).catch((err) => {
                res.status(400).send(err);
                return;
            })
        }).catch((err) => {
            res.send(err);
            return;
        })

    })
})

/*
*   Delete chosen tree
*/
router.post('/delete', authenticate, (req, res) => {

    //ensure that requesthas treeID
    //if not, send bad request
    if (!req.body || !req.body.treeID) {
        // console.log(req.body)
        res.status(400).send({ message: "Bad request" });
        return;
    }

    //find specific Tree object by ID
    //requires treeid to be passed in as a header
    Tree.findByIdAndDelete(req.body.treeID, (err, tre) => {
        if (err || tre == null) {
            res.status(400).send({ message: "Could not find tree" });
            return;
        }
        Rooted.findOneAndDelete({_id: {$in: tre.rooted}}).then(() => {
            res.status(200).send(tre) //returns all tree properties
            return
        }).catch((err) => {
            res.send(err);
        })
        // console.log(tre);
    }).catch((err) => {
        res.send(err);
    })
})

/*
*   Edit existing tree
*/
router.post("/edit-name", authenticate, (req, res) => {
    if (!req.body.treeName || !req.body.treeID) {
        res.status(400).json({ message: "Tree name change is incomplete" });
        return;
    }

    Tree.findOne({ _id: req.body.treeID }).then((tre) => {
        if (!tre) {
            res.status(400).json({ message: "Tree does not exist" });
            return;
        }
        Tree.findOneAndUpdate({ _id: req.body.treID },
            {
                $set: {
                    treeName: req.body.treeName,
                }
            }).then(() => {
                res.status(200).send({ message: 'Tree name updated!' })
                return
            }).catch((err) => {
                res.send(err);
            })
    })
})

router.post('/add-message', authenticate, (req, res) => {
    if(!req.body || !req.body.message || !req.body.treeID){
        res.status(400).send({ message: "Bad request" });
        return;
    }
    Tree.findOne({_id: req.body.treeID}).then((tree) => {
        if(!tree){
            res.status(400).send({message: "Tree does not exist"})
            return
        }
        Tree.findOneAndUpdate({_id: req.body.treeID}, {
            $push: {
                chat: {
                    message: req.body.message,
                    user: req.user.username
                }
            }
        }).then((tre) => {
            res.status(200).send({message: "message added"})
            return
        }).catch((err) => {
            res.send(err);
        })
    }).catch((err) => {
        res.send(err);
    })
})


/*
*   Edit existing tree description
*/
router.post("/edit-tree-description", authenticate, (req, res) => {
    if (!req.body.treeDescription || !req.body.treeID) {
        res.status(400).json({ message: "Tree description change is incomplete" });
        return;
    }

    Tree.findOneAndUpdate({ _id: req.body.treeID },
        {
            $set: {
                description: req.body.treeDescription,
            }
        }).then(() => {
            res.status(200).send({ message: 'Tree description updated!' })
            return
        }).catch((err) => {
            res.send(err);
        })
})

router.post('/leave', authenticate, (req, res) => {
    if(!req.body.treeID){
        res.status(400).json({ message: "Tree description change is incomplete" });
        return;
    }
    Tree.findOne({_id: req.body.treeID}).then((tre) => {
        if(!tre){
            res.status(400).send({message: "Tree does not exist"})
            return
        }
        Tree.findOneAndUpdate({_id: req.body.treeID}, {
            $pull: {
                members: req.user.username
            }
        }).then(() => {
            res.status(200).send({ message: username + " has left tree"})
            return
        }).catch((err) => {
            res.send(err);
            return
        })
    }).catch((err) => {
        res.send(err);
        return
    })
})

/*
*   Get all members in a tree
*/
router.get('/all-members', authenticate, (req, res) => {
    if (!req.body || !req.body.treeid) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    Tree.findById(req.body.treeid, (err, tre) => {
        res.status(200).send(tre.members)
    }).catch((err) => {
        res.status(400).send({ message: "Could not find tree" });
        return;
    })
})

router.get('/chat', authenticate, (req, res) => {
    if (!req.headers.treeid) {
        // console.log(req.headers)
        res.status(400).send({ message: "Bad request" });
        return;
    }
    Tree.findById(req.headers.treeid, (err, tre) => {

        if (err || tre == null) {
            res.status(400).send({ message: "Could not find tree" });
            return;
        }
        res.status(200).send(tre.chat) //returns all tree properties
        return
        // console.log("success in returning circle properties");
    })
})

/*
*   Get tree info
*/
router.get('/info', authenticate, (req, res) => {

    //ensure that request has body and has treeID
    //if not, send bad request
    if (!req.headers.treeid) {
        // console.log(req.headers)
        res.status(400).send({ message: "Bad request" });
        return;
    }

    //find specific Tree object by ID
    //requires treeid to be passed in as a header
    Tree.findById(req.headers.treeid, (err, tre) => {

        if (err || tre == null) {
            res.status(400).send({ message: "Could not find tree" });
            return;
        }
        res.status(200).send(tre) //returns all tree properties
        return
        // console.log("success in returning tree properties");
    })
    //to get tree info of a specific tree
    //use ID

    // make sure ID
})





module.exports = router;
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var encrypt = require('../middleware/encrypt');
var bcrypt = require('bcrypt');
var authenticate = require('../middleware/authenticate');
var multer = require("multer");
var cloudinary = require("cloudinary");
var cloudinaryStorage = require("multer-storage-cloudinary");
var upload = require('../middleware/photo_upload');
var validate = require('../middleware/validate_url');
var mailer = require('../middleware/mailer');


mongoose.connect(process.env.MONGODB_HOST, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* Objects */
var Tree = require('../model/tree');
var User = require('../model/user');
var Admin = require('../model/admin');
var InvitedUser = require('../model/invitedUser');


/**
* All tree related routes
*/
router.get("/", function (req, res) {
    res.send('This router is for all tree related tasks');
});


/**
 * Add / create a tree
 */
router.post("/add", authenticate, function (req, res) {

    if (!req.body || !req.body.treeName) {
        res.status(400).send({ message: "Tree data is incomplete" });
        return;
    }

    var desc = 'A tree rooted in history';
    var url = process.env.DEFAULT_IMAGE;
    if (req.body.description) {
        desc = req.body.description;
    }
    if (req.body.imageUrl && validate(req.body.imageUrl)) {
        url = req.body.imageUrl;
    }

    var newTree = new Tree({
        founder: req.user.username,
        treeName: req.body.treeName,
        description: desc,
        imageUrl: url,
        members: [req.user.username],
        admins: [req.user.username]
    });

    var year = new Date();
    var yearStr = year.getFullYear();

    var obj = { "user": req.user.username, "yearStarted": yearStr, "yearEnded": yearStr };
    newTree.memberInvolvement.push(obj);

    newTree.save(function (err, tree) {
        if (err) {
            console.log(err);
            res.status(400).send({ message: "Error: Could not create tree" });
            return;
        }
        else {
            res.status(200).send(tree);
            return;
        }
    });

});


/**
 * Add a photo to a tree
 */
router.post('/add-photo', authenticate, upload.single("image"), (req, res) => {
    if (!req.file || !req.headers.treeid) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    Tree.findOne({ _id: req.headers.treeid }).then((t) => {
        if (!t) {
            res.status(400).send({ message: "Tree does not exist" });
            return;
        }
        Tree.findOneAndUpdate({ _id: req.headers.treeid }, {
            $push: {
                treePhotoLibraryImages: {
                    url: req.file.url,
                    id: req.file.public_id
                }
            }
        }).then((t) => {
            res.status(200).send({ message: "Photo successfully uploaded" });
            return;
        }).catch((err) => {
            res.status(400).send(err);
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});


/**
 * Remove photo from tree
 */
router.post('/remove-photo', authenticate, (req, res) => {
    if (!req.body.treeid || !req.body.imageid) {
        res.status(400).send({ message: "Bad request" });
        return;
    }
    Tree.findOne({ _id: req.body.treeid }).then((tre) => {
        if (!tre) {
            res.status(400).send({ message: "Tree does not exist" });
            return;
        }

        var found = false;
        tre.treePhotoLibraryImages.forEach(element => {
            if (element._id == req.body.imageid) {
                found = true;
                var n = tre.treePhotoLibraryImages.indexOf(element)
                tre.treePhotoLibraryImages.splice(n, 1)
                tre.save()
            }
        });

        if (found) {
            res.status(200).send({ message: "Image succesfully removed." });
            return;
        }
        else {
            res.status(400).send({ message: "Photo not found" });
            return;
        }

    }).catch((err) => {
        res.status(400).send(err);
    })
})


/**
 * Get all photos
 */
router.get('/all-photos', authenticate, (req, res) => {
    if (!req.headers.treeid) {
        res.status(400).send({ message: "Bad request" });
        return;
    }
    Tree.findById(req.headers.treeid, (err, t) => {

        if (err) {
            res.status(400).send({ message: "Could not find tree" });
            return;
        }
        res.status(200).send(t.treePhotoLibraryImages) //returns all tree properties
        return
    }).catch((err) => {
        res.status(400).send(err);
        return;
    })
})


/**
 * DEPRICATED

 * Add a user to a tree 
 * 
 * NOTE: DEPRECATED, DO NOT USE
 */
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

        if (tre.members.includes(req.body.username)) {
            res.status(400).send({ message: req.body.username + " is already in tree" })
            return
        }

        User.findOne({ username: req.body.username }).then((user) => {

            if (!user) {
                res.status(400).send({ message: req.body.username + " does not exist" });
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
                        var emailSubject = "Rooted: You\'ve Been Added to \"" + tre.treeName + "\"!"
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


/**
 * Add an admin to a tree
 */
router.post('/add-admin', authenticate, (req, res) => {

    if (!req.body || !req.body.username || !req.body.treeID) {
        res.status(400).send("Bad request")
        return
    }

    Tree.findById(req.body.treeID, (err, tre) => {

        if (err) {
            res.status(400).send({ message: "Tree does not exist" })
            return;
        }

        if (!tre.admins.includes(req.user.username)) {
            res.status(401).send({ message: "Not authorized to make changes" });
            return;
        }

        if (!tre.members.includes(req.body.username)) {
            res.status(400).send({ message: req.body.username + " is not in the tree. The user must be a member of the tree in order to be promoted to admin." });
            return;
        }

        if (tre.admins.includes(req.body.username)) {
            res.status(400).send({ message: req.body.username + " is already an admin" });
            return;
        }

        User.findOne({ username: req.body.username }).then((user) => {

            if (!user) {
                res.status(400).send({ message: "Username does not exist" });
                return;
            }

            Tree.findOneAndUpdate({ _id: req.body.treeID }, {
                $push: {
                    admins: req.body.username,
                }
            }).then(() => {
                User.findEmailByUsername(req.body.username).then((email) => {
                    var emailSubject = "Rooted: You\'ve Been Promoted to Admin in \"" + tre.treeName + "\"!"
                    var addedToTreeBody = "Dear " + req.body.username +
                        ",\n\nCongrats! " + req.user.username + "has promoted you to an admin of " + tre.treeName + "! Visit the tree page for more information.\n\n" +
                        "Sincerely, \n\nThe Rooted Team";

                    mailer(email, emailSubject, addedToTreeBody);

                    res.status(200).send({ message: req.body.username + " has been promoted to admin" });
                });
                return;
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


/**
 * Remove an admin
 */
router.post('/remove-admin', authenticate, (req, res) => {

    if (!req.body || !req.body.username || !req.body.treeID) {
        res.status(400).send("Bad request")
        return
    }

    Tree.findById(req.body.treeID, (err, tre) => {

        if (err) {
            res.status(400).send({ message: "Tree does not exist." })
            return;
        }

        if (!tre.admins.includes(req.user.username)) {
            res.status(401).send({ message: "Not authorized to make changes." });
            return;
        }

        if (!tre.members.includes(req.body.username)) {
            res.status(400).send({ message: req.body.username + " is not in the tree." });
            return;
        }

        if (!tre.admins.includes(req.body.username)) {
            res.status(400).send({ message: req.body.username + " is not an admin." });
            return;
        }

        User.findOne({ username: req.body.username }).then((user) => {

            if (!user) {
                res.status(400).send({ message: "Username does not exist." });
                return;
            }

            Tree.findOneAndUpdate({ _id: req.body.treeID }, {
                $pull: {
                    admins: req.body.username,
                }
            }).then(() => {
                User.findEmailByUsername(req.body.username).then((email) => {
                    var emailSubject = "Rooted: You\'ve Been Demoted to Admin in \"" + tre.treeName + "\"."
                    var addedToTreeBody = "Dear " + req.body.username +
                        ",\n\n" + req.user.username + "has removed your admin status from " + tre.treeName + "! Please contact your admin team for more info.\n\n" +
                        "Sincerely, \n\nThe Rooted Team";

                    mailer(email, emailSubject, addedToTreeBody);

                    res.status(200).send({ message: req.body.username + " has been demoted from admins." });
                });
                return;
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


/**
 * Delete chosen tree
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
    Tree.findOneAndDelete({ _id: req.body.treeID }).then((tre) => {
        if (tre != null) {
            res.status(200).json({ message: tre.treeName + " has been deleted." })
            return;
        }
        else {
            res.status(400).json({ message: "Could not find tree" })
            return;
        }
    }).catch((err) => {
        console.log(err)
        res.status(400).json({ message: "Fatal error" })
        return;
    })
})


/**
* Edit existing tree name
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
        Tree.findOneAndUpdate({ _id: req.body.treeID },
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


/**
 * Edit about bio
 */
router.post("/edit-about-bio", authenticate, (req, res) => {
    if (!req.body.aboutBio || !req.body.treeID) {
        res.status(400).send({ message: "Tree bio is incomplete" })
        return
    }

    Tree.findOne({ _id: req.body.treeID }).then((tre) => {
        if (!tre) {
            res.status(400).json({ message: "Tree does not exist" });
            return;
        }
        Tree.findOneAndUpdate({ _id: req.body.treeID },
            {
                $set: {
                    aboutBio: req.body.aboutBio,
                }
            }).then(() => {
                res.status(200).send({ message: 'Tree bio is updated!' })
                return
            }).catch((err) => {
                res.send(err);
            })
    })

})

/**
 * Send message to tree
 */
router.post('/add-message', authenticate, (req, res) => {
    if (!req.body || !req.body.message || !req.body.treeID) {
        res.status(400).send({ message: "Bad request" });
        return;
    }
    Tree.findOne({ _id: req.body.treeID }).then((tree) => {
        if (!tree) {
            res.status(400).send({ message: "Tree does not exist" })
            return
        }
        Tree.findOneAndUpdate({ _id: req.body.treeID }, {
            $push: {
                chat: {
                    message: req.body.message,
                    user: req.user.username
                }
            }
        }).then((tre) => {
            res.status(200).send({ message: "message added" })
            return
        }).catch((err) => {
            res.send(err);
        })
    }).catch((err) => {
        res.send(err);
    })
})


/**
* Edit existing tree description
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


/**
 * Edit group photo
 */
router.post('/edit-photo', authenticate, upload.single("image"), function (req, res) {

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


/**
 * Leave a group
 */
router.post('/leave', authenticate, (req, res) => {
    if (!req.body.treeID) {
        res.status(400).json({ message: "Tree description change is incomplete" });
        return;
    }
    Tree.findOne({ _id: req.body.treeID }).then((tre) => {
        if (!tre) {
            res.status(400).send({ message: "Tree does not exist" })
            return
        }
        Tree.findOneAndUpdate({ _id: req.body.treeID }, {
            $pull: {
                members: req.user.username
            }
        }).then(() => {
            res.status(200).send({ message: username + " has left tree" })
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


/**
* Get all members in a tree
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


/**
 * Get all chat messages
 */
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


/**
* Get tree info
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


/**
* Ban a user
*/
router.post('/ban-user', authenticate, (req, res) => {

    if (!req.body.userToBan || !req.body.treeID) {
        res.status(400).send("Bad request")
        return
    }

    Tree.findById(req.body.treeID, (err, tre) => {

        if (err) {
            res.status(400).send({ message: "Tree does not exist" })
            return;
        }

        if (!tre.admins.includes(req.user.username)) {
            res.status(401).send({ message: "Not authorized to make changes" });
            return;
        }

        if (tre.bannedUsers.includes(req.body.userToBan)) {
            res.status(400).send({ message: "User is already banned" });
            return;
        }

        User.findOne({ username: req.body.userToBan }).then((user) => {

            if (!user) {
                res.status(400).send({ message: "Username does not exist" });
                return;
            }

            Tree.findOneAndUpdate({ _id: req.body.treeID }, {
                $push: {
                    bannedUsers: req.body.userToBan,
                }
            }).then(() => {
                Tree.findOneAndUpdate({ _id: req.body.treeID }, {
                    $inc: {
                        numberOfPeople: 0
                    }
                }).then(() => {

                    User.findEmailByUsername(req.body.userToBan).then((email) => {
                        var emailSubject = "Rooted: You\'ve Been Banned in \"" + tre.treeName + "\"!"
                        var addedToTreeBody = "Dear " + req.body.userToBan +
                            ",\n\nYou have been banned by one of the admins of " + tre.founder + "\'s tree \"" + tre.treeName + "\". View your profile for more details.\n\n" +
                            "Sincerely, \n\nThe Rooted Team";

                        mailer(email, emailSubject, addedToTreeBody);

                        res.status(200).send({ message: req.body.userToBan + " has been banned." })
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


/**
* Unban a user
*/
router.post('/unban-user', authenticate, (req, res) => {

    if (!req.body.userToUnban || !req.body.treeID) {
        res.status(400).send("Bad request")
        return;
    }


    Tree.findById(req.body.treeID, (err, tre) => {

        if (err) {
            res.status(400).send({ message: "Tree does not exist" })
            return;
        }

        if (!tre.admins.includes(req.user.username)) {
            res.status(401).send({ message: "Not authorized to make changes" });
            return;
        }

        // can't find user to unban in banned users
        if (!tre.bannedUsers.includes(req.body.userToUnban)) {
            res.status(400).send({ message: "User is not banned" });
            return;
        }

        User.findOne({ username: req.body.userToUnban }).then((user) => {

            if (!user) {
                res.status(400).send({ message: "Username does not exist" });
                return;
            }

            Tree.findOneAndUpdate({ _id: req.body.treeID }, {
                $pull: {
                    bannedUsers: req.body.userToUnban,
                }
            }).then(() => {

                User.findEmailByUsername(req.body.userToUnban).then((email) => {
                    var emailSubject = "Rooted: You\'ve Been Unbanned in \"" + tre.treeName + "\"!"
                    var addedToTreeBody = "Dear " + req.body.userToUnban +
                        ",\n\nYou have been unbanned by one of the admins of " + tre.founder + "\'s tree \"" + tre.treeName + "\". View your profile for more details.\n\n" +
                        "Sincerely, \n\nThe Rooted Team";

                    mailer(email, emailSubject, addedToTreeBody);

                    res.status(200).send({ message: req.body.userToUnban + " has been unbanned." })
                })

                return;
            }).catch((err) => {
                console.log(err)
                res.status(400).send({ message: "issue" });
                return;
            })
        }).catch((err) => {
            console.log(err)
            res.status(400).send({ message: "issue2" });
            return;
        })
    }).catch((err) => {
        console.log(err)
        res.status(400).send({ message: "issue3" });
        return;
    })

})


/**
* Display banned users
*/
router.get("/display-banned-users", authenticate, (req, res) => {
    if (!req.body || !req.headers.treeID) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    Tree.findById(req.headers.treeID, (err, tre) => {
        res.status(200).send(tre.bannedUsers)
    }).catch((err) => {
        res.status(400).send({ message: "Could not find tree" });
        return;
    })


})


/**
*   Get report a user
*/
router.post('/report-user', authenticate, (req, res) => {

    //ensure that request has body and has treeID
    //if not, send bad request
    if (!req.headers.treeid || !req.body.userToReport || !req.body.reason) {
        // console.log(req.headers)
        res.status(400).send({ message: "Bad request" });
        return;
    }

    Tree.findOneAndUpdate({ _id: req.headers.treeid },
        {
            $push: {
                reportedUsers: {
                    user: req.body.userToReport,
                    reason: req.body.reason,
                }
            }
        }).then((tre) => {
            if (tre == null) {
                res.status(400).send({ message: "Something went wrong" });
                return;
            }
            res.status(200).send({ message: "Reported " + req.body.userToReport });
            return;
        }).catch((err) => {
            console.log(err)
            res.status(400).send({ message: "Something went wrong" });
            return;
        })
})


/**
* Get report a tree/group
*/
router.post('/report-tree', authenticate, (req, res) => {
    //ensure that request has body and has treeID
    //if not, send bad request
    if (!req.headers.treeid || !req.body.reporter || !req.body.reason || !req.body.treeName) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    var report = {
        treeID: req.header.treeid,
        treeName: req.body.treeName,
        reason: req.body.reason,
        reporter: req.body.reporter
    };

    Admin.find({}, function (err, docs) {
        if (!err && docs) {
            console.log(docs[0].reportedTrees);
            docs[0].reportedTrees.push(report)
            docs[0].save().then(() => {
                res.status(200).send({ message: "Saved" });
                return;
            }).catch((err) => {
                res.status(400).send({ message: "Could not save" });
                return;
            })
        }
        else {
            res.status(400).send({ message: "Could not find table" });
            return;
        }
    });
})


/**
 * Get all trees
 */
router.get("/get-all-trees", authenticate, (req, res) => {
    Tree.find({}).then((tree) => {
        res.send(tree);
    }).catch((err) => {
        res.status(400).send(err);
    })
})


/**
 * Set tree to be private or public
 */
router.post("/set-private-status", authenticate, (req, res) => {
    if (!req.body.treeID || req.body.private == null) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    Tree.findByIdAndUpdate({ _id: req.body.treeID },
        {
            $set: {
                privateStatus: req.body.private
            }
        }).then(() => {
            res.status(200).send({ message: 'Tree private status updated!' })
            return;
        }).catch((err) => {
            res.status(400).send(err);
            return;
        })
})


/**
 * Invites a user to a tree
 */
router.post("/invite-user", authenticate, (req, res) => {
    if (!req.body.treeID || !req.body.username) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    // Find tree to invite the user to
    Tree.findById(req.body.treeID, (err, tre) => {

        if (err) {
            res.status(400).send({ message: "Fatal Error" });
            return;
        }

        // Check if there was no tree found
        if (tre == null) {
            res.status(400).send({ message: "Tree does not exist" });
            return;
        }

        // Check if the user has been requested
        /*        if (!tre.memberRequestedUsers.includes(req.body.username)) {
                    res.status(400).send({ message: "User has not been requested" });
                    return;
                }*/

        // Remove user from memberRequestedUsers
        var n = tre.memberRequestedUsers.indexOf(req.body.username);
        tre.memberRequestedUsers.splice(n, 1)

        // Add user to pendingUsers
        //  tre.pendingUsers.push(req.body.username)

        // Save changes to tree
        tre.save()

        // Send notification to user that they have been added to a tree
        User.findOneAndUpdate({ username: req.body.username }, {
            $push: {
                notifications: {
                    sender: tre.treeName,
                    nType: "Invitation",
                    body: "You've Been Invited to " + tre.treeName + "!",
                    meta: tre._id
                }
            }
        }).then((usr) => {
            if (!usr) {
                res.status(400).send({ message: "User does not exist" });
                return;
            }
            else {
                res.status(200).send({ message: "User has been successfully sent an invitation!" });
                return;
            }
        }).catch((err) => {
            console.log(err)
            res.status(400).send({ message: "Fatal Error" });
            return;
        })
    })
})


/**
 * Decline user requested addition to a tree
 */
router.post("/decline-user-requested-invite", authenticate, (req, res) => {
    if (!req.body.treeID || !req.body.username) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    // Find tree
    Tree.findById(req.body.treeID, (err, tre) => {

        if (err) {
            res.status(400).send({ message: "Cannot find tree" });
            return;
        }

        // Check if there was no tree found
        if (tre == null) {
            res.status(400).send({ message: "Tree does not exist" });
            return;
        }

        // Check if the user has been requested
        if (!tre.memberRequestedUsers.includes(req.body.username)) {
            res.status(400).send({ message: "User has not been requested" });
            return;
        }

        // Remove user from memberRequestedUsers
        var n = tre.memberRequestedUsers.indexOf(req.body.username);
        tre.memberRequestedUsers.splice(n, 1)

        // Save changes to tree
        tre.save()

        res.status(200).send({ message: "User has been successfully rejected and removed from potential invites" });
        return;
    })
})


/**
 * Member requests an admin to add a user
 */
router.post("/request-admin-to-add-user", authenticate, (req, res) => {
    if (!req.body.treeID || !req.body.username) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    // Find tree object
    Tree.findById(req.body.treeID, (err, tre) => {

        if (err) {
            res.status(400).send({ message: "Fatal Error" });
            return;
        }

        // Check if tree exists
        if (tre == null) {
            res.status(400).send({ message: "Tree does not exist" });
            return;
        }

        // Check if user is already in tree or if the user has already been requested / pending join
        if (tre.members.includes(req.body.username)) {
            res.status(400).send({ message: "User is already in tree" });
            return;
        }
        else if (tre.memberRequestedUsers.includes(req.body.username)) {
            res.status(400).send({ message: "User has already been requested" });
            return;
        }
        else if (tre.pendingUsers.includes(req.body.username)) {
            res.status(400).send({ message: "User has already been approved, waiting for them to join" });
            return;
        }

        // Find user and add to memberRequestedUsers
        User.findOne({ username: req.body.username }).then((user) => {

            if (!user) {
                res.status(400).send({ message: "Username does not exist. Check the spelling or invite user to join ooted by email." });
                return;
            }

            // Update tree
            Tree.findOneAndUpdate({ _id: req.body.treeID }, {
                $push: {
                    memberRequestedUsers: req.body.username,
                }
            }).then(() => {
                res.status(200).send({ message: req.body.username + " has been requested" });
                return;
            }).catch((err) => {
                res.status(400).send(err);
                return;
            })
        }).catch((err) => {
            res.status(400).send(err);
            return;
        })
    }).catch((err) => {
        res.status(400).send({ message: "Fatal Error" });
        return;
    })
})


/**
 * Get array of searched trees
 */
router.get("/search-tree", authenticate, (req, res) => {

    if (!req.headers.treename) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    console.log(req.headers.treename);

    Tree.find({ treeName: { "$regex": req.headers.treename, "$options": "i" } }).then((tree) => {
        if (!tree[0]) {
            res.status(400).send({ message: "No tree contains this phrase" });
            return;
        }

        res.status(200).send(tree);
        return;

    }).catch((err) => {
        res.status(400).send(err);
        return;
    })
})

/**
 * Remove a member from a tree
 */
router.post("/remove-member", authenticate, (req, res) => {
    if (!req.body || !req.body.username || !req.body.treeID) {
        res.status(400).send("Bad request")
        return
    }

    Tree.findById(req.body.treeID, (err, tre) => {
        if (err) {
            res.status(400).send({ message: "Tree does not exist" })
            return
        }

        if (!tre.admins.includes(req.user.username)) {
            res.status(401).send({ message: "Not authorized to make changes" })
            return
        }

        if (!tre.members.includes(req.body.username)) {
            res.status(400).send({ message: req.body.username + " is not in the tree." });
            return;
        }

        User.findOne({ username: req.body.username }).then((user) => {
            if (!user) {
                res.status(400).send({ message: "Username does not exist." })
                return
            }

            Tree.findOneAndUpdate({ _id: req.body.treeID }, {
                $pull: {
                    members: req.body.username,
                }
            }).then(() => {
                User.findEmailByUsername(req.body.username).then((email) => {
                    var emailSubject = "Rooted: You\'ve been removed from" + tre.treeName + "\"."
                    var addedToTreeBody = "Dear " + req.body.username +
                        ",\n\n" + "You have been removed from " + tre.treeName + "!\n\n" +
                        "Sincerely, \n\nThe Rooted Team";

                    mailer(email, emailSubject, addedToTreeBody);
                    res.status(200).send({ message: req.body.username + " has been removed from " + tre.treeName + "." });
                });
                return;
            }).catch((err) => {
                res.status(400).send(err);
                return;
            })
        }).catch((err) => {
            res.status(400).send(err);
            return;
        })


    })
})


/**
 * Add annoucements to the tree
 */
router.post("/add-annoucement", authenticate, (req, res) => {
    if (!req.body || !req.body.annoucement || !req.body.treeID) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    Tree.findById({ _id: req.body.treeID }).then((tree) => {
        if (!tree) {
            res.status(400).send({ message: "Tree does not exist" })
            return
        }
        if (!tree.members.includes(req.user.username)) {
            res.status(400).send({ message: "User does not exist in the tree" })
            return
        }

        //if user is not an admin
        if (!tree.admins.includes(req.user.username)) {
            Tree.findByIdAndUpdate((req.body.treeID), {
                $push: {
                    annoucements: {
                        user: req.user.username,
                        annoucement: req.body.annoucement,
                    }
                }
            }).then(() => {
                res.status(200).send({ message: "The annoucement has been added." });
                return;

            }).catch((err) => {
                console.log(err);
                res.status(400).send({ message: "Can't find tree 1" });
                return;
            })
        }
        else {
            Tree.findByIdAndUpdate((req.body.treeID), {
                $push: {
                    annoucements: {
                        user: req.user.username,
                        annoucement: req.body.annoucement,
                        approved: true,
                    }
                }
            }).then(() => {
                res.status(200).send({ message: "The annoucement has been added." });
                return;

            }).catch((err) => {
                console.log(err);
                res.status(400).send({ message: "Can't find tree 1" });
                return;
            })
        }
    }).catch((err) => {
        res.status(400).send({ message: "Can't find tree 2" });
        return;
    })
})

/**
 * Remove annoucements to the tree
 */
router.post("/remove-annoucement", authenticate, (req, res) => {
    if (!req.body || !req.body.annoucementID || !req.body.treeID) {
        res.status(400).send({ message: "Bad request" });
        return;
    }
    Tree.findById({ _id: req.body.treeID }).then((tree) => {
        if (!tree) {
            res.status(400).send({ message: "Tree does not exist" });
            return;
        }

        var found = false;

        tree.annoucements.forEach(element => {
            if (element._id == req.body.annoucementID) {
                found = true;
                var n = tree.annoucements.indexOf(element);
                tree.annoucements.splice(n, 1);
                tree.save();
                // res.status(200).send({ message: "Annoucement succesfully removed." });
                // return;
            }
        });

        if (found) {
            res.status(200).send({ message: "Annoucement succesfully removed." });
            return;
        }
        else {
            res.status(400).send({ message: "Annoucement could not be found." });
            return;
        }

    }).catch((err) => {
        res.status(400).send({ message: "Something went wrong." });
        return;
    })
})

/**
 * Approve annoucement of a tree
 */
router.post("/approve-annoucement", authenticate, (req, res) => {
    if (!req.body || !req.body.annoucementID || !req.body.treeID || req.body.status == null) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    Tree.findById({ _id: req.body.treeID }).then((tree) => {
        if (!tree) {
            res.status(400).send({ message: "Tree does not exists" })
            return
        }

        if (!tree.members.includes(req.user.username)) {
            res.status(400).send({ message: "User does not exist in the tree" })
            return
        }

        if (!tree.admins.includes(req.user.username)) {
            res.status(400).send({ message: "User is not authorized to approve or reject annoucements" })
            return
        }

        var found = false;
        var approved = false;

        tree.annoucements.forEach(element => {
            if (element._id == req.body.annoucementID) {
                if (req.body.status == true) { //if approve state is true
                    found = true;
                    approved = true;
                    var n = tree.annoucements.indexOf(element);
                    tree.annoucements[n].approved = true;
                    tree.save();

                }
                else {
                    found = true;
                    approved = false;
                    var n = tree.annoucements.indexOf(element);
                    tree.annoucements.splice(n, 1);
                    tree.save();
                }
            }
        })

        if (found && approved) {
            res.status(200).send({ message: "Annoucement has been approved." });
            return;
        }
        else if ((found) && approved == false) {
            res.status(200).send({ message: "Annoucement has been rejected." });
            return;
        }
        else {
            console.log("big error");
            res.status(400).send({ message: "Annoucement could not be found." });
            return;
        }

    }).catch((err) => {
        console.log(err);
        res.status(400).send({ message: "Something went wrong." });
        return;
    })


})


/**
 * Get all annoucements of a tree
 */
router.get("/get-annoucements", authenticate, (req, res) => {
    if (!req.headers.treeid) {
        res.status(400).send({ message: "Bad request" });
        return;
    }


    Tree.findById({ _id: req.headers.treeid }).then((tree) => {
        if (!tree) {
            res.status(400).send({ message: "Tree does not exist" });
            return;
        }

        res.status(200).send(tree.annoucements);
        return;

    }).catch((err) => {
        res.status(400).send({ message: "There's an issue." });
        return;
    })
})

/**
 * Display all anonymous messages
 */
router.get("/get-anonymous-messages", authenticate, (req, res) => {
    if (!req.headers.treeid) {
        res.status(400).send({ message: "Bad request" });
        return;
    }


    Tree.findById({ _id: req.headers.treeid }).then((tree) => {
        if (!tree) {
            res.status(400).send({ message: "Tree does not exist" });
            return;
        }

        // if the user is not a tree admin
        if (!tree.admins.includes(req.user.username)) {
            res.status(400).send({ message: "Must be a tree admin to view messages" });
            return;
        }

        res.status(200).send(tree.anonymousMessages);
        return;

    }).catch((err) => {
        res.status(400).send({ message: "There's an issue." });
        return;
    })
})

/**
 * Submit anonymous message to admin team
 */
router.post("/submit-anonymous-message", authenticate, (req, res) => {
    if (!req.body || !req.body.anonymousMessage || !req.body.treeID) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    Tree.findOne({ _id: req.body.treeID }).then((tree) => {

        if (!tree) {
            res.status(400).send({ message: "Tree does not exist" });
            return
        }

        if (!tree.members.includes(req.user.username)) {
            res.status(400).send({ message: "User does not exist in the tree" })
            return;
        }

        let admins = tree.admins;

        admins.forEach(admin => {
            User.findOneAndUpdate({ username: admin }, {
                $push: {
                    notifications: {
                        sender: tree.treeName,
                        nType: "Message",
                        body: req.body.anonymousMessage,
                        meta: tree._id
                    }
                }
            }).then((ad) => {
                console.log("sent")
            }).catch((err) => {
                console.log(err)
            });
        })

        Tree.findByIdAndUpdate((req.body.treeID), {
            $push: {
                anonymousMessages: {
                    message: req.body.anonymousMessage,
                }
            }
        }).then(() => {
            res.status(200).send({ message: "The anonymous message has been sent." });
            return;
        }).catch((err) => {
            res.status(400).send({ message: "An error as occured" });
            return;
        })
    }).catch((err) => {
        console.log(err)
        res.status(400).send({ message: "Fatal Error" });
        return;
    })
})

/**
 * Request a member that does not have an account
 */
router.post("/request-non-rooted", authenticate, async (req, res) => {
    if (!req.body.treeID || !req.body.name) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    // if email is included in the request bdy, set local variable email to the body email. Else, set to null
    let email = (req.body.email) ? (req.body.email) : (null);

    Tree.findOne({ _id: req.body.treeID }).then((t) => {


        if (!t) {
            res.status(400).send({ message: "Tree does not exist" });
            return
        }

        let nrm = {
            name: req.body.name,
            email: email,
            yearJoined: 2019,
            approved: false
        };

        if (t.admins.includes(req.user.username)) {
            nrm.approved = true;
        }
        else {
            let admins = t.admins;
            admins.forEach(admin => {
                User.findOneAndUpdate({ username: admin }, {
                    $push: {
                        notifications: {
                            sender: req.user.username,
                            nType: "nonRooted",
                            body: "Request to add " + req.body.name + " to " + t.treeName,
                            meta: t._id + ":" + req.body.name
                        }
                    }
                }).then((ad) => {
                    console.log("sent")
                }).catch((err) => {
                    console.log(err)
                });
            })
        }

        t.nonRootedMembers.push(nrm);

        t.save(function (err) {
            if (err) {
                res.status(400).send({ message: "Fatal Error" });
                return;
            }
            else {
                res.status(200).send({ message: "User Succesfully Requested" });
                return;
            }
        })
    });


    // Tree.findOneAndUpdate({ _id: req.body.treeID }, {
    //     $push: {
    //         nonRootedMembers: {
    //             name: req.body.name,
    //             email: email,
    //             yearJoined: 2019,
    //             approved: false
    //         }
    //     }
    // }).then((tre) => {
    //     if (!tre) {
    //         res.status(400).send({ message: "Tree does not exist" });
    //         return;
    //     }


    //     res.status(200).send({ message: "User has been successfully invited" });
    //     return;
    // }).catch((err) => {
    //     console.log(err)
    //     res.status(400).send({ message: "Fatal Error" });
    //     return;
    // })

    // if (email !== null) {
    //     var newInvitedUser = new InvitedUser({
    //         email: email,
    //         name: req.body.name,
    //         treeID: req.body.treeID
    //     });

    //     try {
    //         await newInvitedUser.save();
    //     } catch (err) {
    //         if (err.code === 11000) {
    //             res.status(400).send({ message: "Duplicate Person" })
    //             return;
    //         }
    //         else {
    //             res.status(400).send({ message: "Fatal Error: Invite User" })
    //             return;
    //         }
    //     }

    //     var newMemberInvite = "Dear " + req.body.name +
    //         ",\n\nOne of your friends has invited you to join Roooted! If you join using this email address, then you will automatically be added to "
    //         + " their group. We look forward to having you with us!\n\nSincerely, \nThe Rooted Team";
    //     var newMemberEmailSubject = "One of your friends has invited you to Rooted!";

    //     try {
    //         mailer(email, newMemberEmailSubject, newMemberInvite);
    //     } catch (err) {
    //         res.status(400).send({ message: "Fatal Error: Mailer" })
    //         return;
    //     }
    // }
})


/**
 * Change color scheme
 */
router.post('/change-color-scheme', authenticate, (req, res) => {
    if (!req.body || !req.body.hexValue || !req.body.treeID) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    Tree.findById(req.body.treeID, (err, tree) => {
        if (err || tree == null) {
            res.status(400).send({ message: "Tree does not exist" })
            return;
        }

        if (!tree.admins.includes(req.user.username)) {
            res.status(401).send({ message: "Not authorized to change tree color scheme." });
            return;
        }

        var regex = /^#[0-9A-F]{6}$/i;
        var isHex = regex.test(req.body.hexValue);

        if (isHex) {
            console.log("valid hex");
            Tree.findOneAndUpdate({ _id: req.body.treeID },
                {
                    $set: {
                        colorScheme: req.body.hexValue,
                    }
                }).then(() => {
                    res.status(200).send({ message: 'Color scheme of tree has been changed.' })
                    return
                }).catch((err) => {
                    res.send(err);
                    return
                })
        }
        else {
            console.log("invalid hex");
            res.status(400).send({ message: 'Hex value is invalid.' })
            return
        }

    }).catch((err) => {
        res.status(400).send({ message: "An error occurred" });
        return;
    })
})

/**
 * Get color scheme
 */
router.get('/color-scheme', authenticate, (req, res) => {
    if (!req.headers.treeid) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    Tree.findById(req.headers.treeid, (err, tree) => {
        if (err || tree == null) {
            res.status(400).send({ message: "Tree does not exist" })
            return;
        }

        res.status(200).send(tree.colorScheme);
        return

    }).catch((err) => {
        res.status(400).send({ message: "An error occurred" });
        return;
    })
})

/**
 * Edit involvement year
 */
router.post('/edit-involvement-year', authenticate, (req, res) => {
    if (!req.body || !req.body.treeID) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    Tree.findById({ _id: req.body.treeID }).then((tree) => {
        if (!tree) {
            res.status(400).send({ message: "Tree does not exist" })
            return
        }

        if (!tree.members.includes(req.user.username)) {
            res.status(400).send({ message: "User does not exist in the tree" })
            return
        }

        var found = false;

        tree.memberInvolvement.forEach(element => {
            if (req.user.username == element.user) {
                found = true;
                var n = tree.memberInvolvement.indexOf(element);
                if (req.body.yearStarted) {
                    tree.memberInvolvement[n].yearStarted = req.body.yearStarted;
                }
                if (req.body.yearEnded) {
                    tree.memberInvolvement[n].yearEnded = req.body.yearEnded;
                }
                tree.save();
            }
        })

        if (found) {
            res.status(200).send({ message: "Involvement years changed" });
            return;
        }
        else {
            res.status(200).send({ message: "Unable to find user." });
            return;
        }
    }).catch((err) => {
        res.status(400).send({ message: "An error has occured." });
        return;
    })
})


module.exports = router;

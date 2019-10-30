const mongoose = require('mongoose');

let treeSchema = new mongoose.Schema({
    founder: { type: String },
    members: { type: [String], unique: true},
    treeName: { type: String, required: true},
    dateCreated: { type: Date, default: Date.now },
    numberOfPeople: { type: Number, default: 1 },
    treePhotoLibraryImages: [{
        url: String,
        id: String
      }],
    chat: [{
        user: String,
        message: String,
    }],
    reportedUsers: [{
        user: String,
        reason: String,
    }],
    imageUrl: {type: String, default: process.env.DEFAULT_IMAGE},
    image_id: {type: String},
    hasImage: {type: Boolean, default: false},
    description: {type: String},
    admins: {type: [String]},
    privateStatus: {type: Boolean, default: false},
    bannedUsers: {type: [String]},
    memberRequestedUsers: {type: [String]},
    pendingUsers: {type: [String]},
    aboutBio: {type: String, default: "No bio created yet."},

})

/* Creating the user model from the schema and giving it to Mongoose */
let Tree = mongoose.model('Trees', treeSchema);

module.exports = Tree
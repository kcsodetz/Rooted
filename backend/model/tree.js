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
    annoucements: [{
        user: String,
        annoucement: String,
        datePosted: { type: Date, default: Date.now },
        approved: {type: Boolean, default: false},
    }],
    nonRootedMembers: [{
        name: String,
        email: {type: String, unique: true, required: false},
        yearJoined: {type: Number, default: 2019},
        approved: {type: Boolean, default: false}
    }],
    anonymousMessages: [{
        message: String,
        dateSent: { type: Date, default: Date.now },
        unread: {type: Boolean, default: true}
    }],

    colorScheme: {type: String, default: '#28a745'},
    memberInvolvement: [{
        user: String,
        yearStarted: {type: Number, default: Date.now },
        yearEnded: {type: Number, default: Date.now, required: false}
    }]
})

/* Creating the user model from the schema and giving it to Mongoose */
let Tree = mongoose.model('Trees', treeSchema);

module.exports = Tree
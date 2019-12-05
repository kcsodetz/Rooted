const mongoose = require('mongoose');

let invitedUserSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    name: String,
    treeID: String
});

/* Creating the user model from the schema and giving it to Mongoose */
let invitedUser = mongoose.model('invitedUsers', invitedUserSchema);

module.exports = invitedUser;
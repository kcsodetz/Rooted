const mongoose = require('mongoose');

let adminSchema = new mongoose.Schema({
    admins: {type: [String]},
    reportedTrees: [{
        treeID: String,
        treeName: String,
        reason: String,
        reporter: String
   }],
   bannedUsers: {type: [String]},
});

/* Creating the user model from the schema and giving it to Mongoose */
let Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
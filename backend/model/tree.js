const mongoose = require('mongoose');

let treeSchema = new mongoose.Schema({
    founder: { type: String },
    members: { type: [String] },
    treeName: { type: String, required: true},
    dateCreated: { type: Date, default: Date.now },
    numberOfPeople: { type: Number, default: 1 },
    chat: [{
        user: String,
        message: String,
    }],
    imageUrl: {type: String, default: process.env.DEFAULT_IMAGE},
    image_id: {type: String},
    hasImage: {type: Boolean, default: false},
    description: {type: String},
})


/* Creating the user model from the schema and giving it to Mongoose */
let Tree = mongoose.model('Trees', treeSchema);

module.exports = Tree
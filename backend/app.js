const express = require('express')
let cookieParser = require('cookie-parser');
var cors = require('cors');
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
require('dotenv').config();

/* Routes */
let user = require('./routes/users.js'); 
let tree = require('./routes/tree.js');  
let admin = require('./routes/admin.js'); 

const app = express(cors());

/* Parsers */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Access Headers */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, token, Origin, X-Requested-With, Content-Type, Accept, treeid, treeID, username, profilePictureURL, treename");

    res.header("Access-Control-Expose-Headers", "token");
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

/* Routes */
app.use('/user', user);
app.use('/tree', tree);
app.use('/admin', admin);


app.get('/', (res, req) => {
});

app.listen(process.env.PORT, () => {
    console.log('The application is running on localhost:' + process.env.PORT)
});

module.exports = app;
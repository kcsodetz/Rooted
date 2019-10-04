const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const ld = require('lodash');
const vdator = require('validator');
const bcrypt = require('bcrypt');

let userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minlength: 6, trim: true },
  password: { type: String, required: true, minlength: 8 },
  verified: Boolean,
  verificationNum: { type: Number, default: 0 },
  images: [{
    imageUrl: String,
    id: String
  }],
  email: {
    properties:{
      value:{
        type: String,
        unique: true,
        validate: {
          validator: vdator.isEmail,
          message: '{VALUE} is not a valid email'
        }
      }, 
      hidden:{
        type:Boolean,
        default:false
      }
    }
  }, 
  birthYear: {
    properties:{
      value:{
        type: Number
      },
      hidden:{
        type:Boolean,
        default:false
      }
    }
  },
  phoneNumber: {
    properties:{
      value:{
        type: String,
      },
      hidden:{
        type:Boolean,
        default:false
      }
    }
  },
  facebook:{
    properties:{
      value:{
        type: String,
      },
      hidden:{
        type:Boolean,
        default:false
      }
    }
  },
  instagram:{
    properties:{
      value:{
        type: String,
      },
      hidden:{
        type:Boolean,
        default:false
      }
    }
  },
  twitter:{
    properties:{
      value:{
        type: String,
      },
      hidden:{
        type:Boolean,
        default:false
      }
    }
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: [{
      type: String,
      require: true
    }]
  }]
})

userSchema.methods.generateAuth = function () {
  var user = this
  var access = 'auth'

  var token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET, { expiresIn: "10h" }).toString()
  user.tokens = user.tokens.concat([{ access, token }]);
  return user.save().then(() => {
    return token
  })
}

userSchema.statics.findByToken = function (token) {
  var User = this
  var decodedTokenObj;

  try {
    decodedTokenObj = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return Promise.reject();
  }

  return User.findOne({
    _id: decodedTokenObj._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

userSchema.statics.findVerificationNumByEmail = function(email) {
  var User = this;

  return User.findOne({email}).then((user) => {
 //   console.log(user.verificationNum)
    if (!user.verificationNum) {
      return Promise.reject();
    }
    else {
      return Promise.resolve(user.verificationNum);
    }
  });
};

userSchema.statics.findByEmail = function(email) {
  var User = this;

  return User.findOne({email}).then((user) => {
    // console.log(user)
    //console.log("email is: " + user.email)
    if (user == null || !user.email) {
      return Promise.reject();
    }
    else {
      return Promise.resolve(user);
    }
  });
};

userSchema.statics.findEmailByUsername = function(username) {
  var User = this;

  return User.findOne({username}).then((user) => {
    // console.log(user)
    //console.log("email is: " + user.email)
    if (user == null || !user.email) {
      return Promise.reject();
    }
    else {
      return Promise.resolve(user.email);
    }
  });
};

userSchema.statics.findByUsername = function(username) {
  var User = this;

  return User.findOne({username}).then((user) => {
    if (user == null) {
      return Promise.reject();
    }
    else {
      return Promise.resolve(user);
    }
  });
};




/* Function to prevent too much information from being returned on request when the response is the object */
userSchema.methods.toJSON = function () {
  return ld.pick(this.toObject(), ['_id', 'username', 'email', 'verified'])
}

/* Creating the user model from the schema and giving it to Mongoose */
let User = mongoose.model('User', userSchema);

module.exports = User;
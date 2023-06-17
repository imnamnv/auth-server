const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

// Define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true }, // check unique and uppercase and lowercase
  password: String,
});

// On Save Hook, encrypt password
// Before save a model, run this function
userSchema.pre("save", function (next) {
  // get access to the user model
  const user = this; // can get user's information by user.email, user.password

  // Generate a salt then run the callback
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }

    // hash (encrypt) ourpassword using the salt; using function syntax, not arrow function because of "this"
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err);
      }

      // overwite plain text password with encrypted password
      user.password = hash;

      next();
    });
  });
});

// "Like: add methods for user"
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

// Create the model class
const ModelClass = mongoose.model("user", userSchema);

// Export the model
module.exports = ModelClass;

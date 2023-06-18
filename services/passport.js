//check user logged in or not before the request go to the Controller
const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local");

// Create local strategy to VERIFY USERNAME/PASSWORD
const localOptions = { usernameField: "email" }; // get the email to verify, and password by default
const localLogin = new LocalStrategy(
  localOptions,
  async (email, password, done) => {
    // Verify this username and password, call done with the user
    // if it is the correct email and password
    // otherwise, call donr with false
    try {
      const user = await User.findOne({ email });
      if (!user) {
        done(null, false);
      }

      //compare passwords - is 'password' equal to user.password?
      user.comparePassword(password, function (err, isMatch) {
        if (err) {
          return done(err);
        }

        if (!isMatch) {
          return done(null, false); // no error, but can not find user
        }

        return done(null, user); // no error,can find the user
      });
    } catch (error) {
      return done(error);
    }
  }
);

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"), // look the jwt from authorization's header,
  secretOrKey: config.secretKey, // using this key to decrypt
};
// Create JWT Strategy to VERIFY TOKEN
const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  // See if the user ID in the payload exist (payload: {sub, iat} that we created in tokenForUser function in authentication controller, we decrypt the token to payload) in our database
  // If it does, call 'done' with that other
  // Otherwise, call done withour a user object

  const user = await User.findById(payload.sub);
  try {
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    return done(err, false); //false mean can not found user
  }
});

// Tell passport to use the Strategy
passport.use(jwtLogin);
passport.use(localLogin);

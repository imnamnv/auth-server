const User = require("../models/user");
const jwt = require("jwt-simple");
const config = require("../config");

function tokenForUser(user) {
  const timestamp = new Date().getTime();

  return jwt.encode({ sub: user.id, iat: timestamp }, config.secretKey); //issue at time
}

exports.signin = function (req, res, next) {
  // User has already had their email and password auth's
  // We just need to five them a token
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("email", email);

  if (!email || !password) {
    res.status(422).send({ error: "You must provide email and password" });
  }

  // See if a user with the given email exists
  try {
    const existingUser = await User.findOne({ email });

    // If a user with email does exist. return an error
    if (existingUser) {
      return res.status(422).send({ error: "Email is in use" });
    }
  } catch (err) {
    return next(err);
  }

  // If a user with email does NOT exist, create and save user record
  const user = new User({
    email,
    password,
  });
  try {
    await user.save();
    // Respond to request indicating the user was created
    res.json({ token: tokenForUser(user) });
  } catch (error) {
    return next(error);
  }
};

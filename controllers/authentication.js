const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;

  // See if a user with the given email exists
  try {
    const existingUser = await User.findOne();
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
    res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

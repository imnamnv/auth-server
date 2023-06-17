const Authentication = require("./controllers/authentication");
const passport = require("passport");

//create a middleware
const requireAuth = passport.authenticate("jwt", { session: false }); // don't want to create a sesstion by default
const requireSignin = passport.authenticate("local", { session: false });

module.exports = function (app) {
  app.get("/", requireAuth, (req, res) => {
    res.send({ hi: "there" });
  });
  app.post("/signin", requireSignin, Authentication.signin);
  app.post("/signup", Authentication.signup);
};

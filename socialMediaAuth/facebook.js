const passport = require("passport");
const FacebookStrategy = require("passport-facebook");

const facebookAuth = () => {
  const facebookStrategy = new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_REDIRECT_URI,
    },
    (accessToken, refreshToken, profile, callback) => {
      console.log({ accessToken, refreshToken, profile });
      callback(null, profile);
    }
  );
  passport.use(facebookStrategy);
};

module.exports = facebookAuth;

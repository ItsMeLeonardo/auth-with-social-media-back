const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const User = require("../models/User");

const facebookAuth = () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  const facebookStrategy = new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${process.env.HOST}/api/auth/facebook/callback`,
      profileFields: ["email", "displayName", "picture"],
    },
    async (token, refreshToken, profile, callback) => {
      const { name, email, picture } = profile._json;

      let user = await User.findOne({ email });

      if (!user) {
        const userFromFacebook = {
          name,
          email,
          avatar: picture.data.url,
        };
        user = await User.create(userFromFacebook);
      }

      callback(null, user);
    }
  );
  passport.use(facebookStrategy);
};

module.exports = facebookAuth;

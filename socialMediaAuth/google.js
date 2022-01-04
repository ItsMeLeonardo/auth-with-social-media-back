const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../models/User");

const googleAuth = () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  const googleStrategy = new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.HOST}/api/auth/google/callback`,
    },
    async (token, refreshToken, profile, callback) => {
      const { name, picture, email } = profile._json;
      let user = await User.findOne({ email });

      if (!user) {
        const userFromGoogle = { name, avatar: picture, email };
        user = await User.create(userFromGoogle);
      }

      callback(null, user);
    }
  );

  passport.use(googleStrategy);
};

module.exports = googleAuth;

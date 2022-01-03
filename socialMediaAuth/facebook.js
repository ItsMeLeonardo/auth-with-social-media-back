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
      // TODO: Change to production
      callbackURL: "http://localhost:5000/api/auth/facebook/callback",
      profileFields: ["email", "displayName", "picture"],
    },
    async (accessToken, refreshToken, profile, callback) => {
      const { name, email, picture } = profile._json;

      const userFromFacebook = {
        name,
        email,
        avatar: picture.data.url,
        username: email.slice(0, 20),
      };

      await User.findOneAndUpdate(
        { email },
        { ...userFromFacebook },
        { upsert: true }
      );

      callback(null, profile);
    }
  );
  passport.use(facebookStrategy);
};

module.exports = facebookAuth;

const passport = require("passport");
const TwitterStrategy = require("passport-twitter");
const User = require("../models/User");

const twitterAuth = () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
  const twitterStrategy = new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: `${process.env.HOST}/api/auth/twitter/callback`,
      includeEmail: true,
    },
    async (token, tokenSecret, profile, callback) => {
      const { name, profile_image_url_https, email } = profile._json;

      const userFromTwitter = { name, email, avatar: profile_image_url_https };

      const user = await User.findOneAndUpdate(
        { email },
        { ...userFromTwitter },
        { new: true, upsert: true }
      );
      callback(null, user);
    }
  );

  passport.use(twitterStrategy);
};

module.exports = twitterAuth;

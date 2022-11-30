var passport = require('passport');
var GithubStrategy = require('passport-github2').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var User = require('../models/User');

//github
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: '/users/auth/github/callback',
      scope: ['user:email'],
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log(profile);
      var profileData = {
        name: profile.displayName,
        username: profile.username,
        email: profile.emails[0].value,
        verified: true,
      };
      User.findOne({ email: profile.emails[0].value }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          User.create(profileData, (err, addedUser) => {
            if (err) return done(err);
            done(null, addedUser);
          });
        } else {
          done(null, user);
        }
      });
    }
  )
);
//google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://yourdomain:3000/auth/google/callback',
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      var profileData = {
        name: profile.displayName,
      };
      console.log(profile);
    }
  )
);

//serialize & deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

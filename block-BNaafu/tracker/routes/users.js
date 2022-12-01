var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Source = require('../models/Source');
var auth = require('../middlewares/info');
var url = require('url');
var { transporter, mailOptions } = require('../middlewares/mailer');
var passport = require('passport');

//register & login page
router.get('/login', (req, res) => {
  res.render('login', { error: req.flash('error') });
});
router.get('/signup', (req, res) => {
  res.render('signup');
});

// info verify and save
router.post('/signup', (req, res, next) => {
  var { password, confirmPass } = req.body;
  if (password === confirmPass) {
    //create invokes pre save
    req.body.verified = false;
    User.create(req.body, (err, user) => {
      if (err) return next(err);
      mailOptions.to = user.email;
      mailOptions.text = `Please verify Using the given link
          http://${req.hostname}:3000/users/verify?userId=${user.id}`;
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      return res.render('login', { error: req.flash('error')[0] });
      // , {
      //   note: `Please login from here after verifying your email through link sent!!`,
      // }
    });
  } else {
    //update with connect flash later
    res.redirect('back');
  }
});
router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Email and Password are required');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', 'Email not Found');
      return res.redirect('back');
    }
    if (!user.verified) {
      req.flash('error', 'Check your Inbox to verify Email address');
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'Incorrect Password');
        return res.redirect('back');
      }
      req.session.userId = user.id;
      res.redirect('/users/success');
    });
  });
});
//make verified true
router.get('/verify', (req, res, next) => {
  let userId = url.parse(req.url).search.split('=')[1];
  User.findById(userId, 'verified', (err, user) => {
    if (err) return next(err);
    if (!user.verified) {
      User.findByIdAndUpdate(
        userId,
        { verified: true },
        { new: true },
        (err, updatedUser) => {
          if (err) return next(err);
          res.setHeader('content-Type', 'text/html');
          return res.send(
            `<span> Email Verified Successfully. Continue with your login </span>`
          );
        }
      );
    } else {
      res.setHeader('content-Type', 'text/html');
      return res.send(`<span> Email Already Verified. Continue Login.</span>`);
    }
  });
});
//dashboard //success
// router.get('/dashboard', auth.isUserLogged, (req, res, next) => {
//   res.render('dashboard');
// });
//Forgot Password
router.get('/resetPass', (req, res) => {
  res.render('email');
});
router.post('/resetPass', (req, res, next) => {
  var { email } = req.body;
  User.findOne({ email }, 'verified email', (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect('/users/signup');
    }
    console.log(user);
    mailOptions.to = user.email;
    mailOptions.text = `Please Reset Password Using the given link
          http://${req.hostname}:3000/users/confirmPass/${user.id}`;
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.send('Please check your Inbox');
  });
});
router.get('/confirmPass/:id', (req, res, next) => {
  res.render('password', { id: req.params.id });
});
router.post('/confirmPass/:id', (req, res, next) => {
  let userId = req.params.id;
  User.findByIdAndUpdate(
    userId,
    { password: req.body.password },
    { new: true },
    (err, updatedUser) => {
      if (err) return next(err);
      updatedUser.save();
      res.redirect('/users/login');
    }
  );
});

//passport
router.get('/success', auth.isUserLogged, (req, res, next) => {
  Source.aggregate(
    [{ $group: { _id: req.user.id, amount: { $sum: '$amount' } } }],
    (err, result) => {
      if (err) return next(err);
      res.render('dashboard', { result: result[0].amount });
    }
  );
});
router.get('/failure', (req, res) => {
  res.render('signup');
});
//passport-github
router.get('/auth/github', passport.authenticate('github'));
router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/users/failure' }),
  function (req, res) {
    res.redirect('/users/success');
  }
);
//passport-google
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/users/success',
    failureRedirect: '/users/auth/google/failure',
  })
);
module.exports = router;

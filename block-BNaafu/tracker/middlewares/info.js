var User = require('../models/User');
module.exports = {
  isUserLogged: (req, res, next) => {
    let valid = req.session && req.session.userId;
    //update according to passport success get routes
    if (!valid) {
      valid = req.session && req.session.passport.user;
    }

    if (valid) {
      next();
    } else {
      res.redirect('/users/login');
    }
  },
  userInfo: (req, res, next) => {
    var userId;
    try {
      userId =
        (req.session && req.session.userId) ||
        (req.session && req.session.passport.user);
    } catch (error) {
      userId = req.session && req.session.userId;
    }

    if (userId) {
      User.findById(userId, 'name email', (err, user) => {
        if (err) return next(err);
        req.user = user;
        res.locals.user = user;
        next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  },
};

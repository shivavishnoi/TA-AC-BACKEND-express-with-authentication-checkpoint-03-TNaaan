var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

//logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('session.sid');
  res.redirect('/users/login');
});
module.exports = router;

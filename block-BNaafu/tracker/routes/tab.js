var express = require('express');
var router = express.Router();
var Source = require('../models/Source');
var Expense = require('../models/Expense');

//add source
router.post('/sources/add/:id', (req, res, next) => {
  req.body.userId = req.user.id;
  Source.create(req.body, (err, source) => {
    if (err) return next(err);
    res.redirect('/users/success');
  });
});

//add expense
router.post('/expenses/add/:id', (req, res, next) => {
  req.body.userId = req.user.id;
  Expense.create(req.body, (err, expense) => {
    if (err) return next(err);
    res.redirect('/users/success');
  });
});

//detailed logs
router.get('/logs', (req, res) => {
  res.render('logs');
});
module.exports = router;

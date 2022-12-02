var express = require('express');
var router = express.Router();
var Source = require('../models/Source');
var Expense = require('../models/Expense');
var url = require('url');
const { default: mongoose } = require('mongoose');

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
//add amount
function addAmt(arr) {
  let savings = 0;
  arr.forEach((elm) => {
    savings = savings + elm.amount;
    // console.log(savings);
  });
  return savings;
}
//detailed logs
router.get('/logs', (req, res, next) => {
  Source.aggregate(
    [{ $match: { userId: mongoose.Types.ObjectId(req.user.id) } }],
    (err, sources) => {
      if (err) return next(err);
      let totalIncome = addAmt(sources);
      Expense.aggregate(
        [{ $match: { userId: mongoose.Types.ObjectId(req.user.id) } }],
        (err, expenses) => {
          if (err) return next(err);
          let totalExpense = addAmt(expenses);
          res.render('logs', {
            sources,
            expenses,
            savings: totalIncome - totalExpense,
          });
        }
      );
    }
  );
});
//filters
router.post('/logs/filter', (req, res, next) => {
  //filter bY Date

  if (url.parse(req.url).query.split('=')[1] == 'date') {
    Source.aggregate(
      [
        { $match: { userId: mongoose.Types.ObjectId(req.user.id) } },
        { $match: { date: { $gte: new Date(req.body.startDate) } } },
        { $match: { date: { $lte: new Date(req.body.endDate) } } },
      ],
      (err, sources) => {
        if (err) return next(err);
        let totalIncome = addAmt(sources);
        Expense.aggregate(
          [
            { $match: { userId: mongoose.Types.ObjectId(req.user.id) } },
            { $match: { date: { $gte: new Date(req.body.startDate) } } },
            { $match: { date: { $lte: new Date(req.body.endDate) } } },
          ],
          (err, expenses) => {
            if (err) return next(err);
            let totalExpense = addAmt(expenses);
            res.render('logs', {
              sources,
              expenses,
              savings: totalIncome - totalExpense,
            });
          }
        );
      }
    );
  }
});

module.exports = router;

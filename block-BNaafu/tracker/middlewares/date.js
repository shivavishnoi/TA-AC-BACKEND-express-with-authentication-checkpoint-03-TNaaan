//start date and ending date of current month
var date = new Date();
let month = date.getMonth() + 1;
let year = date.getFullYear();

var startDate = year + '-' + month + '-' + 01;
var lastDate = String(new Date(date.getFullYear(), date.getMonth() + 1, 0));

lastDate =
  year + '-' + month + '-' + lastDate.toString().split(' ').splice(2, 3)[0];

module.exports = { startDate, lastDate };

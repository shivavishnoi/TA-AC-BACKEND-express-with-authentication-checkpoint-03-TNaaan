var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shivavishnoi.vishnoi@gmail.com',
    pass: process.env.MAIL_PASS,
  },
});
var mailOptions = {
  from: 'shivavishnoi.vishnoi@gmail.com',
  // to: 'lesiba1094@sunetoa.com',
  subject: 'Please verify your email address',
  // text: 'That was easy!',
};
module.exports = { transporter, mailOptions };

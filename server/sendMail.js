const nodemailer = require('nodemailer')
require('dotenv').config()

const sendMail = (user, data) => {
    console.log("here",process.env.user);
    
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.user,
      pass: process.env.pass,
      clientId: process.env.clientId,
      clientSecret: process.env.clientSecret,
      refreshToken: process.env.refreshToken
    }
  });
  
  let mailOptions = {
    from: process.env.user,
    to: user.email,
    subject: 'Vaccin Slot Details',
    text: JSON.stringify(data)
  };

  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
}

module.exports=sendMail
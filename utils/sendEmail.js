const nodemailer = require("nodemailer");
const SMTPConnection = require("nodemailer/lib/smtp-connection");

const sendEmail = async (options) => {
  //1- create transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: "ibapizkdsbppkbfl",
    },
  });
  //2- Define email options
  console.log(`options : ${options.email}`);
  const someOption = {
    from: "ALI HAMOUD APP <eng.ali10203@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3-send email
  transporter.sendMail(someOption, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
};

module.exports = sendEmail;

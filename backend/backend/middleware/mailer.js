var nodemailer = require('nodemailer');

var email_address = "rootedcs407@gmail.com"

/**
 * Sends an email from rootedcs407@gmail.com to the specified 'to' email, with a subject and body given by the 
 * function caller.
 * @param {string} to 
 * @param {string} subject 
 * @param {string} body 
 */
function mailer(to, subject, body) {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: email_address,
            pass: process.env.EMAIL_PASS
        }
    });

    var mailOptions = {
        from: email_address,
        to: to,
        subject: subject,
        text: body
    };

   
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        } else {
            // console.log('Email sent: ' + info.response);
            return;
        }
    });
}

module.exports = mailer;
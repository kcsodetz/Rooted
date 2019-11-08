var nodemailer = require('nodemailer');

var email_address = process.env.EMAIL_ADDRESS

/**
 * Sends an email from the .env address to the specified 'to' email, with a subject and body given by the 
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

    // verify connection configuration
    // console.log("Verifying...")
    transporter.verify(function(error, success) {
        if (error) {
             console.log(error);
        } else {
            // console.log('Server is ready to take our messages');
        }
    });

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
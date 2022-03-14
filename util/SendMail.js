const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async (email, Jwt, name) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });
    var mailOptions = {
        from: 'snapic.app.mail@gmail.com',
        to: email,
        subject: 'Snapic email verification',
        text: `Hi ${name},\n\nPlease verify your email by clicking the link: \nhttp://${process.env.APIURL}/api/user/verify/${Jwt}\n\n`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            return info.response;
        }
    });

}

module.exports = { sendMail } 
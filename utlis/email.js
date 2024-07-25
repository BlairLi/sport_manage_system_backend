import nodemailer from 'nodemailer';

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'live.smtp.mailtrap.io',
    port: 587,
    secure: false, // use SSL
    auth: {
        user: 'api',
        pass: 'ae97c9c002ebbcf12d62f1b5a4b66148',
    }
});

const sendMail = async (to, subject, html) => { 
    // Configure the mailoptions object
    const mailOptions = {
        from: 'admin@juniorathletics.ca',
        to: to,
        subject: subject,
        html: html
    };

    // Send the email
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log('Error:', error);
        } else {
        console.log('Email sent:', info.response);
        }
    });
};

export default sendMail;

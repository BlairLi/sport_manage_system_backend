import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'domghost666@gmail.com', // replace with your email
        pass: '5zaij1jike'   // replace with your email password or an app-specific password
    }
});

const sendEmail = (req, res) => {
    const { firstName, lastName, email, message } = req.body;

    const mailOptions = {
        from: email,
        to: 'domghost666@gmail.com',
        subject: 'Contact Form Submission',
        text: `Name: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
};

export { sendEmail }
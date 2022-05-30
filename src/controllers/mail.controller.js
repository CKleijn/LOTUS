const nodemailer = require("nodemailer");

exports.sendMemberInviteMail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAILING_HOST,
            secureConnection: false,
            port: 587,
            tls: {
                ciphers: "SSLv3",
            },
            auth: {
                user: process.env.MAILING_EMAIL,
                pass: process.env.MAILING_PASSWORD,
            },
        });

        let options = {
            from: process.env.MAILING_EMAIL,
            to: email,
            subject: subject,
            text: text,
        };

        await transporter.sendMail(options, (err, data) => {
            if (err) {
                throw err;
            } else {
                console.log("Sent: ", data.response);
            }
        });
    } catch (error) {
        console.log(error, "Email not sent");
    }
};

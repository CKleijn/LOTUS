const nodemailer = require("nodemailer");

exports.sendMemberInviteMail = async (email, password) => {
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
            subject: "LOTUS-Kring Here We Go logingegevens",
            html: `Goedendag,
            'U kunt inloggen met devolgende gegevens:'
            'E-mailadres: ${email}'
            'Wachtwoord: ${password}'
    
            'Met vriendelijke groet,'
            'Lotus-Kring Here We Go Team.'`,
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

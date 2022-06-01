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
            from: process.env.MAILING_EMAIL_FROM,
            to: email,
            subject: "Accountgegevens",
            html: "<!DOCTYPE html>" + "<html><head><title>Accoutgegevens</title>" + "</head><body><div>" + "<p>Hierbij jouw inloggegevens:</p>" + `<p>E-mailadres: ${email}<br>Wachtwoord: ${password}</p>` + "<p>Klik <a href='https://lotusherewego.herokuapp.com/login'>hier</a> om in te loggen</p>" + "<p>Met vriendelijke groet,<br>LOTUS-Kring Here We Go Team</p>" + "</div></body></html>",
        };

        await transporter.sendMail(options, (err, data) => {
            if (err) {
                throw err;
            } else {
                console.log("Email has been send!");
            }
        });
    } catch (error) {
        console.log(error, "Email did not send");
    }
};

const nodemailer = require("nodemailer");
const { userModel } = require("../models/user.model");
const User = userModel;

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
            html: "<!DOCTYPE html>" + "<html><head><title>Accountgegevens</title>" + "</head><body><div>" + "<p>Hierbij jouw inloggegevens:</p>" + `<p>E-mailadres: ${email}<br>Wachtwoord: ${password}</p>` + `<p>Klik <a href='${process.env.HOSTING_URL}/login'>hier</a> om in te loggen</p>` + "<p>Met vriendelijke groet,<br>LOTUS-Kring Here We Go Team</p>" + "</div></body></html>",
        };

        transporter.sendMail(options, (err, data) => {
            if (err) console.log(err);
        });

        return true;
    } catch (err) {
        return false;
    }
};

exports.notifyUserThroughMail = async (email, firstName, type, subject) => {
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

        let context = "";

        switch (type) {
            case "deleteAssignment":
                context = `<p>Goedendag ${firstName},</p> <p>Hierbij willen we je laten weten dat de coördinator jouw opdracht heeft verwijderd.</p>`;
                break;
            case "remindInvitedMember":
                context = `<p>Goedendag LOTUSslachtoffer,</p> <p>Vergeet niet jouw account te activeren d.m.v. de voorgaande email!</p>`;
                break;
        }

        let options = {
            from: process.env.MAILING_EMAIL_FROM,
            to: email,
            subject: subject,
            html: "<!DOCTYPE html>" + "<html><head><title>Accountgegevens</title>" + "</head><body><div>" + "<p>Goedendag LOTUSslachtoffer,</p>" + context + "<p>Met vriendelijke groet,<br>LOTUS-Kring Here We Go Team</p>" + "</div></body></html>",
        };

        transporter.sendMail(options, (err, data) => {
            if (err) console.log(err);
        });

        return true;
    } catch (err) {
        return false;
    }
};

exports.sendRecoveryMailWithLink = async (token, emailAddress) => {
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

        let context = `<p>Klik <a href="${process.env.HOSTING_URL}/user/forgot/password/reset?token=${token}">hier</a> om jouw wachtwoord te veranderen!</p>`;

        let options = {
            from: process.env.MAILING_EMAIL_FROM,
            to: emailAddress,
            subject: "Wachtwoord resetten",
            html: "<!DOCTYPE html>" + "<html><head><title>Wachtwoord vergeten</title>" + "</head><body><div>" + "<p>Beste gebruiker,</p>" + context + "<p>Met vriendelijke groet,<br>LOTUS-Kring Here We Go Team</p>" + "</div></body></html>",
        };

        transporter.sendMail(options, (err, data) => {
            if (err) console.log(err);
        });

        return true;
    } catch (err) {
        return false;
    }
};

exports.notifyCoordinatorRequest = async (req, res, requestType) => {
    try {
        const transporter = await nodemailer.createTransport({
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

        let context = "";

        switch (requestType) {
            case "createAssignment":
                context = req.session.user.firstName + " " + req.session.user.lastName + " wil een opdracht aanmaken.";
                break;
            case "updateAssignment":
                context = req.session.user.firstName + " " + req.session.user.lastName + " wil een opdracht bewerken.";
                break;
            case "deleteAssignment":
                context = req.session.user.firstName + " " + req.session.user.lastName + " wil een opdracht verwijderen.";
                break;
            case "cancelEnrollment":
                context = req.session.user.firstName + " " + req.session.user.lastName + " wil zich uitschrijven voor een opdracht.";
                break;
            case "enrollment":
                context = req.session.user.firstName + " " + req.session.user.lastName + " wil zich inschrijven voor een opdracht.";
                break;
        }

        let coordinatorData = await User.find({ roles: "coordinator" });
        coordinatorData = coordinatorData[0];

        let options = {
            from: process.env.MAILING_EMAIL_FROM,
            to: coordinatorData.emailAddress,
            subject: "Nieuw verzoek ontvangen",
            html: "<!DOCTYPE html>" + "<html><head><title>Nieuw verzoek</title>" + "</head><body><div>" + `<p>Beste ${coordinatorData.firstName},</p>` + `<p>${context}</p>` + `<p>Klik <a href='${process.env.HOSTING_URL}/request'>hier</a> om het verzoek af te handelen.</p>` + "<p>Met vriendelijke groet,<br>LOTUS-Kring Here We Go Team</p>" + "</div></body></html>",
        };

        await transporter.sendMail(options);

        return true;
    } catch (err) {
        return false;
    }
};

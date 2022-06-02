const User = require("./../models/user.model");
const bcrypt = require("bcrypt");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.EMAIL_SETUP_HASH);

exports.isLoggedIn = (req, res, next) => {
    const session = req.session;
    if (typeof session !== "undefined") {
        next();
    } else {
        res.redirect("/login");
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    const session = req.session;
    if (typeof session !== "undefined") {
        res.redirect("back");
    } else {
        next();
    }
};

exports.isCoordinator = (req, res, next) => {
    const session = req.session;

    if (session.roles === "coordinator") {
        next();
    } else {
        res.redirect("back");
    }
};

exports.isClient = (req, res, next) => {
    const session = req.session;

    if (session.roles === "client") {
        next();
    } else {
        res.redirect("back");
    }
};

exports.isMember = (req, res, next) => {
    const session = req.session;

    if (session.roles === "member") {
        next();
    } else {
        res.redirect("back");
    }
};

//Functionality for login
exports.login = (req, res) => {
    const { emailAddress, password } = req.body;

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (emailRegex.test(emailAddress)) {
        User.findOne({ emailAddress: emailAddress }, (err, user) => {
            if (err) throw err;

            if (user != null) {
                if (bcrypt.compareSync(password, user.password)) {
                    let firstLogin = false;

                    if (typeof user.lastLoginDate == "undefined") {
                        firstLogin = true;
                    }

                    if (firstLogin === true) {
                        const encryptedEmail = cryptr.encrypt(emailAddress);
                        res.redirect(`/member_setup?t=${encryptedEmail}`);
                    } else {
                        User.findOneAndUpdate({ _id: user._id }, { lastLoginDate: Date.now() }, { new: true }, (err, updatedUser) => {
                            if (err) throw err;
                            let session = req.session;
                            session.userid = updatedUser._id;
                            session.roles = updatedUser.roles[0];
                            session.firstname = updatedUser.firstName;
                            return res.redirect("/");
                        });
                    }
                } else {
                    res.render("login", { pageName: "Inloggen", err: "Ingevulde wachtwoord is onjuist!", oldMailValue: emailAddress });
                }
            } else {
                res.render("login", { pageName: "Inloggen", err: "Er bestaat geen gebruiker met deze e-mailadres!", oldMailValue: emailAddress });
            }
        });
    } else {
        res.render("login", { pageName: "Inloggen", err: "Ingevulde e-mailadres is niet geldig!", oldMailValue: emailAddress });
    }
};

exports.setupMember = (req, res) => {
    const { firstName, lastName, password, email } = req.body;
    const decryptedMail = cryptr.decrypt(email);

    const errors = {};
    const oldValues = {};
    errors.oldValues = oldValues;

    if (!firstName || firstName.length === 0) {
        errors.firstNameErr = "Voornaam is verplicht!";
    } else {
        oldValues.firstName = firstName;
    }

    if (!lastName || lastName.length === 0) {
        errors.lastNameErr = "Achternaam is verplicht!";
    } else {
        oldValues.lastName = lastName;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if (!password || lastName.password === 0) {
        errors.passwordErr = "Wachtwoord is verplicht!";
    } else if (!passwordRegex.test(password)) {
        errors.passwordErr = "Wachtwoord is niet sterk genoeg!";
    } else {
        oldValues.password = password;
    }

    if (typeof errors.firstNameErr != "undefined" || typeof errors.lastNameErr != "undefined" || typeof errors.passwordErr != "undefined") {
        res.render("member_setup", { pageName: "Accountgegevens", ...errors, email });
    } else {
        User.findOneAndUpdate({ emailAddress: decryptedMail }, { firstName, lastName, password: bcrypt.hashSync(password, bcrypt.genSaltSync()), lastLoginDate: Date.now() }, { new: true }, (err, updatedUser) => {
            res.redirect("/login");
        });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/login");
};

exports.getRegisterPage = (req, res) => {
    res.render("register", { pageName: "Registreren" });
};

exports.getLoginPage = (req, res) => {
    res.render("login", { pageName: "Inloggen", isCreated: req.flash("isCreated") });
};

exports.getSetupPage = (req, res) => {
    res.render("member_setup", { pageName: "Accountgegevens", errors: {}, email: req.query.t });
};

const User = require("./../models/user.model");
const bcrypt = require("bcrypt");

exports.isLoggedIn = (req, res, next) => {
    const session = req.session;
    if (session.userid && session.roles && session.firstname) {
        next();
    } else {
        res.redirect("/login");
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

                    User.findOneAndUpdate({ _id: user._id }, { lastLoginDate: Date.now() }, { new: true }, (err, updatedUser) => {
                        if (err) throw err;

                        if (firstLogin === true) {
                            return res.redirect("/member_setup");
                        } else {
                            let session = req.session;
                            session.userid = updatedUser._id;
                            session.roles = updatedUser.roles[0];
                            session.firstname = updatedUser.firstName;
                            return res.redirect("/");
                        }
                    });
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

exports.logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/login");
};

exports.getRegisterPage = (req, res) => {
    res.render("register", { pageName: "Registreren" });
};

exports.getLoginPage = (req, res) => {
    res.render("login", { pageName: "Inloggen" });
};

exports.getSetupPage = (req, res) => {
    res.render("member_setup", { pageName: "Accountgegevens instellen" });
};

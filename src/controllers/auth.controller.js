const { userModel } = require("./../models/user.model");
const bcrypt = require("bcrypt");
const Cryptr = require("cryptr");
const { update } = require("./../models/user.model");
const cryptr = new Cryptr(process.env.EMAIL_SETUP_HASH);

const Request = require("./../models/request.model");
const { request } = require("express");

const User = userModel;

exports.isLoggedIn = (req, res, next) => {
    const session = req.session;

    if (typeof session.user != "undefined") {
        next();
    } else {
        res.redirect("/login");
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    const session = req.session;
    if (typeof session.user != "undefined") {
        res.redirect("back");
    } else {
        next();
    }
};

exports.isCoordinator = (req, res, next) => {
    const session = req.session;

    if (session.user.roles === "coordinator") {
        next();
    } else {
        res.redirect("back");
    }
};

exports.isClient = (req, res, next) => {
    const session = req.session;

    if (session.user.roles === "client") {
        next();
    } else {
        res.redirect("back");
    }
};

exports.isMember = (req, res, next) => {
    const session = req.session;

    if (session.user.roles === "member") {
        next();
    } else {
        res.redirect("back");
    }
};

//Functionality for login
exports.login = (req, res) => {
    let { emailAddress, password } = req.body;
    emailAddress = emailAddress.toLowerCase();

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
                        res.redirect(`/register/setup?t=${encryptedEmail}`);
                    } else {
                        User.findOneAndUpdate({ _id: user._id }, { lastLoginDate: Date.now() }, { new: true }, (err, currentUser) => {
                            if (err) throw err;
                            let session = req.session;

                            if (currentUser.roles[0] == "client") {
                                session.user = {
                                    userId: currentUser._id,
                                    firstName: currentUser.firstName,
                                    lastName: currentUser.lastName,
                                    emailAddress: currentUser.emailAddress,
                                    street: currentUser.street,
                                    houseNumber: currentUser.houseNumber,
                                    houseNumberAddition: currentUser.houseNumberAddition,
                                    postalCode: currentUser.postalCode,
                                    town: currentUser.town,
                                    roles: currentUser.roles[0],
                                    createdDate: currentUser.createdDate,
                                    lastLoginDate: currentUser.lastLoginDate,
                                };
                                return res.redirect("/");
                            } else if (currentUser.roles[0] == "coordinator") {
                                (async () => {
                                    session.user = {
                                        userId: currentUser._id,
                                        firstName: currentUser.firstName,
                                        lastName: currentUser.lastName,
                                        emailAddress: currentUser.emailAddress,
                                        roles: currentUser.roles[0],
                                        createdDate: currentUser.createdDate,
                                        lastLoginDate: currentUser.lastLoginDate,
                                    };

                                    let requests = await Request.find({ status: "In behandeling" });
                                    let parsedRequests = [];

                                    if (requests.length === 0) {
                                        session.requests = parsedRequests;
                                        return res.redirect("/");
                                    } else {
                                        for (let i = 0; i < requests.length; i++) {
                                            let user = await User.find({ _id: requests[i].userId }, { _id: 0, firstName: 1 });

                                            const request = {
                                                ...requests[i]._doc,
                                                user: user[0],
                                            };

                                            parsedRequests.push(request);

                                            if (parsedRequests.length === requests.length || requests.length === 0) {
                                                session.requests = parsedRequests;
                                                return res.redirect("/");
                                            }
                                        }
                                    }
                                })();
                            } else {
                                session.user = {
                                    userId: currentUser._id,
                                    firstName: currentUser.firstName,
                                    lastName: currentUser.lastName,
                                    emailAddress: currentUser.emailAddress,
                                    roles: currentUser.roles[0],
                                    createdDate: currentUser.createdDate,
                                    lastLoginDate: currentUser.lastLoginDate,
                                };
                                return res.redirect("/");
                            }
                        });
                    }
                } else {
                    res.render("login", { pageName: "Inloggen", err: "Ingevulde wachtwoord is onjuist!", oldMailValue: emailAddress });
                }
            } else {
                res.render("login", { pageName: "Inloggen", err: "Er bestaat geen gebruiker met dit e-mailadres!", oldMailValue: emailAddress });
            }
        });
    } else {
        res.render("login", { pageName: "Inloggen", err: "Ingevulde e-mailadres is niet geldig!", oldMailValue: emailAddress });
    }
};

exports.setupMember = (req, res) => {
    const { firstName, lastName, password, confirmPassword, email } = req.body;
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

    if (!confirmPassword || confirmPassword.length === 0) {
        errors.confirmPasswordErr = "Bevestig wachtwoord is verplicht!";
    } else if (confirmPassword != password) {
        errors.confirmPasswordErr = "De wachtwoorden komen niet overeen!";
    }

    if (typeof errors.firstNameErr != "undefined" || typeof errors.lastNameErr != "undefined" || typeof errors.passwordErr != "undefined" || typeof errors.confirmPasswordErr != "undefined") {
        res.render("member_setup", { pageName: "Accountgegevens", session: req.session, ...errors, email });
    } else {
        User.findOneAndUpdate({ emailAddress: decryptedMail }, { firstName, lastName, password: bcrypt.hashSync(password, bcrypt.genSaltSync()), lastLoginDate: Date.now() }, { new: true }, (err, updatedUser) => {
            let session = req.session;
            session.user = {
                userId: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                emailAddress: updatedUser.emailAddress,
                roles: updatedUser.roles[0],
                createdDate: updatedUser.createdDate,
                lastLoginDate: updatedUser.lastLoginDate,
            };

            return res.redirect("/");
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

exports.getForgotPasswordPage = (req, res) => {
    res.render("forgot_password", { pageName: "Wachtwoord vergeten" });
};

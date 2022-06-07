const bcrypt = require("bcrypt");
const mongoose = require("./../../database/dbconnection");
const { sendMemberInviteMail } = require("./../controllers/mail.controller");
const userController = require("./../controllers/user.controller");
const User = require("./../models/user.model");
const passGenerator = require("generate-password");

// Functionality for creating an user
exports.createUser = (req, res) => {
    // Declare all variables out of req.body
    let { firstName, lastName, emailAddress, password } = req.body;
    emailAddress = emailAddress.toLowerCase();
    // Create new user object
    const user = new User({
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        password: password,
        roles: "client",
        lastLoginDate: Date.now(),
    });

    // Save user object in database and show errors if they exists
    user.save((err) => {
        if (err) {
            let errors = {};
            let oldValues = {};
            errors.oldValues = oldValues;

            if (err.keyValue != undefined) {
                if (err.keyValue.emailAddress == emailAddress) {
                    errors.emailAddressErr = "E-mailadres is al in gebruik!";
                }
            } else {
                if (err.errors.firstName) {
                    errors.firstNameErr = err.errors.firstName.properties.message;
                } else {
                    oldValues.firstName = firstName;
                }

                if (err.errors.lastName) {
                    errors.lastNameErr = err.errors.lastName.properties.message;
                } else {
                    oldValues.lastName = lastName;
                }

                if (err.errors.emailAddress) {
                    errors.emailAddressErr = err.errors.emailAddress.properties.message;
                } else {
                    oldValues.emailAddress = emailAddress;
                }

                if (err.errors.password) {
                    errors.passwordErr = err.errors.password.properties.message;
                } else {
                    oldValues.password = password;
                }
            }
            // Show the errors on the register page
            res.render("register", { pageName: "Registreren", ...errors });
        } else {
            (async () => {
                let user = await User.find({ emailAddress: emailAddress });
                user = user[0];

                let session = req.session;
                session.user = {
                    userId: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailAddress: user.emailAddress,
                    roles: user.roles[0],
                    createdDate: user.createdDate,
                    lastLoginDate: user.lastLoginDate,
                };

                return res.redirect("/");
            })();
        }
    });
};

// Functionality for getting user by email
exports.getUserByEmailAddress = async (req, res) => {
    try {
        return await User.find({ emailAddress: req.body.emailAddress }).exec();
    } catch (err) {
        throw err;
    }
};

// Functionality for getting user by id
exports.createMember = (req, res) => {
    (async () => {
        let emailAddress = req.body.emailAddress;
        emailAddress = emailAddress.toLowerCase();
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        const allUsers = await userController.getAllValidUsers();

        if (emailRegex.test(emailAddress)) {
            (async () => {
                const result = await this.getUserByEmailAddress(req, res);

                if (result.length === 0) {
                    const password = await insertMember(emailAddress);
                    const sendStatus = await sendMemberInviteMail(emailAddress, password);

                    if (sendStatus) {
                        console.log("Send");
                    } else {
                        console.log("Not send");
                    }

                    res.redirect("/user_overview");
                } else {
                    res.render("user_overview", { pageName: "Gebruikers", session: req.session.user, emailAddressErr: "Dit e-mailadres is al in gebruik!", allUsers });
                }
            })();
        } else {
            res.render("user_overview", { pageName: "Gebruikers", session: req.session.user, emailAddressErr: "Het ingevulde e-mailadres is ongeldig!", allUsers });
        }
    })();
};

const insertMember = async (emailAddress) => {
    const password = passGenerator.generate({ length: 10, numbers: true, uppercase: true, lowercase: true });

    const user = new User({
        firstName: "",
        lastName: "",
        emailAddress: emailAddress,
        password: password,
        roles: "member",
    });

    user.save({ validateBeforeSave: false });

    return password;
};

exports.getUserProfile = (req, res) => {
    res.render("user_profile", { pageName: "Mijn profiel", session: req.session.user });
};

exports.changeUserProfileDetails = (req, res) => {
    let { firstName, lastName, emailAddress, type } = req.body;
    emailAddress = emailAddress.toLowerCase();

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

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!emailAddress || emailAddress.length === 0) {
        errors.emailAddressErr = "E-mailadres is verplicht!";
    } else if (!emailRegex.test(emailAddress)) {
        errors.emailAddressErr = "Vul een geldig e-mailadres in!";
    } else {
        oldValues.emailAddress = emailAddress;
    }

    (async () => {
        const userExists = await User.findOne({ emailAddress: emailAddress, _id: { $ne: req.session.user.userId } }).lean();
        if (userExists) {
            delete oldValues.emailAddress;
            errors.emailAddressErr = "E-mailadres is al in gebruik!";
        }

        if (typeof errors.firstNameErr != "undefined" || typeof errors.lastNameErr != "undefined" || typeof errors.emailAddressErr != "undefined") {
            res.render("user_profile", { pageName: "Mijn profiel", session: req.session.user, ...errors, type });
        } else {
            (async () => {
                const user = req.session.user;
                await updateUserByEmail({ oldMail: user.emailAddress, firstName, lastName, emailAddress });
                user.firstName = firstName;
                user.lastName = lastName;
                user.emailAddress = emailAddress;
                return res.redirect("/user_profile");
            })();
        }
    })();
};

exports.changePassword = (req, res) => {
    const { currentPassword, newPassword, confirmPassword, type } = req.body;

    const errors = {};
    const oldValues = {};
    errors.oldValues = oldValues;

    (async () => {
        let oldPassword = await User.find({ _id: req.session.user.userId }, { _id: 0, password: 1 });
        oldPassword = oldPassword[0].password;

        if (!currentPassword || currentPassword.length === 0) {
            errors.currentPasswordErr = "Oude wachtwoord is verplicht!";
        } else if (!bcrypt.compareSync(currentPassword, oldPassword)) {
            errors.currentPasswordErr = "Het oude wachtwoord is niet correct!";
        } else {
            oldValues.oldPassword = currentPassword;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

        if (!newPassword || newPassword.length === 0) {
            errors.newPasswordErr = "Nieuwe wachtwoord is verplicht!";
        } else if (!passwordRegex.test(newPassword)) {
            errors.newPasswordErr = "Gebruik minimaal 8 letters, 1 hoofdletter en 1 cijfer!";
        }

        if (!confirmPassword || confirmPassword.length === 0) {
            errors.confirmPasswordErr = "Nieuwe wachtwoord bevestigen is verplicht!";
        } else if (!(confirmPassword == newPassword)) {
            errors.confirmPasswordErr = "De wachtwoorden komen niet overeen!";
        }

        if (typeof errors.currentPasswordErr != "undefined" || typeof errors.newPasswordErr != "undefined" || typeof errors.confirmPasswordErr != "undefined") {
            res.render("user_profile", { pageName: "Mijn profiel", session: req.session.user, ...errors, type });
        } else {
            (async () => {
                await User.updateOne({ _id: req.session.user.userId }, { $set: { password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync()) } });
                return res.redirect("/logout");
            })();
        }
    })();
};

const updateUserByEmail = async (user) => {
    try {
        const { oldMail, firstName, lastName, emailAddress } = user;
        await User.updateOne({ emailAddress: oldMail }, { $set: { firstName: firstName, lastName: lastName, emailAddress: emailAddress } });
        return;
    } catch (err) {
        throw err;
    }
};

// Functionality for getting all the users
exports.getAllUsers = async () => {
    return await User.find();
};

exports.getAllValidUsers = async () => {
    return await User.find({ firstName: { $ne: "" }, lastName: { $ne: "" } });
};

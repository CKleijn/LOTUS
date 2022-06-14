const bcrypt = require("bcrypt");
const mongoose = require("./../../database/dbconnection");
const { sendMemberInviteMail } = require("./../controllers/mail.controller");
const userController = require("./../controllers/user.controller");
const { userModel } = require("./../models/user.model");
const passGenerator = require("generate-password");

const User = userModel;

// Functionality for creating an user
exports.createUser = (req, res) => {
    // Declare all variables out of req.body
    let { firstName, lastName, emailAddress, password, confirmPassword, street, houseNumber, houseNumberAddition, postalCode, town } = req.body;
    emailAddress = emailAddress.toLowerCase();
    // Create new user object
    const user = new User({
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        password: password,
        confirmPassword: confirmPassword,
        street: street,
        houseNumber: houseNumber,
        houseNumberAddition: houseNumberAddition,
        postalCode: postalCode,
        town: town,
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

                if (err.errors.confirmPassword) {
                    errors.confirmPasswordErr = err.errors.confirmPassword.properties.message;
                } else {
                    oldValues.confirmPassword = confirmPassword;
                }

                if (err.errors.street) {
                    errors.streetErr = err.errors.street.properties.message;
                } else {
                    oldValues.street = street;
                }

                if (isNaN(houseNumber)) {
                    errors.houseNumberErr = "Huisnummer moet een getal zijn!";
                } else if (err.errors.houseNumber) {
                    errors.houseNumberErr = err.errors.houseNumber.properties.message;
                } else {
                    oldValues.houseNumber = houseNumber;
                }

                if (houseNumberAddition || !houseNumberAddition.length === 0) {
                    oldValues.houseNumberAddition = houseNumberAddition;
                }

                if (err.errors.postalCode) {
                    errors.postalCodeErr = err.errors.postalCode.properties.message;
                } else {
                    oldValues.postalCode = postalCode;
                }

                if (err.errors.town) {
                    errors.townErr = err.errors.town.properties.message;
                } else {
                    oldValues.town = town;
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
                    street: user.street,
                    houseNumber: user.houseNumber,
                    houseNumberAddition: user.houseNumberAddition,
                    postalCode: user.postalCode,
                    town: user.town,
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

        const allMembers = await exports.getAllValidMembers();
        const allClients = await exports.getAllValidClients();
        const allInvitedMembers = await exports.getAllInvitedMembers();

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

                    res.redirect("/user");
                } else {
                    res.render("user_overview", { pageName: "Gebruikers", session: req.session, emailAddressErr: "Dit e-mailadres is al in gebruik!", allMembers, allClients, allInvitedMembers });
                }
            })();
        } else {
            res.render("user_overview", { pageName: "Gebruikers", session: req.session, emailAddressErr: "Het ingevulde e-mailadres is ongeldig!", allMembers, allClients, allInvitedMembers });
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
    res.render("user_profile", { pageName: "Mijn profiel", session: req.session });
};

exports.changeUserProfileDetails = (req, res) => {
    let { firstName, lastName, emailAddress, type, street, houseNumber, houseNumberAddition, town, postalCode } = req.body;
    emailAddress = emailAddress.toLowerCase();

    const errors = {};
    const oldValues = {};
    errors.oldValues = oldValues;

    if (!firstName || firstName.length === 0) {
        errors.firstNameErr = "Voornaam is verplicht!";
    } else if (!isNaN(firstName) || /\d/.test(firstName)) {
        errors.firstNameErr = "Voornaam moet bestaan uit letters!";
    } else {
        oldValues.firstName = firstName;
    }

    if (!lastName || lastName.length === 0) {
        errors.lastNameErr = "Achternaam is verplicht!";
    } else if (!isNaN(lastName) || /\d/.test(lastName)) {
        errors.lastNameErr = "Achternaam moet bestaan uit letters!";
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

    if (req.session.user.roles == "client") {
        if (!street || street.length === 0) {
            errors.streetErr = "Straat is verplicht!";
        } else if (!isNaN(street) || /\d/.test(street)) {
            errors.streetErr = "Straat moet bestaan uit letters!";
        } else {
            oldValues.street = street;
        }

        if (!houseNumber || houseNumber.length === 0) {
            errors.houseNumberErr = "Huisnummer is verplicht!";
        } else if (isNaN(houseNumber)) {
            errors.houseNumberErr = "Huisnummer moet een getal zijn!";
        } else {
            oldValues.houseNumber = houseNumber;
        }

        oldValues.houseNumberAddition = houseNumberAddition;

        if (!town || town.length === 0) {
            errors.townErr = "Plaats is verplicht!";
        } else if (!isNaN(town) || /\d/.test(town)) {
            errors.townErr = "Plaats moet bestaan uit letters!";
        } else {
            oldValues.town = town;
        }

        const postalCodeRegex = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;

        if (!postalCode || town.postalCode === 0) {
            errors.postalCodeErr = "Postcode is verplicht!";
        } else if (!postalCodeRegex.test(postalCode)) {
            errors.postalCodeErr = "Vul een geldige postcode in!";
        } else {
            oldValues.postalCode = postalCode;
        }
    }

    (async () => {
        const userExists = await User.findOne({ emailAddress: emailAddress, _id: { $ne: req.session.user.userId } }).lean();
        if (userExists) {
            delete oldValues.emailAddress;
            errors.emailAddressErr = "E-mailadres is al in gebruik!";
        }

        if (typeof errors.firstNameErr != "undefined" || typeof errors.lastNameErr != "undefined" || typeof errors.emailAddressErr != "undefined" || typeof errors.streetErr != "undefined" || typeof errors.houseNumberErr != "undefined" || typeof errors.houseNumberAdditionErr != "undefined" || typeof errors.townErr != "undefined" || (typeof errors.postalCodeErr != "undefined" && req.session.user.roles == "client")) {
            res.render("user_profile", { pageName: "Mijn profiel", session: req.session, ...errors, type });
        } else if (typeof errors.firstNameErr != "undefined" || typeof errors.lastNameErr != "undefined" || (typeof errors.emailAddressErr != "undefined" && req.session.user.roles != "client")) {
            res.render("user_profile", { pageName: "Mijn profiel", session: req.session, ...errors, type });
        } else {
            (async () => {
                const user = req.session.user;

                let updateInfo = {};

                if (user.roles == "client") {
                    updateInfo = { oldMail: user.emailAddress, firstName, lastName, emailAddress, street, houseNumber, houseNumberAddition, town, postalCode };
                } else {
                    updateInfo = { oldMail: user.emailAddress, firstName, lastName, emailAddress };
                }

                await updateUserByEmail(updateInfo);
                user.firstName = firstName;
                user.lastName = lastName;
                user.emailAddress = emailAddress;

                if (user.roles == "client") {
                    user.street = street;
                    user.houseNumber = houseNumber;
                    user.houseNumberAddition = houseNumberAddition;
                    user.town = town;
                    user.postalCode = postalCode;
                }

                return res.redirect("/user/profile");
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
            res.render("user_profile", { pageName: "Mijn profiel", session: req.session, ...errors, type });
        } else {
            (async () => {
                await User.updateOne({ _id: req.session.user.userId }, { $set: { password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync()), confirmPassword: bcrypt.hashSync(newPassword, bcrypt.genSaltSync()) } });
                return res.redirect("/logout");
            })();
        }
    })();
};

exports.changeRoles = async (req, res) => {
    const userId = req.query.id;
    const postedRole = req.body;

    const userInfo = await User.findById({ _id: userId });

    if (postedRole != userInfo.roles) {
        await User.findOneAndUpdate({ _id: userId }, { $set: { roles: postedRole.roles } });
    }

    res.redirect("/user");
};

const updateUserByEmail = async (user) => {
    try {
        const { oldMail } = user;
        await User.updateOne({ emailAddress: oldMail }, { $set: { ...user } });
        return;
    } catch (err) {
        throw err;
    }
};

// Functionality for getting all the users
exports.getAllUsers = async () => {
    return await User.find();
};

exports.getAllValidClients = async () => {
    return await User.find({ roles: "client" });
};

exports.getAllValidMembers = async () => {
    return await User.find({ firstName: { $ne: "" }, lastName: { $ne: "" }, roles: "member" });
};

exports.getAllInvitedMembers = async () => {
    return await User.find({ firstName: "", lastName: "" });
};

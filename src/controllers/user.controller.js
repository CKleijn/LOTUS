const bcrypt = require("bcrypt");
const mongoose = require("./../../database/dbconnection");
const { sendMemberInviteMail } = require("./../controllers/mail.controller");
const User = require("./../models/user.model");

// // Functionality for getting all the users
// exports.getAllUsers = (req, res) => {
//     User.find(function (err, users) {
//         if (err) throw err;

//         mongoose.connection.close();

//         res.render("", { users });
//     });
// };
// Functionality for creating an user
exports.createUser = (req, res) => {
    // Declare all variables out of req.body
    const { firstName, lastName, emailAddress, password, roles } = req.body;
    // Create new user object
    const user = new User({
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        password: password,
        roles: "client",
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
            // Redirect to the login page so the new user can login
            res.redirect("login");
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
    const emailAddress = req.body.emailAddress;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (emailRegex.test(emailAddress)) {
        (async () => {
            const result = await this.getUserByEmailAddress(req, res);

            if (result.length === 0) {
                // await sendMemberInviteMail(emailAddress, "LOTUS-Kring Here We Go Accountgegevens", "Klik hier om je aan te melden!");
                res.redirect("/user_overview");
            } else {
                res.render("user_overview", { pageName: "Gebruikers", emailAddressErr: "Dit e-mailadres is al in gebruik!" });
            }
        })();
    } else {
        res.render("user_overview", { pageName: "Gebruikers", emailAddressErr: "Het ingevulde e-mailadres is ongeldig!" });
    }
};

// // Functionality for updating an user
// exports.updateUserById = (req, res) => {
//     User.findByIdAndUpdate(req.body._id, { ...req.body }, function (err) {
//         if (err) throw err;

//         mongoose.connection.close();

//         console.log(`User with an ID of ${req.body._id} has been updated successfully!`);
//     });
// };
// // Functionality for deleting an user
// exports.deleteUserById = (req, res) => {
//     User.findByIdAndDelete(req.body._id, function (err) {
//         if (err) throw err;

//         mongoose.connection.close();

//         console.log(`User with an ID of ${req.body._id} has been deleted successfully!`);
//     });
// };

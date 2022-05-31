const session = require("express-session");
const bcrypt = require("bcrypt");
const mongoose = require("./../../database/dbconnection");

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
    // Hash password if password isn't empty
    let hashedPassword;
    if (password !== "") {
        hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
    }
    // Create new user object
    const user = new User({
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        password: hashedPassword,
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
                    errors.emailAddressErr = "E-mailadres bestaat al!";
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
            res.redirect("/login")
        }
    });
};
// Functionality for getting user by id
// exports.getUserById = (req, res) => {
//     User.find({ _id: req.body._id }, function (err, users) {
//         if (err) throw err;

//         mongoose.connection.close();

//         if (users.length > 0) {
//             res.render("", { users });
//         } else {
//             console.log(`User with an ID of ${req.body._id} doesn't exist!`);
//         }
//     });
// };
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

//Functionality for login
exports.login = (req, res) => {
    const { emailAddress, password } = req.body;

    User.find(function (err, users) {
        if (err) throw err;

        users.forEach((user) => {
            if (emailAddress == user.emailAddress && bcrypt.compareSync(password, user.password)) {
                var session = req.session;
                session.userid = user._id;
                session.roles = user.roles[0];
                session.firstname = user.firstName

                return res.redirect("/dashboard")
            }
        });
    });
};

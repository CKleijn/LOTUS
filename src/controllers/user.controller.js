const mongoose = require("mongoose");
// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/LOTUS_DB");
// Create userSchema with all fields
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Voornaam is verplicht!"],
    },
    lastName: {
        type: String,
        required: [true, "Achternaam is verplicht!"],
    },
    emailAddress: {
        type: String,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: (props) => `${props.value} is is geen geldig E-mailadres!`,
        },
        required: [true, "E-mailadres is verplicht!"],
    },
    password: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(v);
            },
            message: (props) => `${props.value} is geen geldig wachtwoord!`,
        },
        required: [true, "Wachtwoord is verplicht!"],
    },
    roles: {
        type: [String],
        enum: ["coordinator", "client", "member"],
    },
});
// Create a User model
const User = mongoose.model("User", userSchema);
// Functionality for getting all the users
exports.getAllUsers = (req, res) => {
    User.find(function (err, users) {
        if (err) throw err;

        mongoose.connection.close();

        res.render("", { users });
    });
};
// Functionality for creating an user
exports.createUser = (req, res) => {
    const { firstName, lastName, emailAddress, password, roles } = req.body;

    const user = new User({
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        password: password,
        roles: "client",
    });

    user.save((err) => {
        if (err) {
            const errors = {};
            const oldValues = {};
            errors.oldValues = oldValues;

            if (err.errors.firstName) {
                errors.firstNameErr = err.errors.firstName.properties.message;
            } else {
                errors.firstNameErr = "";
                errors.oldValues.firstName = req.body.firstName;
            }

            if (err.errors.lastName) {
                errors.lastNameErr = err.errors.lastName.properties.message;
            } else {
                errors.lastNameErr = "";
                errors.oldValues.lastName = req.body.lastName;
            }

            if (err.errors.emailAddress) {
                errors.emailAddressErr = err.errors.emailAddress.properties.message;
            } else {
                errors.emailAddressErr = "";
                errors.oldValues.emailAddress = req.body.emailAddress;
            }

            if (err.errors.password) {
                errors.passwordErr = err.errors.password.properties.message;
            } else {
                errors.passwordErr = "";
                errors.oldValues.password = req.body.password;
            }

            res.render("register", errors);
        } else {
            res.render("index");
        }
    });
};
// Functionality for getting user by id
exports.getUserById = (req, res) => {
    User.find({ _id: req.body._id }, function (err, users) {
        if (err) throw err;

        mongoose.connection.close();

        if (users.length > 0) {
            res.render("", { users });
        } else {
            console.log(`User with an ID of ${req.body._id} doesn't exist!`);
        }
    });
};
// Functionality for updating an user
exports.updateUserById = (req, res) => {
    User.findByIdAndUpdate(req.body._id, { ...req.body }, function (err) {
        if (err) throw err;

        mongoose.connection.close();

        console.log(`User with an ID of ${req.body._id} has been updated successfully!`);
    });
};
// Functionality for deleting an user
exports.deleteUserById = (req, res) => {
    User.findByIdAndDelete(req.body._id, function (err) {
        if (err) throw err;

        mongoose.connection.close();

        console.log(`User with an ID of ${req.body._id} has been deleted successfully!`);
    });
};

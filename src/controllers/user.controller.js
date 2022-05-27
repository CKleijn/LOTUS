const mongoose = require("mongoose");
// Connect to MongoDB
mongoose.connect("http://localhost:27017/LOTUS_DB");
// Create userSchema with all fields
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "User first name required!"]
    },
    lastName: {
        type: String,
        required: [true, "User last name required!"]
    },
    emailAddress: {
        type: String,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        },
        required: [true, "User email address required!"]
    },
    password: {
        type: String,
        validate: {
            validator: function(v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(v);
            },
            message: props => `${props.value} is not a valid password!`
        },
        required: [true, "User password required!"]
    },
    roles: {
        type: [String],
        enum: ["coordinator", "client", "member"],
        required: [true, "User roles required!"]
    }
});
// Create a User model
const User = mongoose.model("User", userSchema);
// Functionality for getting all the users
exports.getAllUsers = (req, res) => {
    User.find(function(err, users) {
        if (err) throw (err);

        mongoose.connection.close();

        res.render("", {users});
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
        roles: "client"
    });

    user.save();

    mongoose.connection.close();
};
// Functionality for getting user by id
exports.getUserById = (req, res) => {
    User.find({_id: req.body._id}, function(err, users) {
        if (err) throw (err);

        mongoose.connection.close();

        if(users.length > 0) {
            res.render("", {users});
        } else {
            console.log(`User with an ID of ${req.body._id} doesn't exist!`);
        }
    });
};
// Functionality for updating an user
exports.updateUserById = (req, res) => {
    User.findByIdAndUpdate(req.body._id, {...req.body}, function(err) {
        if (err) throw (err);

        mongoose.connection.close();

        console.log(`User with an ID of ${req.body._id} has been updated successfully!`);
    });
};
// Functionality for deleting an user
exports.deleteUserById = (req, res) => {
    User.findByIdAndDelete(req.body._id, function (err) {
        if (err) throw (err);

        mongoose.connection.close();

        console.log(`User with an ID of ${req.body._id} has been deleted successfully!`);
    })
};

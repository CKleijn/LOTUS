const mongoose = require("./../../database/dbconnection");
const bcrypt = require("bcrypt");
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
            message: (props) => `${props.value} is geen geldig e-mailadres!`,
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
        required: [true, "Minstens één rol verplicht!"],
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    lastLoginDate: {
        type: Date,
    },
});
// Hash password before saving user
userSchema.pre("save", function () {
    let user = this;
    // Hash password if password isn't empty
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
});
// Create a User model
module.exports = mongoose.model("User", userSchema);

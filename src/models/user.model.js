// Create userSchema with all fields
const mongoose = require("./../../database/dbconnection");

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
        required: [true, "Wachtwoord is verplicht!"],
    },
    roles: {
        type: [String],
        enum: ["coordinator", "client", "member"],
        required: [true, "Minstens één rol verplicht!"],
    },
});
// Create a User model
module.exports = mongoose.model("User", userSchema);

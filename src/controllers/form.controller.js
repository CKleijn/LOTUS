const mongoose = require("./../../database/dbconnection");

// Create formSchema with all fields
const formSchema = new mongoose.Schema({
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
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: (props) => `${props.value} is geen geldig E-mailadres!`,
        },
        required: [true, "E-mailadres is verplicht!"],
    },
    invoiceAddress: {
        type: String,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: (props) => `${props.value} is geen geldig E-mailadres!`,
        },
        required: [true, "Factuuradres is verplicht!"],
    },
    postalCode: {
        type: String,
        validate: {
            validator: function(v) {
                return /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i.test(v);
            },
            message: (props) => `${props.value} is geen geldige postode`,
        },
        required: [true, "Postcode is verplicht!"],
    },
});
// Create a Form model
const Form = mongoose.model("Form", formSchema);

// Functionality for creating a Form
exports.createForm = (req, res) => {
    const { firstName, lastName, emailAddress, invoiceAddress, postalCode} = req.body;

    const form = new Form({
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        invoiceAddress: invoiceAddress,
        postalCode: postalCode,
    });

    form.save((err) => {
        if (err) {
            const errors = {};
            const oldValues = {};
            errors.oldValues = oldValues;

            if (typeof err.errors.firstName !== "undefined") {
                errors.firstNameErr = err.errors.firstName.properties.message;
            } else {
                errors.oldValues.firstName = req.body.firstName;
            }

            if (typeof err.errors.lastName !== "undefined") {
                errors.lastNameErr = err.errors.lastName.properties.message;
            } else {
                errors.oldValues.lastName = req.body.lastName;
            }

            if (typeof err.errors.emailAddress !== "undefined") {
                errors.emailAddressErr = err.errors.emailAddress.properties.message;
            } else {
                errors.oldValues.emailAddress = req.body.emailAddress;
            }
          
            if (typeof err.errors.invoiceAddress !== "undefined") {
                errors.invoiceAddressErr = err.errors.invoiceAddress.properties.message;
            } else {
                errors.oldValues.emailAddress = req.body.emailAddress;
            }

            if (typeof err.errors.postalCode !== "undefined") {
                errors.postalCodeErr = err.errors.postalCode.properties.message;
            } else {
                errors.oldValues.postalCode = req.body.postalCode;
            }

            console.log("Er is iets fout gegaan.");
            res.render("form", { pageName: "Formulier", ...errors });
        } else {
            console.log("Formulier succesvol opgeslagen! :)");
        }
    });
};
const mongoose = require("../../database/dbconnection");
// Create assignmentSchema with all fields
const assignmentSchema = new mongoose.Schema({
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
        unique: false,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: `Gebruik een geldig e-mailadres zoals j.doe@gmail.com!`,
        },
        required: [true, "E-mailadres is verplicht!"],
    },
    // Personal address
    street: {
        type: String,
        required: [true, "Straat is verplicht!"],
    },
    houseNumber: {
        type: Number,
        required: [true, "Huisnummer is verplicht!"],
    },
    houseNumberAddition: {
        type: String,
    },
    postalCode: {
        type: String,
        validate: {
            validator: function(v) {
                return /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i.test(v);
            },
            message: `Gebruik een geldig postcode zoals 2973FD!`,
        },
        required: [true, "Postcode is verplicht!"],
    },
    town: {
        type: String,
        required: [true, "Plaats is verplicht!"],
    },
    // Billing address
    billingEmailAddress: {
        type: String,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: `Gebruik een geldig e-mailadres zoals j.doe@gmail.com!`,
        },
        required: [true, "E-mailadres is verplicht!"],
    },
    dateTime: {
        type: String,
        required: [true, "Datum en tijd is verplicht!"],
    },
    // Playground address
    playgroundStreet: {
        type: String,
        required: [true, "Speelplaats straat is verplicht!"],
    },
    playgroundHouseNumber: {
        type: Number,
        required: [true, "Speelplaats huisnummer is verplicht!"],
    },
    playgroundHouseNumberAddition: {
        type: String,
    },
    playgroundPostalCode: {
        type: String,
        validate: {
            validator: function(v) {
                return /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i.test(v);
            },
            message: `Gebruik een geldig postcode zoals 2973FD!`,
        },
        required: [true, "Speelplaats postcode is verplicht!"],
    },
    playgroundTown: {
        type: String,
        required: [true, "Speelplaats plaats is verplicht!"],
    },
    // Make up address
    makeUpStreet: {
        type: String,
    },
    makeUpHouseNumber: {
        type: Number,
    },
    makeUpHouseNumberAddition: {
        type: String,
    },
    makeUpPostalCode: {
        type: String,
        validate: {
            validator: function(v) {
                if(v == "") {
                    return true;
                } else {
                    return /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i.test(v);
                }
            },
            message: `Gebruik een geldig postcode zoals 2973FD!`,
        },
    },
    makeUpTown: {
        type: String,
    },
    amountOfLotusVictims: {
        type: Number,
        min: [1,"Aantal LOTUS slachtoffers moet minimaal 1 zijn!"],
        required: [true, "Aantal LOTUS slachtoffers is verplicht!"],
    },
    comments: {
        type: String,
    },
    isApproved: {
        type: Boolean,
        default: false
    }
});
// Create a Assignment model
module.exports = mongoose.model("Assignment", assignmentSchema);
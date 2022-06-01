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
        unique: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: (props) => `${props.value} is geen geldig e-mailadres!`,
        },
        required: [true, "E-mailadres is verplicht!"],
    },
    // Normale adres
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
            message: (props) => `${props.value} is geen geldig postcode!`,
        },
        required: [true, "Postcode is verplicht!"],
    },
    town: {
        type: String,
        required: [true, "Plaats is verplicht!"],
    },
    // Factuur adres
    billingStreet: {
        type: String,
        required: [true, "Factuur straat is verplicht!"],
    },
    billingHouseNumber: {
        type: Number,
        required: [true, "Factuur huisnummer is verplicht!"],
    },
    billingHouseNumberAddition: {
        type: String,
    },
    billingPostalCode: {
        type: String,
        validate: {
            validator: function(v) {
                return /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i.test(v);
            },
            message: (props) => `${props.value} is geen geldig postcode!`,
        },
        required: [true, "Factuur postcode is verplicht!"],
    },
    billingTown: {
        type: String,
        required: [true, "Factuur plaats is verplicht!"],
    },
    dateTime: {
        type: String,
        required: [true, "Datum en tijd is verplicht"],
    },
    // Speelplaats
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
            message: (props) => `${props.value} is geen geldig postcode!`,
        },
        required: [true, "Speelplaats postcode is verplicht!"],
    },
    playgroundTown: {
        type: String,
        required: [true, "Speelplaats plaats is verplicht!"],
    },
    amountOfLotusVictims: {
        type: Number,
        min: [1,"Aantal LOTUS slachtoffers moet minimaal 1 zijn!"],
        required: [true, "Aantal LOTUS slachtoffers is verplicht!"],
    },
    comments: {
        type: String,
    },
});
// Create a Assignment model
module.exports = mongoose.model("Assignment", assignmentSchema);
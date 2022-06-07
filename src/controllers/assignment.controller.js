const mongoose = require("../../database/dbconnection");
const Assignment = require("../models/assignment.model");
// Functionality for creating an assignment
exports.createAssignment = (req, res) => {
    // Get session
    const session = req.session;
    // Declare all variables out of req.body
    const { firstName, lastName, emailAddress, street, houseNumber, houseNumberAddition, postalCode, town, billingStreet, 
            billingHouseNumber, billingHouseNumberAddition, billingPostalCode, billingTown, dateTime, playgroundStreet, 
            playgroundHouseNumber, playgroundHouseNumberAddition, playgroundPostalCode, playgroundTown, makeUpStreet,
            makeUpHouseNumber, makeUpHouseNumberAddition, makeUpPostalCode, makeUpTown, amountOfLotusVictims, comments, isApproved } = req.body;
    // Create new assignment object
    const assignment = new Assignment({
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        street: street,
        houseNumber: houseNumber,
        houseNumberAddition: houseNumberAddition,
        postalCode: postalCode,
        town: town,
        billingStreet: billingStreet,
        billingHouseNumber: billingHouseNumber,
        billingHouseNumberAddition: billingHouseNumberAddition,
        billingPostalCode: billingPostalCode,
        billingTown: billingTown,
        dateTime: dateTime,
        playgroundStreet: playgroundStreet,
        playgroundHouseNumber: playgroundHouseNumber,
        playgroundHouseNumberAddition: playgroundHouseNumberAddition,
        playgroundPostalCode: playgroundPostalCode,
        playgroundTown: playgroundTown,
        makeUpStreet: makeUpStreet,
        makeUpHouseNumber: makeUpHouseNumber,
        makeUpHouseNumberAddition: makeUpHouseNumberAddition,
        makeUpPostalCode: makeUpPostalCode,
        makeUpTown: makeUpTown,
        amountOfLotusVictims: amountOfLotusVictims,
        comments: comments,
        isApproved: isApproved,
    });
    // Check if coordinator is trying to make an assignment
    if (session.user.roles === "coordinator") {
        assignment.isApproved = true;
    }
    // Save assignment object in database and show errors if they exists
    assignment.save((err) => {
        if (err) {
            const errors = {};
            const oldValues = {};
            errors.oldValues = oldValues;

            if (err.errors.firstName) {
                errors.firstNameErr = err.errors.firstName.properties.message;
            } else {
                errors.oldValues.firstName = req.body.firstName;
            }

            if (err.errors.lastName) {
                errors.lastNameErr = err.errors.lastName.properties.message;
            } else {
                errors.oldValues.lastName = req.body.lastName;
            }

            if (err.errors.emailAddress) {
                errors.emailAddressErr = err.errors.emailAddress.properties.message;
            } else {
                errors.oldValues.emailAddress = req.body.emailAddress;
            }

            if (err.errors.street) {
                errors.streetErr = err.errors.street.properties.message;
            } else {
                errors.oldValues.street = req.body.street;
            }

            if (err.errors.houseNumber) {
                errors.houseNumberErr = err.errors.houseNumber.properties.message;
            } else {
                errors.oldValues.houseNumber = req.body.houseNumber;
            }

            if (err.errors.houseNumberAddition) {
                errors.houseNumberAdditionErr = err.errors.houseNumberAddition.properties.message;
            } else {
                errors.oldValues.houseNumberAddition = req.body.houseNumberAddition;
            }

            if (err.errors.postalCode) {
                errors.postalCodeErr = err.errors.postalCode.properties.message;
            } else {
                errors.oldValues.postalCode = req.body.postalCode;
            }

            if (err.errors.town) {
                errors.townErr = err.errors.town.properties.message;
            } else {
                errors.oldValues.town = req.body.town;
            }

            if (err.errors.billingStreet) {
                errors.billingStreetErr = err.errors.billingStreet.properties.message;
            } else {
                errors.oldValues.billingStreet = req.body.billingStreet;
            }

            if (err.errors.billingHouseNumber) {
                errors.billingHouseNumberErr = err.errors.billingHouseNumber.properties.message;
            } else {
                errors.oldValues.billingHouseNumber = req.body.billingHouseNumber;
            }

            if (err.errors.billingHouseNumberAddition) {
                errors.billingHouseNumberAdditionErr = err.errors.billingHouseNumberAddition.properties.message;
            } else {
                errors.oldValues.billingHouseNumberAddition = req.body.billingHouseNumberAddition;
            }

            if (err.errors.billingPostalCode) {
                errors.billingPostalCodeErr = err.errors.billingPostalCode.properties.message;
            } else {
                errors.oldValues.billingPostalCode = req.body.billingPostalCode;
            }

            if (err.errors.billingTown) {
                errors.billingTownErr = err.errors.billingTown.properties.message;
            } else {
                errors.oldValues.billingTown = req.body.billingTown;
            }

            if (err.errors.dateTime) {
                errors.dateTimeErr = err.errors.dateTime.properties.message;
            } else {
                errors.oldValues.dateTime = req.body.dateTime;
            }

            if (err.errors.playgroundStreet) {
                errors.playgroundStreetErr = err.errors.playgroundStreet.properties.message;
            } else {
                errors.oldValues.playgroundStreet = req.body.playgroundStreet;
            }

            if (err.errors.playgroundHouseNumber) {
                errors.playgroundHouseNumberErr = err.errors.playgroundHouseNumber.properties.message;
            } else {
                errors.oldValues.playgroundHouseNumber = req.body.playgroundHouseNumber;
            }

            if (err.errors.playgroundHouseNumberAddition) {
                errors.playgroundHouseNumberAdditionErr = err.errors.playgroundHouseNumberAddition.properties.message;
            } else {
                errors.oldValues.playgroundHouseNumberAddition = req.body.playgroundHouseNumberAddition;
            }

            if (err.errors.playgroundPostalCode) {
                errors.playgroundPostalCodeErr = err.errors.playgroundPostalCode.properties.message;
            } else {
                errors.oldValues.playgroundPostalCode = req.body.playgroundPostalCode;
            }

            if (err.errors.playgroundTown) {
                errors.playgroundTownErr = err.errors.playgroundTown.properties.message;
            } else {
                errors.oldValues.playgroundTown = req.body.playgroundTown;
            }

            if (err.errors.makeUpStreet) {
                errors.makeUpStreetErr = err.errors.makeUpStreet.properties.message;
            } else {
                errors.oldValues.makeUpStreet = req.body.makeUpStreet;
            }

            if (err.errors.makeUpHouseNumber) {
                errors.makeUpHouseNumberErr = err.errors.makeUpHouseNumber.properties.message;
            } else {
                errors.oldValues.makeUpHouseNumber = req.body.makeUpHouseNumber;
            }

            if (err.errors.makeUpHouseNumberAddition) {
                errors.makeUpHouseNumberAdditionErr = err.errors.makeUpHouseNumberAddition.properties.message;
            } else {
                errors.oldValues.makeUpHouseNumberAddition = req.body.makeUpHouseNumberAddition;
            }

            if (err.errors.makeUpPostalCode) {
                errors.makeUpPostalCodeErr = err.errors.makeUpPostalCode.properties.message;
            } else {
                errors.oldValues.makeUpPostalCode = req.body.makeUpPostalCode;
            }

            if (err.errors.makeUpTown) {
                errors.makeUpTownErr = err.errors.makeUpTown.properties.message;
            } else {
                errors.oldValues.makeUpTown = req.body.makeUpTown;
            }

            if (err.errors.amountOfLotusVictims) {
                errors.amountOfLotusVictimsErr = err.errors.amountOfLotusVictims.properties.message;
            } else {
                errors.oldValues.amountOfLotusVictims = req.body.amountOfLotusVictims;
            }

            if (err.errors.comments) {
                errors.commentsErr = err.errors.comments.properties.message;
            } else {
                errors.oldValues.comments = req.body.comments;
            }
            // Show the errors on the assignment page
            res.render("assignment", { pageName: "Formulier", session: req.session.user, ...errors });
        } else {
            // Redirect to the dashboard
            res.redirect("/");
        }
    });
};

exports.getAssignmentPage = (req, res) => {
    res.render("assignment", { pageName: "Formulier", session: req.session.user });
};

exports.getAllAssignments = (req, res) => {
    function format(inputDate) {
        let date, month, year;
      
        date = inputDate.getDate();
        month = inputDate.getMonth() + 1;
        year = inputDate.getFullYear();
      
        date = date
            .toString()
            .padStart(2, '0');
    
        month = month
            .toString()
            .padStart(2, '0');
      
        return `${date}/${month}/${year}`;
    }

    Assignment.find({ isApproved: true }, function(err, results) {
        results.forEach(result => {
            result.dateTime = format(new Date(result.dateTime));
        });
        res.render("assignment_overview", { pageName: "Opdrachten", session: req.session.user, assignments: results });
    });
}

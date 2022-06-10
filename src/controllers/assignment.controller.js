const mongoose = require("../../database/dbconnection");
const Assignment = require("../models/assignment.model");
const Request = require("../models/request.model");
const { createRequest } = require("./request.controller");
// Functionality for creating an assignment
exports.createAssignment = (req, res) => {
    // Get session
    const session = req.session;
    // Declare all variables out of req.body

    const { firstName, lastName, emailAddress, street, houseNumber, houseNumberAddition, postalCode, town, billingEmailAddress, dateTime, playgroundStreet, playgroundHouseNumber, playgroundHouseNumberAddition, playgroundPostalCode, playgroundTown, makeUpStreet, makeUpHouseNumber, makeUpHouseNumberAddition, makeUpPostalCode, makeUpTown, amountOfLotusVictims, comments, isApproved, requestId, checkedOrNotProfile, checkedOrNotPlayground, checkedOrNotMakeUp } = req.body;

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
        billingEmailAddress: billingEmailAddress,
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
        requestId: requestId,
    });
    // Check if coordinator is trying to make an assignment
    if (session.user.roles === "coordinator") {
        assignment.isApproved = true;
    }
    // Save assignment object in database and show errors if they exists
    assignment.save(function (err, savedAssignment) {
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

            if (err.errors.billingEmailAddress) {
                errors.billingEmailAddressErr = err.errors.billingEmailAddress.properties.message;
            } else {
                errors.oldValues.billingEmailAddress = req.body.billingEmailAddress;
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
            res.render("assignment", { pageName: "Formulier", session: req.session.user, ...errors, checkedOrNotProfile, checkedOrNotPlayground, checkedOrNotMakeUp, url: req.session.originalUrl });
        } else {
            (async () => {
                if (session.user.roles === "client") {
                    const objectId = savedAssignment._id;
                    // Create a request
                    const request = await createRequest(req, res, objectId, "createAssignment");
                    // Update assignment
                    await Assignment.findOneAndUpdate({ _id: request.assignmentId }, { $set: { requestId: request._id } });
                }
                // Redirect to the overview
                res.redirect("/assignment");
            })();
        }
    });
};

exports.updateAssignment = (req, res) => {

    const assignmentId = req.assignmentId;

    console.log(req.body);
}

exports.getAssignmentPage = (req, res) => {
    req.session.originalUrl = req.originalUrl
    res.render("assignment", { pageName: "Formulier", session: req.session.user, url: req.session.originalUrl, assignmentId: req.query.id });
};

exports.getAssignmentUpdatePage = async (req, res) => {
    const assignmentId = req.query.assignmentId

    req.assignmentId = assignmentId;

    let assignment = await Assignment.find({ _id: assignmentId })

    assignment = assignment[0]

    req.session.originalUrl = req.originalUrl
    res.render("assignment", { pageName: "Formulier", session: req.session.user, url: req.session.originalUrl, assignmentId: req.query.id, assignment });
};

exports.getAllAssignments = (req, res) => {
    function format(inputDate) {
        let date, month, year;

        date = inputDate.getDate();
        month = inputDate.getMonth() + 1;
        year = inputDate.getFullYear();

        date = date.toString().padStart(2, "0");

        month = month.toString().padStart(2, "0");

        return `${date}/${month}/${year}`;
    }

    if (req.session.user.roles == "coordinator" || req.session.user.roles == "member") {
        Assignment.find({ isApproved: true }, function (err, results) {
            results.forEach((result) => {
                result.dateTime = format(new Date(result.dateTime));
            });
            res.render("assignment_overview", { pageName: "Opdrachten", session: req.session.user, assignments: results });
        });
    } else if (req.session.user.roles == "client") {
        let resultsFiltered = [];

        Assignment.find(async function (err, results) {
            for (let result of results) {
                if (result.emailAddress == req.session.user.emailAddress) {
                    let request = await Request.find({ _id: result.requestId }).exec();
                    result.dateTime = format(new Date(result.dateTime));

                    result = {
                        ...result._doc,
                        status: request[0].status,
                    };

                    resultsFiltered.push(result);
                }
            }
            res.render("assignment_overview", { pageName: "Opdrachten", session: req.session.user, assignments: resultsFiltered });
        });
    } 
};

exports.getAssignmentDetailPage = (req, res) => {
    function format(inputDate) {
        let date, month, year;

        date = inputDate.getDate();
        month = inputDate.getMonth() + 1;
        year = inputDate.getFullYear();

        date = date.toString().padStart(2, "0");

        month = month.toString().padStart(2, "0");

        return `${date}/${month}/${year}`;
    }

    Assignment.find({ _id: req.query.id }, function (err, results) {
        res.render("assignment_detail", { pageName: "Detailpagina", session: req.session.user, assignments: results });
    });
};

exports.deleteAssignment = (req, res) => {
    Assignment.deleteOne({ _id: req.query.id }, function (err, results) {
        Request.deleteOne({ assignmentId: req.query.id }, function (err, results) {
            res.redirect("/assignment");
        });
    });
};

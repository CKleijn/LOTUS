const mongoose = require("../../database/dbconnection");
const Request = require("../models/request.model");
const { assignmentModel } = require("../models/assignment.model");
const Assignment = assignmentModel;
const { userModel } = require("../models/user.model");
const session = require("express-session");
const User = userModel;

exports.createRequest = async (req, res, objectId, type) => {
    // Get session
    const session = req.session;
    // Create request
    const request = new Request({
        userId: session.user.userId,
        assignmentId: objectId.toString(),
        type: type,
    });
    // Save request
    request.save();
    // Return request
    return request;
};

exports.getAllRequests = async (req, res) => {
    const requests = await Request.find({ status: "In behandeling" });
    const parsedRequests = await parseRequest(requests);
    return res.render("request_overview", { pageName: "Verzoeken", session: req.session, requests: parsedRequests });
};

async function parseRequest(results) {
    let parsedRequests = [];

    for (let result of results) {
        const user = await User.find({ _id: result.userId });
        const assignment = await Assignment.find({ _id: result.assignmentId });
        const participations = await Request.find({ userId: result.userId, type: "enrollment", status: "Goedgekeurd" }).exec();
        const canceledParticipations = await Request.find({ userId: result.userId, type: "cancelEnrollment", status: "Goedgekeurd" }).exec();

        user[0].participations = participations.length - canceledParticipations.length;

        result = {
            ...result._doc,
            user: user[0],
            assignment: assignment[0],
        };

        parsedRequests.push(result);
    }

    return parsedRequests;
}

exports.approveRequest = async (req, res) => {
    const { requestType, requestId, assignmentId, userId } = req.body;

    if (requestType === "createAssignment") {
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Assignment.findOneAndUpdate({ _id: assignmentId }, { $set: { isApproved: true } });
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Goedgekeurd" } });
        res.redirect("/request");
    }

    if (requestType === "updateAssignment") {
        const { firstName, lastName, emailAddress, street, houseNumber, houseNumberAddition, postalCode, town, billingEmailAddress, dateTime, playgroundStreet, playgroundHouseNumber, playgroundHouseNumberAddition, playgroundPostalCode, playgroundTown, makeUpStreet, makeUpHouseNumber, makeUpHouseNumberAddition, makeUpPostalCode, makeUpTown, amountOfLotusVictims, comments } = req.body;

        const updatedAssignment = {
            firstName,
            lastName,
            emailAddress,
            street,
            houseNumber,
            houseNumberAddition,
            postalCode,
            town,
            billingEmailAddress,
            dateTime,
            playgroundStreet,
            playgroundHouseNumber,
            playgroundHouseNumberAddition,
            playgroundPostalCode,
            playgroundTown,
            makeUpStreet,
            makeUpHouseNumber,
            makeUpHouseNumberAddition,
            makeUpPostalCode,
            makeUpTown,
            amountOfLotusVictims,
            comments,
        };
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Assignment.findOneAndUpdate({ _id: assignmentId }, { $set: { ...updatedAssignment } });
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Goedgekeurd" } });
        res.redirect("/request");
    }

    if (requestType === "deleteAssignment") {
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Assignment.deleteOne({ _id: assignmentId });
        await Request.deleteMany({ assignmentId: assignmentId });
        res.redirect("/request");
    }

    if (requestType === "enrollment") {
        let user = await User.find({ _id: userId });
        user = user[0];

        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Assignment.findOneAndUpdate({ _id: assignmentId }, { $push: { participatingLotusVictims: user } });
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Goedgekeurd" } });
        res.redirect("/request");
    }

    if (requestType === "cancelEnrollment") {
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Assignment.updateOne({ _id: assignmentId }, { $pull: { participatingLotusVictims: { _id: userId } } });
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Goedgekeurd" } });
        await Request.deleteOne({ assignmentId: assignmentId, userId: userId, type: "enrollment", status: "Goedgekeurd" });
        await Request.deleteOne({ assignmentId: assignmentId, userId: userId, type: "cancelEnrollment", status: "Goedgekeurd" });
        res.redirect("/request");
    }
};

exports.declineRequest = async (req, res) => {
    const { requestType, requestId, assignmentId, userId } = req.body;

    if (requestType === "createAssignment") {
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Afgewezen" } });
        res.redirect("/request");
    }

    if (requestType === "updateAssignment") {
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Afgewezen" } });
        await Request.deleteOne({ assignmentId: assignmentId, userId: userId, type: "updateAssignment", status: "Afgewezen" });
        res.redirect("/request");
    }

    if (requestType === "deleteAssignment") {
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Afgewezen" } });
        await Request.deleteOne({ assignmentId: assignmentId, userId: userId, type: "deleteAssignment", status: "Afgewezen" });
        res.redirect("/request");
    }

    if (requestType === "enrollment") {
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Afgewezen" } });
        await Request.deleteOne({ assignmentId: assignmentId, userId: userId, type: "enrollment", status: "Afgewezen" });
        res.redirect("/request");
    }

    if (requestType === "cancelEnrollment") {
        req.session.requests = await req.session.requests.filter((request) => request._id != requestId);
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Afgewezen" } });
        await Request.deleteOne({ assignmentId: assignmentId, userId: userId, type: "cancelEnrollment", status: "Afgewezen" });
        res.redirect("/request");
    }
};

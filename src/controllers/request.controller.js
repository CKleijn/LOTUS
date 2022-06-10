const mongoose = require("../../database/dbconnection");
const Request = require("../models/request.model");
const User = require("../models/user.model");
const {assignmentModel} = require("../models/assignment.model");
const Assignment = assignmentModel;
const { userModel } = require("../models/user.model");
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
    return res.render("request_overview", { pageName: "Verzoeken", session: req.session.user, requests: parsedRequests });
};

async function parseRequest(results) {
    async function format(inputDate) {
        let date, month, year;

        date = inputDate.getDate();
        month = inputDate.getMonth() + 1;
        year = inputDate.getFullYear();

        date = date.toString().padStart(2, "0");

        month = month.toString().padStart(2, "0");

        return `${date}/${month}/${year}`;
    }

    let parsedRequests = [];

    for (let result of results) {
        const user = await User.find({ _id: result.userId });
        const assignment = await Assignment.find({ _id: result.assignmentId });
        const requestDate = await format(new Date(result.requestDate));
        const participations = await Request.find({ userId: result.userId, type: "enrollment", status: "Goedgekeurd" }).exec();
        const canceledParticipations = await Request.find({ userId: result.userId, type: "cancelEnrollment", status: "Goedgekeurd" }).exec();

        user[0].participations = participations.length - canceledParticipations.length;

        result = {
            ...result._doc,
            requestDate: requestDate,
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
        await Assignment.findOneAndUpdate({ _id: assignmentId }, { $set: { isApproved: true } });
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Goedgekeurd" } });
        res.redirect("/request");
    }

    if (requestType === "deleteAssignment") {
        await Assignment.deleteOne({ _id: assignmentId });
        await Request.deleteMany({ assignmentId: assignmentId });
        res.redirect("/request");
    }

    if (requestType === "enrollment") {
        await Assignment.findOneAndUpdate({ _id: assignmentId }, { $push: { participatingLotusVictims: req.session.user } });
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Goedgekeurd" } });
        res.redirect("/request");
    }

    if (requestType === "cancelEnrollment") {
        await Assignment.updateOne({ _id: assignmentId }, { $pull: { participatingLotusVictims: { emailAddress: req.session.user.emailAddress } } });
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Goedgekeurd" } });
        await Request.deleteOne({ assignmentId: assignmentId, userId: userId, type: "enrollment", status: "Goedgekeurd" });
        await Request.deleteOne({ assignmentId: assignmentId, userId: userId, type: "cancelEnrollment", status: "Goedgekeurd" });
        res.redirect("/request");
    }
};

exports.declineRequest = async (req, res) => {
    const { requestType, requestId, assignmentId } = req.body;

    if (requestType === "createAssignment") {
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Afgewezen" } });
        res.redirect("/request");
    }

    if (requestType === "deleteAssignment") {
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Afgewezen" } });
        res.redirect("/request");
    }

    if (requestType === "enrollment") {
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Afgewezen" } });
        res.redirect("/request");
    }

    if (requestType === "cancelEnrollment") {
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Afgewezen" } });
        res.redirect("/request");
    }
};

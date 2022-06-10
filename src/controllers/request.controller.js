const mongoose = require("../../database/dbconnection");
const Request = require("../models/request.model");
const User = require("../models/user.model");
const {assignmentModel} = require("../models/assignment.model");

const Assignment = assignmentModel;



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
    const { requestType, requestId, assignmentId } = req.body;

    if (requestType === "createAssignment") {
        await Assignment.findOneAndUpdate({ _id: assignmentId }, { $set: { isApproved: true } });
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Goedgekeurd" } });
        res.redirect("/request");
    }
};

exports.declineRequest = async (req, res) => {
    const { requestType, requestId, assignmentId } = req.body;

    if (requestType === "createAssignment") {
        await Request.findOneAndUpdate({ _id: requestId }, { $set: { status: "Afgewezen" } });
        res.redirect("/request");
    }
};

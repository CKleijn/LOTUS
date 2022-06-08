const mongoose = require("../../database/dbconnection");
const Request = require("../models/request.model");

exports.createRequest = (req, res, objectId) => {
    // Get session
    const session = req.session;
    // Create request
    const request = new Request({
        userId: session.user.userId,
        assignmentId: objectId.toString(),
    });
    // Save request
    request.save();
};

exports.getAllRequests = (req, res) => {
    res.render("request_overview", { pageName: "Verzoeken", session: req.session.user });
}

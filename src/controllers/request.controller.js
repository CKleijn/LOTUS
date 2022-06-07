const mongoose = require("../../database/dbconnection");

exports.getAllRequests = (req, res) => {
    res.render("request_overview", { pageName: "Verzoeken", session: req.session.user });
}

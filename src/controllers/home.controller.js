const { getAllValidUsers } = require("./../controllers/user.controller");
const Assignment = require("../models/assignment.model");

exports.getHomepage = (req, res) => {
    Assignment.find(function(err, results) {
        res.render("dashboard", { pageName: "Dashboard", session: req.session.user, assignments_amount: results.length });
    })
};

exports.getUserOverview = (req, res) => {
    (async () => {
        const allUsers = await getAllValidUsers();
        return res.render("user_overview", { pageName: "Gebruikers", session: req.session.user, allUsers });
    })();
};

exports.sendMessage = (req, res) => {
    res.send("Clicked on " + req.originalUrl.replace("/", "") + ".");
};

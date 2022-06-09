const { getAllValidMembers, getAllValidClients, getAllInvitedMembers } = require("./../controllers/user.controller");
const Assignment = require("../models/assignment.model");
const Request = require("../models/request.model");

exports.getHomepage = (req, res) => {
    if (req.session.user.roles == "coordinator" || req.session.user.roles == "member") {
        Assignment.find({ isApproved: true }, function (err, assignments) {

            if (req.session.user.roles == "coordinator") {
                Request.find(function (err, requests) {
                    res.render("dashboard", { pageName: "Dashboard", session: req.session.user, assignments_amount: assignments.length, request_amount: requests.length });
                })
            } else {
                res.render("dashboard", { pageName: "Dashboard", session: req.session.user, assignments_amount: assignments.length, request_amount: null });
            }
        });
    } else if (req.session.user.roles == "client") {
        Assignment.find(function (err, assignments) {
            let assignmentsFiltered = [];

            assignments.forEach((assignment) => {
                if (assignment.emailAddress == req.session.user.emailAddress) {
                    assignmentsFiltered.push(assignment);
                }
            });

            res.render("dashboard", { pageName: "Dashboard", session: req.session.user, assignments_amount: assignmentsFiltered.length, request_amount: null });
        }); 
    }
};

exports.getUserOverview = (req, res) => {
    (async () => {
        const allMembers = await getAllValidMembers();
        const allClients = await getAllValidClients();
        const allInvitedMembers = await getAllInvitedMembers();
        return res.render("user_overview", { pageName: "Gebruikers", session: req.session.user, allMembers, allClients, allInvitedMembers });
    })();
};

exports.sendMessage = (req, res) => {
    res.send("Clicked on " + req.originalUrl.replace("/", "") + ".");
};

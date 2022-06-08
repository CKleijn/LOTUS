const { getAllValidMembers, getAllInvitedClients, getAllInvitedMembers } = require("./../controllers/user.controller");
const Assignment = require("../models/assignment.model");

exports.getHomepage = (req, res) => {
    if (req.session.user.roles == "coordinator") {
        Assignment.find(function(err, assignments) {
            res.render("dashboard", { pageName: "Dashboard", session: req.session.user, assignments_amount: assignments.length });
        });
    } else if (req.session.user.roles == "client") {
        Assignment.find(function(err, assignments) {
            let assignmentsFiltered = []
    
            assignments.forEach(assignment => {
                if (assignment.emailAddress == req.session.user.emailAddress) {
                    assignmentsFiltered.push(assignment)
                }
            });

            res.render("dashboard", { pageName: "Dashboard", session: req.session.user, assignments_amount: assignmentsFiltered.length });
        })
    }

};

exports.getUserOverview = (req, res) => {
    (async () => {
        const allMembers = await getAllValidMembers();
        const allClients = await getAllInvitedClients();
        const allInvitedMembers = await getAllInvitedMembers();
        return res.render("user_overview", { pageName: "Gebruikers", session: req.session.user, allMembers, allClients, allInvitedMembers });
    })();
};

exports.sendMessage = (req, res) => {
    res.send("Clicked on " + req.originalUrl.replace("/", "") + ".");
};

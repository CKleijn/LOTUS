const session = require("express-session");

exports.getHomepage = (req, res) => {
    res.render("dashboard", { pageName: "Dashboard", roles: session.roles, firstName: session.firstname });
};

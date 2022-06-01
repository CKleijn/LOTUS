exports.getHomepage = (req, res) => {
    const session = req.session;

    res.render("dashboard", { pageName: "Dashboard", roles: session.roles, firstName: session.firstname });
};

exports.getUserOverview = (req, res) => {
    res.render("user_overview", { pageName: "Gebruikers" });
};

exports.sendMessage = (req, res) => {
    res.send("Clicked on " + req.originalUrl.replace("/", "") + ".");
};

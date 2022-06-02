exports.getHomepage = (req, res) => {
    const session = req.session;

    res.render("dashboard", { pageName: "Dashboard", session: req.session.user });
};

exports.getUserOverview = (req, res) => {
    res.render("user_overview", { pageName: "Gebruikers", session: req.session.user });
};

exports.sendMessage = (req, res) => {
    res.send("Clicked on " + req.originalUrl.replace("/", "") + ".");
};

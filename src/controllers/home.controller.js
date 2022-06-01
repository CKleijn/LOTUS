exports.getHomepage = (req, res) => {
    const session = req.session;

    res.render("dashboard", { pageName: "Dashboard", roles: session.roles, firstName: session.firstname });
};

exports.sendMessage = (req, res) => {
    res.send("Clicked on " + req.originalUrl.replace("/", "") + ".")
}
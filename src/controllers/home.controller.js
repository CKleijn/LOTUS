exports.getHomepage = (req, res) => {
    const session = req.session;

    res.render("dashboard", { pageName: "Dashboard", roles: session.roles, firstName: session.firstname });
};

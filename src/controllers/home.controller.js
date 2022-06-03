const { getAllValidUsers } = require("./../controllers/user.controller");

exports.getHomepage = (req, res) => {
    res.render("dashboard", { pageName: "Dashboard", session: req.session.user });
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

exports.getHomepage = (req, res) => {
    res.render("index", { pageName: "Home" });
};

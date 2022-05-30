const express = require("express");
const userController = require("./../controllers/user.controller");
const router = express.Router();

// router.get("/getallusers", userController.getAllUsers);
// router.get("/", userController.getUserById);
// router.put("/", userController.updateUserById);
// router.delete("/", userController.updateUserById);

//register client
router.get("/register", (req, res) => {
    res.render("register", { pageName: "Registreren" });
});

router.post("/register", userController.createUser);

//login client
router.get("/login", (req, res) => {
    var session = req.session;
  
    if (session.userRoles == "coordinator") {
        res.render("overviewCoordinator")
    } else if (session.userRoles == "client") {
        res.render("overviewClient")
    } else if (session.userRoles == "member") {
        res.render("overviewMember")
    } else {
        res.render("login", { pageName: "Inloggen" });
    }
});

router.get("/user_overview", (req, res) => {
    res.render("user_overview", { pageName: "Gebruikers" });
});

router.post("/login", userController.login);

module.exports = router;
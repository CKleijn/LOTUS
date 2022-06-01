const express = require("express");
const userController = require("./../controllers/user.controller");
const router = express.Router();

// router.get("/getallusers", userController.getAllUsers);
// router.get("/", userController.getUserById);
// router.put("/", userController.updateUserById);
// router.delete("/", userController.updateUserById);

router.get("/user_overview", (req, res) => {
    res.render("user_overview", { pageName: "Gebruikers" });
});

router.post("/create_member", userController.createMember);

module.exports = router;


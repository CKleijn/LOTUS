const express = require("express");
const userController = require("./../controllers/user.controller");
const { isLoggedIn } = require("./../controllers/auth.controller");
const router = express.Router();

router.post("/user/create", isLoggedIn, userController.createMember);

router.get("/user/profile", isLoggedIn, userController.getUserProfile);

router.post("/user/profile/edit", isLoggedIn, userController.changeUserProfileDetails);

router.post("/user/profile/password", isLoggedIn, userController.changePassword);

module.exports = router;

const express = require("express");
const userController = require("./../controllers/user.controller");
const { isLoggedIn } = require("./../controllers/auth.controller");
const router = express.Router();

router.post("/create_member", isLoggedIn, userController.createMember);

router.get("/user_profile", isLoggedIn, userController.getUserProfile);

router.post("/change_user_profile", isLoggedIn, userController.changeUserProfileDetails);

router.post("/change_password", isLoggedIn, userController.changePassword);

module.exports = router;

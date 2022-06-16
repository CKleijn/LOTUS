const express = require("express");
const userController = require("./../controllers/user.controller");
const { isLoggedIn } = require("./../controllers/auth.controller");
const router = express.Router();

const { loadPendingRequests } = require("./../controllers/auth.controller");

router.post("/user/roles", isLoggedIn, loadPendingRequests, userController.changeRoles);

router.post("/user/create", isLoggedIn, loadPendingRequests, userController.createMember);

router.get("/user/profile", isLoggedIn, loadPendingRequests, userController.getUserProfile);

router.post("/user/profile/edit", isLoggedIn, loadPendingRequests, userController.changeUserProfileDetails);

router.post("/user/profile/password", isLoggedIn, loadPendingRequests, userController.changePassword);

module.exports = router;

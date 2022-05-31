const express = require("express");
const authController = require("./../controllers/auth.controller");
const userController = require("./../controllers/user.controller");
const router = express.Router();

router.get("/login", authController.getLoginPage);

router.post("/login", authController.login);

router.get("/logout", authController.isLoggedIn, authController.logout);

router.get("/register", authController.getRegisterPage);

router.post("/register", userController.createUser);

router.get("/member_setup", authController.getSetupPage);

// router.post("/member_setup", userController.createMember);

module.exports = router;

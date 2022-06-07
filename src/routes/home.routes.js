const express = require("express");
const homeController = require("./../controllers/home.controller");
const { isLoggedIn, isCoordinator } = require("./../controllers/auth.controller");
const router = express.Router();

router.get("/", isLoggedIn, homeController.getHomepage);
// router.get("/", homeController.getHomepage);

router.get("/user_overview", isLoggedIn, isCoordinator, homeController.getUserOverview);

router.get("/settings", isLoggedIn, homeController.sendMessage);

module.exports = router;

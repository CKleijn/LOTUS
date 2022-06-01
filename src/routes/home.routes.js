const express = require("express");
const homeController = require("./../controllers/home.controller");
const { isLoggedIn } = require("./../controllers/auth.controller");
const router = express.Router();

router.get("/", isLoggedIn, homeController.getHomepage);

router.get("/assignment_overview", isLoggedIn, homeController.sendMessage);

router.get("/request_overview", isLoggedIn, homeController.sendMessage);

router.get("/settings", isLoggedIn, homeController.sendMessage);

module.exports = router;

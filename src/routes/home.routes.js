const express = require("express");
const homeController = require("./../controllers/home.controller");
const { isLoggedIn } = require("./../controllers/auth.controller");
const router = express.Router();

router.get("/", isLoggedIn, homeController.getHomepage);

module.exports = router;

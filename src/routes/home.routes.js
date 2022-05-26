const express = require("express");
const homeController = require("./../controllers/home.controller");
const router = express.Router();

router.get("/", homeController.getHomepage);

module.exports = router;

const express = require("express");
const requestController = require("../controllers/request.controller");
const { isLoggedIn } = require("./../controllers/auth.controller");
const router = express.Router();

router.get("/request_overview", isLoggedIn, requestController.getAllRequests);

module.exports = router;
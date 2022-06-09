const express = require("express");
const requestController = require("../controllers/request.controller");
const { isLoggedIn } = require("./../controllers/auth.controller");
const router = express.Router();

router.get("/request/overview", isLoggedIn, requestController.getAllRequests);

module.exports = router;

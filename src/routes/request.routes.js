const express = require("express");
const requestController = require("../controllers/request.controller");
const { isLoggedIn } = require("./../controllers/auth.controller");
const router = express.Router();

router.get("/request", isLoggedIn, requestController.getAllRequests);

router.post("/request/approve", isLoggedIn, requestController.approveRequest);

router.post("/request/decline", isLoggedIn, requestController.declineRequest);

module.exports = router;

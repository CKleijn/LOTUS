const express = require("express");
const assignmentController = require("../controllers/assignment.controller");
const { isLoggedIn } = require("./../controllers/auth.controller");
const router = express.Router();

router.get("/assignment", isLoggedIn, assignmentController.getAssignmentPage);

router.post("/assignment", isLoggedIn, assignmentController.createAssignment);

module.exports = router;
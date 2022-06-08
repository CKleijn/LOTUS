const express = require("express");
const assignmentController = require("../controllers/assignment.controller");
const { isLoggedIn } = require("./../controllers/auth.controller");
const router = express.Router();

router.get("/assignment", isLoggedIn, assignmentController.getAssignmentPage);

router.get("/assignment_overview", isLoggedIn, assignmentController.getAllAssignments);

router.post("/assignment", isLoggedIn, assignmentController.createAssignment);

router.get("/assignment_detail", isLoggedIn, assignmentController.getAssignmentDetailPage);

module.exports = router;
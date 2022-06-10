const express = require("express");
const assignmentController = require("../controllers/assignment.controller");
const { isLoggedIn } = require("./../controllers/auth.controller");
const router = express.Router();

router.get("/assignment/create", isLoggedIn, assignmentController.getAssignmentPage);

router.get("/assignment", isLoggedIn, assignmentController.getAllAssignments);

router.post("/assignment", isLoggedIn, assignmentController.createAssignment);

router.post("/assignment/delete", isLoggedIn, assignmentController.deleteAssignment)

router.get("/assignment/detail", isLoggedIn, assignmentController.getAssignmentDetailPage);

router.post("/assignment/enroll", isLoggedIn, assignmentController.enrollAssignment);

router.post("/assignment/cancel", isLoggedIn, assignmentController.cancelEnrollment);

module.exports = router;

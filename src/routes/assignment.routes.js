const express = require("express");
const assignmentController = require("../controllers/assignment.controller");
const { isLoggedIn } = require("./../controllers/auth.controller");
const router = express.Router();

router.get("/assignment/create", isLoggedIn, assignmentController.getAssignmentPage);

router.get("/assignment/update", isLoggedIn, assignmentController.getAssignmentUpdatePage);

router.get("/assignment", isLoggedIn, assignmentController.getAllAssignments);

router.get("/member/assignment", isLoggedIn, assignmentController.getMemberAssignments);

router.post("/assignment", isLoggedIn, assignmentController.createAssignment);

router.post("/assignment/update", isLoggedIn, assignmentController.updateAssignment)

router.post("/assignment/delete", isLoggedIn, assignmentController.deleteAssignment);

router.get("/assignment/detail", isLoggedIn, assignmentController.getAssignmentDetailPage);

router.post("/assignment/enroll", isLoggedIn, assignmentController.enrollAssignment);

router.post("/assignment/cancel", isLoggedIn, assignmentController.cancelEnrollment);

router.post("/assignment/member/delete", isLoggedIn, assignmentController.deleteMemberFromAssignment);

module.exports = router;
 
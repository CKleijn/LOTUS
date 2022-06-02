const express = require("express");
const assignmentController = require("../controllers/assignment.controller");
const router = express.Router();

router.get("/assignment", (req, res) => {
    res.render("assignment", { pageName: "Formulier" });
});

router.post("/assignment", assignmentController.createAssignment);

module.exports = router;
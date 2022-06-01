const express = require("express");
const userController = require("./../controllers/user.controller");
const router = express.Router();

// router.get("/getallusers", userController.getAllUsers);
// router.get("/", userController.getUserById);
// router.put("/", userController.updateUserById);
// router.delete("/", userController.updateUserById);

router.post("/create_member", userController.createMember);

module.exports = router;


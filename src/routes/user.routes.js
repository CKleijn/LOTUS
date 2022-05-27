const express = require("express");
const userController = require("./../controllers/user.controller");
const router = express.Router();

// router.get("/getallusers", userController.getAllUsers);
// router.get("/", userController.getUserById);
// router.put("/", userController.updateUserById);
// router.delete("/", userController.updateUserById);

//register client
router.get("/register", (req, res) => {
    // res.render("register", { firstNameErr: "", lastNameErr: "", emailAddressErr: "", passwordErr: "" });
    res.render("register");
});

router.post("/register", userController.createUser);

module.exports = router;

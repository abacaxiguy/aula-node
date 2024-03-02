const express = require("express");
const userController = require("../controllers/userController");
const loginRequired = require("../middlewares/loginRequired");

const router = express.Router();

router.post("/", userController.addUser);
router.put("/", loginRequired, userController.updateUser);
router.delete("/", loginRequired, userController.deleteUser);

module.exports = router;

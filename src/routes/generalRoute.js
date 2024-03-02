const express = require("express");
const generalController = require("../controllers/generalController");

const router = express.Router();

router.post("/login", generalController.login);

module.exports = router;

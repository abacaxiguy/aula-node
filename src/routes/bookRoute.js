const express = require("express");
const bookController = require("../controllers/bookController");
const loginRequired = require("../middlewares/loginRequired");

const router = express.Router();

router.post("/", loginRequired, bookController.addBook);
router.get("/", loginRequired, bookController.getBooks);

module.exports = router;
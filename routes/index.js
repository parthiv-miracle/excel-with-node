const express = require("express");
const { importUserListPdf } = require("../controllers/user.controller");
const router = express.Router();

router.get("/user/download-pdf", importUserListPdf);

module.exports = router;

const express = require("express");
const path = require("path");
const multer = require("multer");
const { importUsers, exportsUsers } = require("../controllers/user.controller");
const router = express.Router();

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (_, file, cb) => {
    cb(null, `import_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

router.post("/user/import", upload.single("file"), importUsers);
router.get("/user/export", exportsUsers);

module.exports = router;

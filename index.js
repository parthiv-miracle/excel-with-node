const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./utils/db");
connectDB();
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  // res.send("Welcome to the User...!");
  res.sendFile(__dirname + "/public/index.html");
});

app.use("/api", require("./routes/index"));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
// http://localhost:8888/api/user/import
// http://localhost:8888/api/user/export

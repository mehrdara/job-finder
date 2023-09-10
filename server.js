const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
app.use("/api/jobs", require("./routes/index"));
app.use("/api/results", require("./routes/results"));
app.listen(5000, () => {
  console.log("server started");
});

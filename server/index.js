const express = require("express");

const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/upload", (req, res) => {
  res.send("uploading said file and saving it to the database");
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

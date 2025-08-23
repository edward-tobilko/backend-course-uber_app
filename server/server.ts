import express = require("express");

const app = express();
const port = 3007;

app.get("/", (req, res) => {
  res.send("Orders");
});

app.get("/items", (req, res) => {
  setTimeout(() => {
    res.send("Items");
  }, 2000);
});

app.post("/items", (req, res) => {
  res.send("new item");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

console.log("ENTRY:", __filename);

import express = require("express");

const app = express();
const port = 3007;

app.get("/", (req, res) => {
  let a = 10;
  let b = 10;

  if (a > 7) {
    res.send("Orders");
  } else {
    res.send("Items");
  }
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

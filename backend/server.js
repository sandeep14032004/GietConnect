const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");

dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.send("API IS SUCCESSFULLY RUNNING");
});

app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  const singlechat = chats.find((c) => c._id === req.params.id);
  res.send(singlechat);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server started ${PORT}`));

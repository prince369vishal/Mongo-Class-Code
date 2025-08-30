require("dotenv").config();
const express = require("express");
const { UserModel, TodoModel } = require("./db");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());

const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.error("Connection Error", err));

app.post("/signup", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  await UserModel.create({ username, password, email });

  res.send({
    message: "User signed In",
  });
});
app.post("/signin", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const user = await UserModel.findOne({
    username: username,
    password: password,
  });
  ``;
  if (user) {
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.send({
      token,
    });
  } else {
    res.status(403).json({
      message: "Incorrect Credentials",
    });
  }
});
app.post("/todo", auth, async function (req, res) {
  const userId = req.userId;
  const title = req.body.title;
  const done = req.body.done;

  await TodoModel.create({
    userId,
    title,
    done,
  });

  res.send({
    message: "Todo Added",
  });
});
app.get("/todos", auth, function (req, res) {});

function auth(req, res, next) {
  const token = req.headers.token;

  const decodedData = jwt.verify(token, JWT_SECRET);

  if (decodedData) {
    req.userId = decodedData.id;
    next();
  } else {
    req.status(403).json({
      message: "Incorrect Credentials",
    });
  }
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

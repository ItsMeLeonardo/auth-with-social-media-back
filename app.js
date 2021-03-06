require("dotenv").config();
require("./mongo");

const express = require("express");
const cors = require("cors");
const passport = require("passport");
const UserRouter = require("./controllers/User");
const LoginRouter = require("./controllers/Login");
const notFount = require("./middlewares/notFound");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());

//endpoints
app.use("/api/users", UserRouter);
app.use("/api/auth", LoginRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello World! from azure + MongoDB" });
});

// unknown route
app.use(notFount);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

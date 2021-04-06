const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();
const connectConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(
    "mongodb+srv://siddharth:" +
      process.env.MONGO_ATLAS_PW +
      "@cluster0.wsd5h.mongodb.net/datis?w=majority",
    connectConfig
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed! ");
  });

app.use("/", express.static(path.join(__dirname, "../dist/datis-ui")));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../dist/datis-ui/index.html"));
});

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH,PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;

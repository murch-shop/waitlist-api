require("dotenv").config;
const express = require("express")
const mongoose = require("mongoose");

const users = require("./routes/api/users");

const app = express();
const PORT = process.env.PORT || 5000;

// Express JSON Middleware
app.use(express.json())

// Database Config
const db = require("./config/keys").mongoURI

// CORS Config
var cors = require ('cors');

app.use(cors({
    origin:['http://localhost:3000','http://127.0.0.1:3000', 'https://murch.shop'],
    credentials:true
}));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "http://localhost:3000");
  res.header('Access-Control-Allow-Headers', true);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});

// Connect Database (Mongo)
mongoose
    .connect(db)
    .then(() => console.log("Database connected..."))
    .catch((err) => console.log(err))

// Routes
app.use('/api/users', users);

app.listen(
    PORT,
    () => console.log("IT'S ALIVEEEEE!", `Check it out on https://localhost:${PORT}`)
);
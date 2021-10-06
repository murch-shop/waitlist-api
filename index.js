const express = require("express")
const mongoose = require("mongoose");

const users = require("./routes/api/users");

const app = express();
const PORT = process.env.PORT || 5000;

// Express JSON Middleware
app.use(express.json())

// Database Config
const db = require("./config/keys").mongoURI

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
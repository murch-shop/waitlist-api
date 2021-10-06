// User.js — model for waitlist signups
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User Params:
// first_name - First name of Content Creator
// last_name - Last name of Content Creator
// email - Email of Content Creator
// url - Any social media profile URL of content creator (for initial validation)
// date - Waitlist sign-up date of content creator

// Create Schema
const UserSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model("user", UserSchema);
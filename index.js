
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const app = express();

dotenv.config();
const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Database', {
    serverSelectionTimeoutMS: 5000
}).then(() => {
    console.log('MongoDB Connected');
}).catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const User = mongoose.model('User', {
    name: String,
    age: Number,
    email: String,
    phno: String,
    gender: String,
    password: String,
    confirmPassword: String
});

app.post("/sign_up", (req, res) => {
    var userData = req.body;

    User.create(userData)
        .then(user => {
            console.log("Record Inserted Successfully:", user);
            return res.redirect('/signup_successful.html'); // Redirect to success page
        })
        .catch(err => {
            console.error("Error inserting user:", err);
            return res.status(500).send("Error occurred while registering user.");
        });
});

app.post("/sign_in", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ email: email, password: password })
        .then(user => {
            if (user) {
                console.log("Sign In Successful:", user);
                return res.redirect('/signin_successful.html');
            } else {
                return res.status(401).send("Invalid email or password.");
            }
        })
        .catch(err => {
            console.error("Error during sign in:", err);
            return res.status(500).send("Error occurred while signing in.");
        });
});

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'style.css'));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/signup_successful.html", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup_successful.html'));
});

app.get("/signin_successful.html", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signin_successful.html'));
});

app.get("/sign_in", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sign_in.html'));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

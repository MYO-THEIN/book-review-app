const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    return !users.some(u => u.username.toLowerCase() == username.toLowerCase());
}

const authenticatedUser = (username, password)=>{
    return users.some(u => u.username.toLowerCase() == username.toLowerCase() && u.password == password);
}

// Task 7
// login
regd_users.post("/login", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).json({ "message": "Please enter both username and password" });
    } else if (!authenticatedUser(username, password)) {
        return res.status(400).json({ "message": "Invalid credentials" });
    }

    let accessToken = jwt.sign({ data: username }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ "message": "User successfully logged in" });
});

// Task 8
// Add/Modify a book review
regd_users.put("/auth/review/:isbn", (req, res)=>{
    if (!req.session.authorization) {
        return res.status(403).json({ "message": "Only authenticated users can give a review" });
    } else if (!(req.params.isbn in books)) {
        return res.status(404).json({ "message": "Book not found" });
    }

    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization["username"];
    books[isbn].reviews[username] = review;
    return res.status(200).json({ "message": "Reviewd successfully" });
});

// Task 9
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res)=>{
    if (!req.session.authorization) {
        return res.status(403).json({ "message": "Only authenticated users can delete a review" });
    } else if (!(req.params.isbn in books)) {
        return res.status(404).json({ "message": "Book not found" });
    }

    const isbn = req.params.isbn;
    const username = req.session.authorization["username"];
    if (username in books[isbn].reviews) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ "message": "Review has been deleted successfully" });
    } else {
        return res.status(200).json({ "message": "There is no review to delete at all" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6
// POST request: registering a new user
public_users.post("/register", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).json({ "message": "Please enter both username and password" });
    } else if (!isValid(username)) {
        return res.status(400).json({ "message": "Username already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ "message": "User successfully registered" });
});

// Task 1
// GET request: get the list of books available in the shop
public_users.get('/', (req, res)=>{
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2
// GET request: get the book details based on ISBN
public_users.get('/isbn/:isbn', (req, res)=>{
    let isbn = req.params.isbn;
    if (isbn in books) {
        let book = {
            "isbn": parseInt(isbn),
            ...books[isbn]
        };
        return res.status(200).send(JSON.stringify(book, null, 4));
    } else {
        return res.status(404).json({ "message": "Book not found" });
    }
});

// Task 3
// GET request: get the book details based on author
public_users.get('/author/:author', (req, res)=>{
    const author = req.params.author;
    let author_books = [];
    Object.keys(books).forEach(isbn => {
        if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
            author_books.push({
                "isbn": parseInt(isbn),
                ...books[isbn]
            });
        }
    });

    return res.status(200).send(JSON.stringify(author_books, null, 4));
});

// Task 4
// GET request: all books based on title
public_users.get('/title/:title', (req, res)=>{
    const title = req.params.title;
    let title_books = [];
    Object.keys(books).forEach(isbn => {
        if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
            title_books.push({
                "isbn": parseInt(isbn),
                ...books[isbn]
            });
        }
    });

    return res.status(200).send(JSON.stringify(title_books, null, 4));
});

// Task 5
// GET request: get the book reviews by ISBN
public_users.get('/review/:isbn', (req, res)=>{
    let isbn = req.params.isbn;
    if (isbn in books) {
        const reviews = books[isbn].reviews;
        if (Object.keys(reviews).length == 0) 
            return res.status(200).json({ "message": "No reviews" });
        else
            return res.status(200).send(JSON.stringify(reviews, null, 4));
    } else {
        return res.status(404).json({ "message": "Book not found" });
    }
});

module.exports.general = public_users;

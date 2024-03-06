const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const user = req.body.user;
  
    if (user.username && user.password) {
      if (!isValid(user.username)) { 
        users.push({"username":user.username,"password":user.password});
        return res.status(200).json({message: "User successfully registred"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let promise = new Promise((resolve,reject) => {
        resolve(books);
    });
    promise.then((value => res.status(200).send(JSON.stringify(value))));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    let promise = new Promise((resolve,reject) => {
        if(isbn !== undefined) {
            let bookByIsbn = books[isbn];
            resolve(bookByIsbn);
        }
    });
    

    promise.then((value) => {
        return res.status(200).send(JSON.stringify(value));
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    let promise = new Promise((resolve,reject) => {
        let keys = Object.keys(books);
        let booksByAuthors = keys.map(key => books[key]).filter(book => book.author === author);
        resolve(booksByAuthors)
    });
    

    promise.then((value) => {
        return res.status(200).send(JSON.stringify(value));
    });

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    let promise = new Promise((resolve,reject) => {
        let keys = Object.keys(books);
        let booksByTitle = keys.map(key => books[key]).filter(book => book.title === title);
        resolve(booksByTitle);
    });
    

    promise.then((booksByTitle) => {
        return res.status(200).send(JSON.stringify(booksByTitle));
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    let bookByIsbn = books[isbn];
    return res.status(200).send(JSON.stringify(bookByIsbn.reviews));
});

module.exports.general = public_users;

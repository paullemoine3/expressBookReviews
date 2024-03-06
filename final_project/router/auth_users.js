const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username;
      });
      return userswithsamename.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const user = req.body.user;

    if (!user) {
        return res.status(404).json({message: "Body Empty"});
    }
    if (authenticatedUser(user.username, user.password)) {
        let accessToken = jwt.sign({
            data: user
          }, 'access', { expiresIn: 60 * 60 });
    
          req.session.authorization = {
            accessToken
        }
        return res.status(200).send("User successfully logged in");
    }
    return res.status(404).json({message: "User not exist"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const session = jwt.decode(req.session.authorization.accessToken);

    if(isbn !== undefined && review !== undefined) {
        let username = session.data.username;

        let book = books[isbn];
        let response = "Review added : ";

        if(book.reviews[username] !== undefined) response = "Review modified : ";
        

        book.reviews[username] = review;
        books[isbn] = book;
        return res.status(200).send(JSON.stringify({ message: response,  book: books[isbn]}));
    }

    return res.status(400).json({message: "Missing isbn or review"});
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const session = jwt.decode(req.session.authorization.accessToken);
        let username = session.data.username;
        let book = books[isbn];

        if(book.reviews[username] !== undefined) delete book.reviews[username];

        books[isbn] = book;
        return res.status(200).send(JSON.stringify({ message: "Review deleted" }));
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

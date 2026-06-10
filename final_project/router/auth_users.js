const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const secretKey = 'test-secret-key';

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userExists = users.filter((user) => {
        return user.username === username;
    });
    if (userExists.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", async (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    try {
        if (!username || username === "") {
            throw new Error("Username is not provided");
        }
        if (!password || password === "") {
            throw new Error("Password is not provided");
        }
        const resp = await new Promise((resolve, reject) => {
            if (authenticatedUser(username, password)) {
                const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
                resolve({token, message: "User successfully logged in"});
            } else {
                resolve("Invalid Login. Check username and password");
            }
        });
        return res.status(200).json({data: resp});
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
    //Write your code here
    try {
        const username = req.tokenInfo.username;
        if (!username) {
            throw new Error("Missing Info");
        }
        const isbn = parseInt(req.params.isbn, 10);
        const review = req.body.review;
        if (!review || review === "") {
            throw new Error("Review is not provided");
        }
        const resp = await new Promise((resolve, reject) => {
            if (books[isbn]) {
                // check if review of same user already exists
                if (!books[isbn].hasOwnProperty('reviews')) {
                    books[isbn]['reviews'] = {};
                }
                books[isbn]['reviews'][username] = review;

                resolve({
                    message: "Review added/updated successfully",
                    reviews: books[isbn]['reviews']
                });
            } else {
                resolve("Book not found");
            }
        });
        return res.status(200).json({data: resp});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

regd_users.delete("/auth/review/:isbn", async (req, res) => {
    //Write your code here
    try {
        const username = req.tokenInfo.username;
        if (!username) {
            throw new Error("Missing Info");
        }
        const isbn = parseInt(req.params.isbn, 10);
        const resp = await new Promise((resolve, reject) => {
            if (books[isbn]) {
                // check if review of same user already exists
                if (
                    books[isbn].hasOwnProperty('reviews') &&
                    books[isbn]['reviews'].hasOwnProperty(username) &&
                    books[isbn]['reviews'][username]
                ) {
                    delete books[isbn]['reviews'][username];
                    resolve("Review deleted successfully");
                } else {
                    resolve("Review of user "+username+" not found");
                }
            } else {
                resolve("Book not found");
            }
        });
        return res.status(200).json({ "data": resp });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

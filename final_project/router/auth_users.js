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
regd_users.post("/login", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
    const username = req.body.username;
    const password = req.body.password;
    try {
        if (!username || username === "") {
            return res.status(500).json({message: "Username is not provided"});
        }
        if (!password || password === "") {
            return res.status(500).json({message: "Password is not provided"});
        }

        if (authenticatedUser(username, password)) {
            const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
            return res.status(200).json({ token, message: "User successfully logged in"});
        } else {
            return res.status(200).send({message: "Invalid Login. Check username and password"});
        }
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    try {
        const username = req.tokenInfo.username;
        if (!username) {
            return res.status(200).json({message: 'missing info'});
        }
        const isbn = parseInt(req.params.isbn, 10);
        const review = req.body.review;
        if (!review || review === "") {
            return res.status(500).json({message: "Review is not provided"});
        }
        const reviews = await new Promise((resolve, reject) => {
            if (books[isbn]) {
                // check if review of same user already exists
                if (!books[isbn].hasOwnProperty('reviews')) {
                    books[isbn]['reviews'] = {};
                }
                books[isbn]['reviews'][username] = review;

                return res.status(200).send("Review added/updated successfully");
            } else {
                return res.status(200).send("Book not found");
            }
        });
        return res.status(200).send(JSON.stringify(reviews,null,4));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

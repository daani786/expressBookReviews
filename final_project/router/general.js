const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
    const username = req.body.username;
    const password = req.body.password;
    try {
        if (!username || username === "") {
            return res.status(500).json({message: "Username is not provided"});
        }
        if (!password || password === "") {
            return res.status(500).json({message: "Password is not provided"});
        }
        if (!isValid(username)) {
            return res.status(500).json({message: "User already exists"});
        }

        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    try {
        //Write your code here
        //  return res.status(300).json({message: "Yet to be implemented"});
        let data = await new Promise((resolve, reject) => {
            if (books) {
                resolve(books);
            } else {
                reject(new Error("Books not found"));
            }
        });
        return res.status(200).send(JSON.stringify(data,null,4));
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
    try {
        const isbn = parseInt(req.params.isbn, 10);
        const book = await new Promise((resolve, reject) => {
            const result = books[isbn];
            if (result) {
                resolve(result);
            } else {
                reject(new Error("Book not found"));
            }
        });
        return res.status(200).send(JSON.stringify(book,null,4));
    } catch (error) {
        return res.status(500).send(error.message);
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
      try {
        const author = req.params.author;
        const bookArr = await new Promise((resolve, reject) => {
            //const result = books.filter((book) => book.author === author);
            let result = {};
            for (const key in books) {
                if (books.hasOwnProperty(key)) {
                    if (
                        books[key].hasOwnProperty('author') &&
                        books[key]['author'] === author
                    ) {
                        result[key] = books[key];
                    }
                }
            }

            if (Object.keys(result).length > 0) {
                resolve(result);
            } else {
                reject(new Error("Book not found"));
            }
        });
        return res.status(200).send(JSON.stringify(bookArr,null,4));
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
    try {
        const title = req.params.title;
        const bookArr = await new Promise((resolve, reject) => {
            //const result = books.filter((book) => book.author === author);
            let result = {};
            for (const key in books) {
                if (books.hasOwnProperty(key)) {
                    if (
                        books[key].hasOwnProperty('title') &&
                        books[key]['title'] === title
                    ) {
                        result[key] = books[key];
                    }
                }
            }

            if (Object.keys(result).length > 0) {
                resolve(result);
            } else {
                reject(new Error("Book not found"));
            }
        });
        return res.status(200).send(JSON.stringify(bookArr,null,4));
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
    try {
        const isbn = parseInt(req.params.isbn, 10);
        const reviews = await new Promise((resolve, reject) => {
            const result = books[isbn];
            if (result) {
                if (
                    result.hasOwnProperty('reviews') &&
                    Object.keys(result['reviews']).length > 0
                ) {
                    resolve(result['reviews']);
                } else {
                    reject(new Error("Review not found"));
                }
            } else {
                reject(new Error("Book not found"));
            }
        });
        return res.status(200).send(JSON.stringify(reviews,null,4));
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

module.exports.general = public_users;

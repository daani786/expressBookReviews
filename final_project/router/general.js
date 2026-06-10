const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", async (req,res) => {
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
        
        const resp = await new Promise((resolve, reject) => {
            if (!isValid(username)) {
                resolve("User already exists");
            }
            users.push({"username": username, "password": password});
            resolve("User successfully registered. Now you can login");
        });
        
        return res.status(200).json({data: resp});
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    try {
        //Write your code here
        //  return res.status(300).json({message: "Yet to be implemented"});
        let resp = await new Promise((resolve, reject) => {
            if (books) {
                resolve(books);
            } else {
                resolve("Books not found");
            }
        });
        return res.status(200).json({data: resp});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
    try {
        const isbn = parseInt(req.params.isbn, 10);
        const resp = await new Promise((resolve, reject) => {
            const result = books[isbn];
            if (result) {
                resolve(result);
            } else {
                resolve("Book not found");
            }
        });
        return res.status(200).json({data: resp});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
      try {
        const author = req.params.author;
        const resp = await new Promise((resolve, reject) => {
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
                resolve("Book not found");
            }
        });
        return res.status(200).json({data: resp});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
    try {
        const title = req.params.title;
        const resp = await new Promise((resolve, reject) => {
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
                resolve("Book not found");
            }
        });
        return res.status(200).json({data: resp});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
    try {
        const isbn = parseInt(req.params.isbn, 10);
        const resp = await new Promise((resolve, reject) => {
            const result = books[isbn];
            if (result) {
                if (result.hasOwnProperty('reviews')) {
                    resolve(result['reviews']);
                }
            } else {
                resolve("Book not found");
            }
        });
        return res.status(200).json({data: resp});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports.general = public_users;

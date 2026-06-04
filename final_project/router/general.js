const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    try {
        //Write your code here
        //  return res.status(300).json({message: "Yet to be implemented"});
        let data = await Promise.resolve(books);
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
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

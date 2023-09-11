const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

const isExist = (name) => {
  return Boolean(users.filter(({ username }) => username === name).length);
};

public_users.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isExist(username)) {
      return res.status(400).json({ message: 'user already exist' });
    } else {
      users.push({
        username,
        password,
      });
      return res
        .status(200)
        .json({ message: 'Customer successfully registered.Now you can log in.' });
    }
  }

  return res.status(404).json({ message: 'Unable to register user.' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const target = req.params.author;
  const booksByAuthor = Object.values(books).filter(({ author }) =>
    author?.toLowerCase().match(target?.toLowerCase()),
  );
  return res.status(200).json({ booksByAuthor });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const target = req.params.title;
  const booksByTitle = Object.values(books).filter(({ title }) =>
    title?.toLowerCase().match(target?.toLowerCase()),
  );
  return res.status(200).json({ booksByTitle });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;

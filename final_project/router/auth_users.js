const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (name, pass) => {
  return users.find(({ username, password }) => username === name && password === pass);
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (authenticatedUser(username, password)) {
      const accessToken = jwt.sign(
        {
          password,
          username,
        },
        'access',
        { expiresIn: 60 * 60 },
      );

      req.session.authorization = {
        accessToken,
        username,
      };

      return res.status(200).json({ message: 'User successfully logged in' });
    }
    return res.status(208).json({ message: 'Invalid Login. Check username and password' });
  }

  return res.status(404).json({ message: 'Unable to log in' });
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const { review } = req.query;
  const isbn = req.params.isbn;
  const book = books[isbn];
  const user = req.session.authorization.username;
  book.reviews[user] = review;

  return res
    .status(200)
    .json({ message: `The review for the book with ISBN - ${isbn} has been added/updated`, books });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const user = req.session.authorization.username;
  const book = books[isbn];

  if (book.reviews[user]) {
    delete book.reviews[user];

    return res
      .status(200)
      .json({ message: `Reviews for the ISBN ${isbn} posted by the user ${user} deleted` });
  } else {
    return res.status(200).json({ message: `Theare is nothing to delete` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

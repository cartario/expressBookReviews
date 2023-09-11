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
          data: password,
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
  //Write your code here
  return res.status(300).json({ message: 'Yet to be implemented' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

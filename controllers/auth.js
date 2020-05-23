const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  //It displays [] on empty so check if size is greater than 1 to display flash message
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // On login, find the user with email
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid Email or Password!');
        return res.redirect('/login');
      }
      // Compare the hash
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          // If the hash matches then redirect
          if (doMatch) {
            // Set the session isLoggedIn
            req.session.isLoggedIn = true;
            // Set the user details in session
            req.session.user = user;
            // Save the session right away before redirecing to avoid any side effects
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid Email or Password!');
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then(userDoc => {
      //IF user with that email already exists
      if (userDoc) {
        req.flash('error', `Account with ${email} already exists!`);
        return res.redirect('/signup');
      }
      //Hash the password
      return bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  // Remove the session cookies on logout
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

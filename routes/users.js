const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const shortid = require('shortid');
// Load User model
const User = require('../models/User');
const HealthCenter = require('../models/HealthCenter');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => {
  HealthCenter.find({}).then(center => {
    res.render('register', {centers: center})
  })
});

router.get('/patient', forwardAuthenticated, (req, res) => res.render('patient'));


// Register
router.post('/register', (req, res) => {
  const { username, fullName, email, password, password2, role, staffID, centerName, centerAddress, existingCenter } = req.body;
  let errors = [];
  let centers = HealthCenter.find({})

  console.log(centers)
  if (!username|| !fullName || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) { 
    res.render('register', {
      errors,
      username,
      fullName,
      email,
      password,
      password2,
      centers: centers
    });
  } else {
    User.findOne({ username: username }).then(user => {
      if (user) {
        errors.push({ msg: 'Username already exists' });
        res.render('register', {
          errors,
          username,
          fullName,
          email,
          password,
          password2,
          centers: centers
        });
      } else {
        const newUser = new User({
          username,
          fullName,
          email,
          password,
          role,
          staffID
        });
        
        if(role === "Specialist") {
          if(!centerName && !centerAddress) {
            newUser.healthCenter = existingCenter;
          }
          else {
            const newHealthCenter = new HealthCenter({
              centerName,
              centerAddress,
            });
            newHealthCenter.save()
            newUser.healthCenter = newHealthCenter;
          }
          
          
        }

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;

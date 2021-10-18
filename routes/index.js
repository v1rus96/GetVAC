const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const HealthCenter = require('../models/HealthCenter');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res, next) =>
  res.render('dashboard', {
    user: req.user
  })
);

module.exports = router;

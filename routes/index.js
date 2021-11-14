const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const HealthCenter = require('../models/HealthCenter');
const Vaccine = require('../models/Vaccine');
const User = require('../models/User');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('login'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res, next) => {
  if(req.user.role === "Specialist") {
    User.find({username: req.user.username}).populate({ 
      path: 'healthCenter',
      populate: {
        path: 'batches',
        model: 'Batch',
        populate: {
          path: 'vaccinations',
          model: 'Vaccination',
        }
      } 
   }).then(center => {
    Vaccine.find({
      "batches": {
        "$in": 
          center[0].healthCenter.batches
        
      }
    }).then(c => {
     
      User.find({}).then(v => {
        res.render('dashboard', {
          user: req.user,
          center: center[0].healthCenter,
          vaccine: c,
          all: v
        })
      })
        
      }
      
      );
  });

  }else{
    HealthCenter.find().populate('batches').then(c => {
    res.render('admin', {
      user: req.user,
      clinic: c
    })
  })
}
});

module.exports = router;

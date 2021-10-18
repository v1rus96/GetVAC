const express = require("express");
const shortid = require("shortid");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const HealthCenter = require("../models/HealthCenter");
const Vaccine = require("../models/Vaccine");
const Batch = require("../models/Batch");

router.get("/record", ensureAuthenticated, (req, res, next) => {
  let batchID = shortid.generate()
  let vaccines = Vaccine.find({}, function (err, vaccines) {
    if (err) {
      console.log(err);
    } else {
      let centers = HealthCenter.find({}, function (err2, centers) {
        if (err2) {
          console.log(err2);
        } else {
          res.render("record-batch", {
            user: req.user,
            vaccines: vaccines,
            centers: centers,
            generatedID: batchID
          });
        }
      });
    }
  });
});

router.post("/record/done", (req, res) => {
  const { expiryDate, availableQuantity, vaccineID } = req.body;
  let errors = [];
  let user = req.user;
  let generatedID = shortid.generate();
  console.log(expiryDate)
  console.log(availableQuantity)
  console.log(generatedID)
  if (!expiryDate || !availableQuantity || !vaccineID) {
    errors.push({ msg: "Please enter all fields" });
  }
  if (errors.length > 0) {
    res.render("record-batch", {
      user,
      generatedID,
      vaccines,
      centers,
      errors,
      expiryDate,
      vaccineID,
    });
  } else {
    const newBatch = new Batch({
        batchID: String(generatedID),
        expiryDate: Date(expiryDate),
        availableQuantity: availableQuantity,
        administratedQuantity: 0
        });
    Vaccine.findOne({ vaccineID: vaccineID}).then((vaccine) => {
      vaccine.batches.push(newBatch);
      vaccine.save().then(vaccine => {
        req.flash(
          'success_msg',
          'You succesfully added the vaccine'
        );
        res.redirect('/dashboard');
      })
      .catch(err => console.log(err));
    });
  }
});

module.exports = router;

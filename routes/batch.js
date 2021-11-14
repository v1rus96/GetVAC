const express = require("express");
const shortid = require("shortid");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const HealthCenter = require("../models/HealthCenter");
const Vaccine = require("../models/Vaccine");
const Batch = require("../models/Batch");
const Vaccination = require("../models/Vaccination");
const User = require("../models/User");

router.get("/record", ensureAuthenticated, (req, res, next) => {
  let batchID = shortid.generate();
  User.find({ username: req.user.username })
    .populate("healthCenter")
    .then((center) => {
      res.render("record-batch", {
        user: req.user,
        center: center[0].healthCenter,
        generatedID: batchID,
      });
    });
});

router.post("/record/:id/done", (req, res, next) => {
  const { expiryDate, availableQuantity, vaccineID } = req.body;
  let errors = [];
  let user = req.user;
  let generatedID = req.params.id;
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
      administratedQuantity: 0,
    });
    newBatch.save();
    Vaccine.updateOne(
      { vaccineID: vaccineID },
      { $push: { batches: newBatch } }
    ).then((vaccine) => {
      req.flash("success_msg", "Added");
    });
    HealthCenter.updateOne(
      { _id: req.user.healthCenter },
      { $push: { batches: newBatch } }
    ).then((vaccine) => {
      req.flash("success_msg", "Added");
      res.redirect("/batch/view");
    });
  }
});

router.get("/view", ensureAuthenticated, (req, res) => {
  Vaccine.find({ vaccineID: 1 }, { batches: 1 })
    .populate("batches")
    .then((pfizer) => {
      Vaccine.find({ vaccineID: 2 }, { batches: 1 })
        .populate("batches")
        .then((moderna) => {
          Vaccine.find({ vaccineID: 3 }, { batches: 1 })
            .populate("batches")
            .then((jj) => {
              User.find({ username: req.user.username })
                .populate("healthCenter")
                .then((center) => {
                  res.render("view-batch", {
                    user: req.user,
                    vaccineP: pfizer[0],
                    pfizer: pfizer[0].batches,
                    moderna: moderna[0].batches,
                    jj: jj[0].batches,
                    center: center[0].healthCenter,
                  });
                });
            });
        });
    });
});

router.get("/:id", ensureAuthenticated, (req, res) => {
  Vaccine.find({ vaccineID: 1 }, { batches: 1 })
    .populate("batches")
    .then((pfizer) => {
      Vaccine.find({ vaccineID: 2 }, { batches: 1 })
        .populate("batches")
        .then((moderna) => {
          Vaccine.find({ vaccineID: 3 }, { batches: 1 })
            .populate("batches")
            .then((jj) => {
              HealthCenter.find({ _id: req.params.id }).then((center) => {
                res.render("batch-choice", {
                  user: req.user,
                  pfizer: pfizer[0].batches,
                  moderna: moderna[0].batches,
                  jj: jj[0].batches,
                  center: center[0],
                });
              });
            });
        });
    });
});

router.post("/view", ensureAuthenticated, (req, res) => {
  Vaccine.find({ vaccineID: req.body.vaccineID }, { batches: 1 })
    .populate("batches")
    .then((vaccine) => {
      console.log(vaccine[0].batches);
      res.render("view-batch", {
        user: req.user,
        batches: vaccine[0].batches,
      });
    });
});

router.post("/:center/:id/booked", ensureAuthenticated, (req, res) => {
  const date = req.body.schedule_date;
  console.log(req.params.id);
  const newAppointment = new Vaccination({
    vaccinationID: "gg123",
    status: "New",
    appointmentDate: date,
  });
  newAppointment.save();
  User.updateOne(
    { username: req.user.username },
    { $push: { vaccinations: newAppointment } }
  ).then((appointment) => {
    req.flash("success_msg", "Added");
  });
  Batch.updateOne(
    { batchID: req.params.id },
    { $push: { vaccinations: newAppointment } }
  ).then((appointment) => {
    req.flash("success_msg", "Added");
  });
  HealthCenter.find({ _id: req.params.center }).then((center) => {
    res.render("booked", {
      user: req.user,
      center: center,
    });
  });
});

module.exports = router;

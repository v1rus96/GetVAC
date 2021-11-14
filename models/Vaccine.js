const mongoose = require('mongoose');
const Batch = require('../models/Batch');

const VaccineSchema = new mongoose.Schema({
  vaccineID: {
    type: Number
  },
  name: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
  },
  batches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: Batch
  }]
});

const Vaccine = mongoose.model('Vaccine', VaccineSchema);

module.exports = Vaccine;

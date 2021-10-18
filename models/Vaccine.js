const mongoose = require('mongoose');

const VaccineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
  },
  batches: {
    type: Array
  },
  vaccineID: {
    type: Number
  }
});

const Vaccine = mongoose.model('Vaccine', VaccineSchema);

module.exports = Vaccine;

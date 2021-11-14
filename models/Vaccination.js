const mongoose = require('mongoose');

const VaccinationSchema = new mongoose.Schema({
  vaccinationID: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  }
});

const Vaccination = mongoose.model('Vaccination', VaccinationSchema);

module.exports = Vaccination;

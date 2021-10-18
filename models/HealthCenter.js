const mongoose = require('mongoose');

const HealthCenterSchema = new mongoose.Schema({
  centerName: {
    type: String,
    required: true
  },
  centerAddress: {
    type: String,
    required: true
  },
  staff: {
    type: Array,
  }
});

const HealthCenter = mongoose.model('HealthCenter', HealthCenterSchema);

module.exports = HealthCenter;

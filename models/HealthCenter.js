const mongoose = require('mongoose');
const Batch = require('../models/Batch');

const HealthCenterSchema = new mongoose.Schema({
  centerName: {
    type: String,
    required: true
  },
  centerAddress: {
    type: String,
    required: true
  },
  batches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: Batch
  }]
});

const HealthCenter = mongoose.model('HealthCenter', HealthCenterSchema);

module.exports = HealthCenter;

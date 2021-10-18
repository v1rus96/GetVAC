const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
  batchID: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  availableQuantity: {
    type: Number,
    required: true
  },
  administratedQuantity: {
    type: Number,
    default: 0
  }
});

const Batch = mongoose.model('Batch', BatchSchema);

module.exports = Batch;

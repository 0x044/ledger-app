const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['operational', 'under_repair', 'maintenance'],
    default: 'operational',
  },
  repairHistory: [{
    type: {
      type: String,
      enum: ['mechanical', 'electrical'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['ongoing', 'completed'],
      default: 'ongoing'
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Machine', machineSchema);

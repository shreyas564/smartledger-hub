const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  // The 'head' and 'employees' will be populated dynamically by the API route
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);